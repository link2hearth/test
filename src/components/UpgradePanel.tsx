import React, { useState } from 'react';
import { Item } from '../types/game';
import { useGameState } from '../hooks/useGameState';
import { GachaService } from '../services/gachaService';
import { ItemCard } from './ItemCard';
import { TrendingUp, Coins, Star } from 'lucide-react';

export const UpgradePanel: React.FC = () => {
  const { gameState, spendResources, updateStats } = useGameState();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const upgradeableItems = gameState.inventory
    .filter(item => item.level < 100) // Max level cap
    .sort((a, b) => b.power - a.power);

  const handleUpgrade = (item: Item) => {
    const cost = GachaService.calculateUpgradeCost(item);
    
    if (spendResources(cost, 'coins')) {
      const upgradedItem = GachaService.upgradeItem(item);
      
      // Update inventory
      const newInventory = gameState.inventory.map(invItem => 
        invItem.id === item.id ? upgradedItem : invItem
      );
      
      updateStats({
        totalUpgrades: gameState.stats.totalUpgrades + 1
      });
      
      setSelectedItem(upgradedItem);
    }
  };

  const handleStarUpgrade = (item: Item) => {
    const cost = item.stars * 1000; // Star upgrade costs more
    
    if (spendResources(cost, 'gems') && item.stars < 5) {
      const starredItem = {
        ...item,
        stars: item.stars + 1,
        power: Math.floor(item.power * 1.5) // 50% power boost per star
      };
      
      const newInventory = gameState.inventory.map(invItem => 
        invItem.id === item.id ? starredItem : invItem
      );
      
      setSelectedItem(starredItem);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-cyan-400" />
          Upgrade Center
        </h2>
        
        <p className="text-gray-300 text-sm">
          Enhance your items to increase their power and unlock new potential.
        </p>
      </div>

      {/* Upgradeable Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {upgradeableItems.map((item) => (
          <div key={item.id} className="relative">
            <ItemCard
              item={item}
              onClick={() => setSelectedItem(item)}
            />
            <div className="absolute bottom-2 right-2 bg-black/70 rounded-full p-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {upgradeableItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">No items to upgrade</h3>
          <p className="text-gray-400">
            All your items are at maximum level or you have no items yet.
          </p>
        </div>
      )}

      {/* Upgrade Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-cyan-500/30">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedItem.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedItem.name}</h3>
              <div className="flex items-center justify-center space-x-2 text-cyan-400">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xl font-bold">{selectedItem.power}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Level Upgrade</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Level:</span>
                  <span className="text-white">{selectedItem.level} → {selectedItem.level + 1}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300">Power:</span>
                  <span className="text-green-400">
                    {selectedItem.power} → {Math.floor(selectedItem.power * 1.2)}
                  </span>
                </div>
                
                <button
                  onClick={() => handleUpgrade(selectedItem)}
                  disabled={gameState.resources.coins < GachaService.calculateUpgradeCost(selectedItem)}
                  className={`
                    w-full py-2 px-4 rounded-lg font-bold transition-all duration-300
                    ${gameState.resources.coins >= GachaService.calculateUpgradeCost(selectedItem)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Coins className="w-4 h-4" />
                    <span>{GachaService.calculateUpgradeCost(selectedItem)}</span>
                  </div>
                </button>
              </div>

              {selectedItem.stars < 5 && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Star Upgrade</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Stars:</span>
                    <span className="text-white">{selectedItem.stars} → {selectedItem.stars + 1}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-300">Power Boost:</span>
                    <span className="text-yellow-400">+50%</span>
                  </div>
                  
                  <button
                    onClick={() => handleStarUpgrade(selectedItem)}
                    disabled={gameState.resources.gems < selectedItem.stars * 1000}
                    className={`
                      w-full py-2 px-4 rounded-lg font-bold transition-all duration-300
                      ${gameState.resources.gems >= selectedItem.stars * 1000
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>{selectedItem.stars * 1000}</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};