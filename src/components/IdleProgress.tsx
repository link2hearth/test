import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { IdleService } from '../services/idleService';
import { Clock, TrendingUp, Coins, Gem } from 'lucide-react';

export const IdleProgress: React.FC = () => {
  const { gameState, updateResources } = useGameState();
  const [idleTime, setIdleTime] = useState(0);
  const [showOfflineRewards, setShowOfflineRewards] = useState(false);
  const [offlineRewards, setOfflineRewards] = useState<{ coins: number; gems: number }>({ coins: 0, gems: 0 });

  useEffect(() => {
    // Check for offline progress when component mounts
    const timeAway = Date.now() - gameState.lastSave;
    if (timeAway > 30000) { // If away for more than 30 seconds
      const rewards = IdleService.generateIdleResources(
        timeAway,
        gameState.resources,
        gameState.stats.prestigeLevel
      );
      
      const coinsGained = (rewards.coins || gameState.resources.coins) - gameState.resources.coins;
      const gemsGained = (rewards.gems || gameState.resources.gems) - gameState.resources.gems;
      
      if (coinsGained > 0 || gemsGained > 0) {
        setOfflineRewards({ coins: coinsGained, gems: gemsGained });
        setShowOfflineRewards(true);
      }
    }

    // Set up real-time idle progression
    const interval = setInterval(() => {
      setIdleTime(prev => prev + 1);
      
      // Generate resources every second
      const newResources = IdleService.generateIdleResources(
        1000,
        gameState.resources,
        gameState.stats.prestigeLevel
      );
      
      updateResources(newResources);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const claimOfflineRewards = () => {
    updateResources({
      coins: gameState.resources.coins + offlineRewards.coins,
      gems: gameState.resources.gems + offlineRewards.gems
    });
    setShowOfflineRewards(false);
  };

  const coinsPerSecond = 1 + gameState.stats.prestigeLevel;
  const gemsPerSecond = 0.1;

  return (
    <div className="space-y-4">
      {/* Offline Rewards Modal */}
      {showOfflineRewards && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-cyan-500/30">
            <div className="text-center">
              <Clock className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Welcome Back!</h3>
              <p className="text-gray-300 mb-6">
                You earned rewards while away:
              </p>
              
              <div className="space-y-3 mb-6">
                {offlineRewards.coins > 0 && (
                  <div className="flex items-center justify-center space-x-2 bg-yellow-500/20 p-3 rounded-lg">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-lg">
                      +{offlineRewards.coins.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {offlineRewards.gems > 0 && (
                  <div className="flex items-center justify-center space-x-2 bg-purple-500/20 p-3 rounded-lg">
                    <Gem className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-bold text-lg">
                      +{offlineRewards.gems.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={claimOfflineRewards}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 
                         hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg 
                         transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Claim Rewards
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Idle Progress Panel */}
      <div className="bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
          Idle Progress
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Coins/sec</span>
              <div className="flex items-center space-x-1">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">
                  {coinsPerSecond.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Based on prestige level: {gameState.stats.prestigeLevel}
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Gems/sec</span>
              <div className="flex items-center space-x-1">
                <Gem className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-semibold">
                  {gemsPerSecond.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Passive generation
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-sm text-gray-400">
            Active for: {IdleService.formatTime(idleTime)}
          </div>
        </div>
      </div>
    </div>
  );
};