import React, { useState, useMemo } from 'react';
import { Item, ItemFamily, Rarity } from '../types/game';
import { useGameState } from '../hooks/useGameState';
import { ItemCard } from './ItemCard';
import { GachaService } from '../services/gachaService';
import { Filter, SortDesc, TrendingUp } from 'lucide-react';

export const Inventory: React.FC = () => {
  const { gameState, spendResources, updateStats } = useGameState();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filterFamily, setFilterFamily] = useState<ItemFamily | 'all'>('all');
  const [filterRarity, setFilterRarity] = useState<Rarity | 'all'>('all');
  const [sortBy, setSortBy] = useState<'power' | 'rarity' | 'recent'>('power');

  const filteredAndSortedItems = useMemo(() => {
    let filtered = gameState.inventory;

    // Apply filters
    if (filterFamily !== 'all') {
      filtered = filtered.filter(item => item.family === filterFamily);
    }
    if (filterRarity !== 'all') {
      filtered = filtered.filter(item => item.rarity === filterRarity);
    }

    // Apply sorting
    switch (sortBy) {
      case 'power':
        filtered.sort((a, b) => b.power - a.power);
        break;
      case 'rarity':
        filtered.sort((a, b) => {
          const rarityOrder = Object.values(Rarity);
          return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
        });
        break;
      case 'recent':
        filtered.sort((a, b) => b.obtainedAt - a.obtainedAt);
        break;
    }

    return filtered;
  }, [gameState.inventory, filterFamily, filterRarity, sortBy]);

  const handleUpgrade = (item: Item) => {
    const cost = GachaService.calculateUpgradeCost(item);
    
    if (spendResources(cost, 'coins')) {
      const upgradedItem = GachaService.upgradeItem(item);
      
      // Update the item in inventory
      const newInventory = gameState.inventory.map(invItem => 
        invItem.id === item.id ? upgradedItem : invItem
      );
      
      updateStats({
        totalUpgrades: gameState.stats.totalUpgrades + 1
      });
      
      setSelectedItem(upgradedItem);
    }
  };

  const totalPower = gameState.inventory.reduce((sum, item) => sum + item.power, 0);

  return (
    <div className="space-y-6">
      {/* Inventory Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Collection</h2>
          <div className="text-right">
            <div className="text-cyan-400 font-semibold">
              Total Power: {totalPower.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">
              {gameState.inventory.length} items
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              <Filter className="w-4 h-4 inline mr-1" />
              Family
            </label>
            <select
              value={filterFamily}
              onChange={(e) => setFilterFamily(e.target.value as ItemFamily | 'all')}
              className="w-full bg-gray-700 border border-gray-600 rounded-md text-white p-2"
            >
              <option value="all">All Families</option>
              {Object.values(ItemFamily).map(family => (
                <option key={family} value={family} className="capitalize">
                  {family}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              <Filter className="w-4 h-4 inline mr-1" />
              Rarity
            </label>
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value as Rarity | 'all')}
              className="w-full bg-gray-700 border border-gray-600 rounded-md text-white p-2"
            >
              <option value="all">All Rarities</option>
              {Object.values(Rarity).map(rarity => (
                <option key={rarity} value={rarity} className="capitalize">
                  {rarity}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              <SortDesc className="w-4 h-4 inline mr-1" />
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'power' | 'rarity' | 'recent')}
              className="w-full bg-gray-700 border border-gray-600 rounded-md text-white p-2"
            >
              <option value="power">Power</option>
              <option value="rarity">Rarity</option>
              <option value="recent">Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredAndSortedItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">No items found</h3>
          <p className="text-gray-400">
            {gameState.inventory.length === 0 
              ? "Start summoning to build your collection!"
              : "Try adjusting your filters."
            }
          </p>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-cyan-500/30">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedItem.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedItem.name}</h3>
              <p className="text-gray-300 capitalize">{selectedItem.family}</p>
              <p className="text-sm text-gray-400 mt-2">{selectedItem.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Power:</span>
                <span className="text-cyan-400 font-bold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {selectedItem.power}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Level:</span>
                <span className="text-white font-bold">{selectedItem.level}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Stars:</span>
                <div className="flex">
                  {Array.from({ length: selectedItem.stars }, (_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleUpgrade(selectedItem)}
                disabled={!spendResources(GachaService.calculateUpgradeCost(selectedItem), 'coins')}
                className={`
                  w-full py-3 px-4 rounded-lg font-bold transition-all duration-300
                  ${gameState.resources.coins >= GachaService.calculateUpgradeCost(selectedItem)
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Upgrade</span>
                </div>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <Coins className="w-4 h-4" />
                  <span className="text-sm">
                    {GachaService.calculateUpgradeCost(selectedItem)}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};