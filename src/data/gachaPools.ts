import { GachaPool, Rarity } from '../types/game';
import { ITEM_TEMPLATES } from './itemTemplates';

export const GACHA_POOLS: GachaPool[] = [
  {
    id: 'basic',
    name: 'Basic Summon',
    cost: 100,
    currency: 'coins',
    rates: {
      [Rarity.COMMON]: 0.55,      // 55%
      [Rarity.UNCOMMON]: 0.25,    // 25%
      [Rarity.RARE]: 0.1,         // 10%
      [Rarity.SUPER_RARE]: 0.05,  // 5%
      [Rarity.EPIC]: 0.03,        // 3%
      [Rarity.LEGENDARY]: 0.01,   // 1%
      [Rarity.MYTHIC]: 0.005,     // 0.5%
      [Rarity.IMMORTAL]: 0.0      // 0%
    },
    availableItems: ITEM_TEMPLATES.filter(item =>
      item.rarity !== Rarity.MYTHIC && item.rarity !== Rarity.IMMORTAL
    )
  },
  {
    id: 'premium',
    name: 'Premium Summon',
    cost: 10,
    currency: 'gems',
    rates: {
      [Rarity.COMMON]: 0.27,      // 27%
      [Rarity.UNCOMMON]: 0.24,    // 24%
      [Rarity.RARE]: 0.2,         // 20%
      [Rarity.SUPER_RARE]: 0.12,  // 12%
      [Rarity.EPIC]: 0.08,        // 8%
      [Rarity.LEGENDARY]: 0.05,   // 5%
      [Rarity.MYTHIC]: 0.02,      // 2%
      [Rarity.IMMORTAL]: 0.01     // 1%
    },
    availableItems: ITEM_TEMPLATES
  }
];