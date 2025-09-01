import { useState, useEffect, useCallback } from 'react';
import { GameState, Resources, Item, PlayerStats, GameSettings, ItemFamily, Rarity } from '../types/game';

const INITIAL_RESOURCES: Resources = {
  coins: 1000,
  gems: 50,
  energy: 100,
  maxEnergy: 100,
  exp: 0,
  level: 1
};

const INITIAL_STATS: PlayerStats = {
  totalSummons: 0,
  totalUpgrades: 0,
  playtime: 0,
  prestigeLevel: 0,
  highestRarity: Rarity.COMMON
};

const INITIAL_SETTINGS: GameSettings = {
  autoSave: true,
  soundEnabled: true,
  notificationsEnabled: true
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('gachaGameState');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        lastSave: Date.now()
      };
    }
    return {
      resources: INITIAL_RESOURCES,
      inventory: [],
      stats: INITIAL_STATS,
      settings: INITIAL_SETTINGS,
      lastSave: Date.now()
    };
  });

  // Auto-save functionality
  useEffect(() => {
    if (gameState.settings.autoSave) {
      const saveInterval = setInterval(() => {
        saveGame();
      }, 5000); // Save every 5 seconds

      return () => clearInterval(saveInterval);
    }
  }, [gameState.settings.autoSave]);

  // Idle progression when returning
  useEffect(() => {
    const timeAway = Date.now() - gameState.lastSave;
    if (timeAway > 10000) { // If away for more than 10 seconds
      const secondsAway = Math.floor(timeAway / 1000);
      const coinsEarned = Math.floor(secondsAway * (gameState.stats.prestigeLevel + 1));
      
      if (coinsEarned > 0) {
        updateResources({ coins: gameState.resources.coins + coinsEarned });
      }
    }
  }, []);

  const saveGame = useCallback(() => {
    const stateToSave = {
      ...gameState,
      lastSave: Date.now()
    };
    localStorage.setItem('gachaGameState', JSON.stringify(stateToSave));
    setGameState(prev => ({ ...prev, lastSave: Date.now() }));
  }, [gameState]);

  const updateResources = useCallback((newResources: Partial<Resources>) => {
    setGameState(prev => ({
      ...prev,
      resources: { ...prev.resources, ...newResources }
    }));
  }, []);

  const addToInventory = useCallback((item: Item) => {
    setGameState(prev => ({
      ...prev,
      inventory: [...prev.inventory, item],
      stats: {
        ...prev.stats,
        highestRarity: item.rarity > prev.stats.highestRarity ? item.rarity : prev.stats.highestRarity
      }
    }));
  }, []);

  const updateStats = useCallback((newStats: Partial<PlayerStats>) => {
    setGameState(prev => ({
      ...prev,
      stats: { ...prev.stats, ...newStats }
    }));
  }, []);

  const canAfford = useCallback((cost: number, currency: keyof Resources) => {
    return gameState.resources[currency] >= cost;
  }, [gameState.resources]);

  const spendResources = useCallback((cost: number, currency: keyof Resources) => {
    if (canAfford(cost, currency)) {
      updateResources({ [currency]: gameState.resources[currency] - cost });
      return true;
    }
    return false;
  }, [gameState.resources, canAfford, updateResources]);

  return {
    gameState,
    updateResources,
    addToInventory,
    updateStats,
    canAfford,
    spendResources,
    saveGame
  };
};