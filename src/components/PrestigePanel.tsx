import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { Star, RotateCcw, TrendingUp } from 'lucide-react';

export const PrestigePanel: React.FC = () => {
  const { gameState, updateResources, updateStats } = useGameState();
  
  const canPrestige = gameState.resources.level >= 50;
  const prestigeCost = Math.pow(2, gameState.stats.prestigeLevel) * 1000000; // Exponential cost
  const prestigeBonus = (gameState.stats.prestigeLevel + 1) * 0.5; // 50% bonus per prestige

  const handlePrestige = () => {
    if (canPrestige && gameState.resources.coins >= prestigeCost) {
      // Reset progress but keep prestige benefits
      updateResources({
        coins: 1000,
        gems: gameState.resources.gems, // Keep gems
        energy: 100,
        maxEnergy: 100,
        exp: 0,
        level: 1
      });

      updateStats({
        prestigeLevel: gameState.stats.prestigeLevel + 1,
        totalSummons: 0, // Reset summon count
        totalUpgrades: 0 // Reset upgrade count
      });

      // Clear inventory except mythic items
      const mythicItems = gameState.inventory.filter(item => item.rarity === 'mythic');
      // In a real implementation, you'd update the inventory here
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/90 backdrop-blur-sm p-6 rounded-lg border border-cyan-500/30">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Star className="w-6 h-6 mr-2 text-yellow-400" />
          Prestige System
        </h2>
        
        <p className="text-gray-300 mb-6">
          Reset your progress to gain permanent bonuses and unlock new content.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Status */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Current Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Prestige Level:</span>
                <span className="text-yellow-400 font-bold">
                  {gameState.stats.prestigeLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Current Level:</span>
                <span className="text-white">{gameState.resources.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Idle Bonus:</span>
                <span className="text-green-400">+{prestigeBonus * 100}%</span>
              </div>
            </div>
          </div>

          {/* Prestige Benefits */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Next Prestige</h3>
            {canPrestige ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Cost:</span>
                  <span className="text-red-400">{prestigeCost.toLocaleString()} coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">New Bonus:</span>
                  <span className="text-green-400">+{((gameState.stats.prestigeLevel + 1) * 0.5 * 100)}%</span>
                </div>
                <div className="text-xs text-gray-400">
                  • Keep all gems and mythic items
                  • Increase idle generation rate
                  • Unlock new content
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p>Reach level 50 to unlock prestige</p>
                <p className="text-sm mt-2">
                  Progress: {gameState.resources.level}/50
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((gameState.resources.level / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prestige Button */}
        {canPrestige && (
          <div className="mt-6 text-center">
            <button
              onClick={handlePrestige}
              disabled={gameState.resources.coins < prestigeCost}
              className={`
                py-4 px-8 rounded-lg font-bold text-white transition-all duration-300
                ${gameState.resources.coins >= prestigeCost
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl'
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5" />
                <span>Prestige Now</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};