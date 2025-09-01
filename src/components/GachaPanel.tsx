import React, { useState } from 'react';
import { GachaPool, Item } from '../types/game';
import { GACHA_POOLS } from '../data/gachaPools';
import { GachaService } from '../services/gachaService';
import { useGameState } from '../hooks/useGameState';
import { ItemCard } from './ItemCard';
import { GachaAnimation } from './GachaAnimation';
import { Coins, Gem, Sparkles } from 'lucide-react';

export const GachaPanel: React.FC = () => {
  const { gameState, spendResources, addToInventory, updateStats } = useGameState();
  const [selectedPool, setSelectedPool] = useState<GachaPool>(GACHA_POOLS[0]);
  const [summoning, setSummoning] = useState(false);
  const [lastSummonResults, setLastSummonResults] = useState<Item[]>([]);
  const [animationItems, setAnimationItems] = useState<Item[] | null>(null);

  const handleSummon = async (count: number = 1) => {
    const totalCost = selectedPool.cost * count;
    
    if (!spendResources(totalCost, selectedPool.currency)) {
      return; // Can't afford
    }

    setSummoning(true);
    
    // Simulate summon animation delay
    setTimeout(() => {
      const results = count === 1 
        ? [GachaService.performSummon(selectedPool)]
        : GachaService.performMultiSummon(selectedPool, count);
      
      results.forEach(item => addToInventory(item));
      setLastSummonResults(results);

      if (count === 10) {
        setAnimationItems(results);
      }
      
      updateStats({
        totalSummons: gameState.stats.totalSummons + count
      });
      
      setSummoning(false);
    }, 1500);
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'coins': return <Coins className="w-4 h-4 text-yellow-400" />;
      case 'gems': return <Gem className="w-4 h-4 text-purple-400" />;
      default: return null;
    }
  };

  const canAffordSummon = (count: number) => {
    const totalCost = selectedPool.cost * count;
    return gameState.resources[selectedPool.currency] >= totalCost;
  };

  return (
    <div className="space-y-6">
      {/* Pool Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GACHA_POOLS.map(pool => (
          <button
            key={pool.id}
            onClick={() => setSelectedPool(pool)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-300
              ${selectedPool.id === pool.id 
                ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20' 
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }
            `}
          >
            <h3 className="font-bold text-white mb-2">{pool.name}</h3>
            <div className="flex items-center justify-center space-x-2">
              {getCurrencyIcon(pool.currency)}
              <span className="text-lg font-semibold text-white">
                {pool.cost}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Summon Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleSummon(1)}
          disabled={summoning || !canAffordSummon(1)}
          className={`
            py-4 px-6 rounded-lg font-bold text-white transition-all duration-300
            ${canAffordSummon(1) && !summoning
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>Summon x1</span>
          </div>
          <div className="flex items-center justify-center space-x-1 mt-1">
            {getCurrencyIcon(selectedPool.currency)}
            <span className="text-sm">{selectedPool.cost}</span>
          </div>
        </button>

        <button
          onClick={() => handleSummon(10)}
          disabled={summoning || !canAffordSummon(10)}
          className={`
            py-4 px-6 rounded-lg font-bold text-white transition-all duration-300
            ${canAffordSummon(10) && !summoning
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>Summon x10</span>
          </div>
          <div className="flex items-center justify-center space-x-1 mt-1">
            {getCurrencyIcon(selectedPool.currency)}
            <span className="text-sm">{selectedPool.cost * 10}</span>
          </div>
        </button>
      </div>

      {/* Summon Animation */}
      {summoning && (
        <div className="flex justify-center items-center py-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-400 rounded-full animate-spin border-t-transparent"></div>
            <Sparkles className="w-8 h-8 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
        </div>
      )}

      {/* Last Summon Results */}
      {lastSummonResults.length > 0 && !summoning && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white text-center">
            Recent Summons
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {lastSummonResults.map((item, index) => (
              <div key={index} className="animate-fadeIn">
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drop Rates Display */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <h4 className="font-bold text-white mb-3 text-center">Drop Rates</h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          {Object.entries(selectedPool.rates).map(([rarity, rate]) => (
            <div key={rarity} className="text-center">
              <div className="text-white capitalize font-medium">{rarity}</div>
              <div className="text-gray-300">{(rate * 100).toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>

      {animationItems && (
        <GachaAnimation
          items={animationItems}
          onComplete={() => setAnimationItems(null)}
        />
      )}
    </div>
  );
};