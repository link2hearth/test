import { GachaPool, Rarity } from '../types/game';
import { ITEM_TEMPLATES } from './itemTemplates';

export const GACHA_POOLS: GachaPool[] = [
  {
    id: 'basic',
    name: 'Basic Summon',
    cost: 100,
    currency: 'coins',
    rates: {
      [Rarity.COMMON]: 0.6,      // 60%
      [Rarity.UNCOMMON]: 0.25,   // 25%
      [Rarity.RARE]: 0.1,        // 10%
      [Rarity.EPIC]: 0.04,       // 4%
      [Rarity.LEGENDARY]: 0.01,  // 1%
      [Rarity.MYTHIC]: 0.0        // 0%
    },
    availableItems: ITEM_TEMPLATES.filter(item => 
      item.rarity !== Rarity.MYTHIC
    )
  },
  {
    id: 'premium',
    name: 'Premium Summon',
    cost: 10,
    currency: 'gems',
    rates: {
      [Rarity.COMMON]: 0.35,     // 35%
      [Rarity.UNCOMMON]: 0.3,    // 30%
      [Rarity.RARE]: 0.2,        // 20%
      [Rarity.EPIC]: 0.1,        // 10%
      [Rarity.LEGENDARY]: 0.04,  // 4%
      [Rarity.MYTHIC]: 0.01      // 1%
    },
    availableItems: ITEM_TEMPLATES
  }
];