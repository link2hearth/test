import { GachaPool, Item, Rarity, ItemTemplate } from '../types/game';
import { GACHA_POOLS } from '../data/gachaPools';

export class GachaService {
  static getPool(poolId: string): GachaPool | undefined {
    return GACHA_POOLS.find(pool => pool.id === poolId);
  }

  static performSummon(pool: GachaPool): Item | null {
    const rarity = this.rollRarity(pool.rates);
    if (!rarity) {
      return null; // Nothing or basic resource
    }

    const availableItems = pool.availableItems.filter(item => item.rarity === rarity);

    if (availableItems.length === 0) {
      // Fallback to common if no items of rolled rarity
      const commonItems = pool.availableItems.filter(item => item.rarity === Rarity.COMMON);
      const template = commonItems[Math.floor(Math.random() * commonItems.length)];
      return this.createItemFromTemplate(template);
    }

    const template = availableItems[Math.floor(Math.random() * availableItems.length)];
    return this.createItemFromTemplate(template);
  }

  static performMultiSummon(pool: GachaPool, count: number): (Item | null)[] {
    const results: (Item | null)[] = [];
    for (let i = 0; i < count; i++) {
      results.push(this.performSummon(pool));
    }
    return results;
  }

  private static rollRarity(rates: Record<Rarity, number>): Rarity | null {
    const random = Math.random();
    let cumulative = 0;

    for (const [rarity, rate] of Object.entries(rates)) {
      cumulative += rate;
      if (random <= cumulative) {
        return rarity as Rarity;
      }
    }

    return null; // No item
  }

  private static createItemFromTemplate(template: ItemTemplate): Item {
    const variance = 0.1; // 10% power variance
    const powerMultiplier = 1 + (Math.random() - 0.5) * variance;
    
    return {
      id: `${template.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: template.name,
      family: template.family,
      rarity: template.rarity,
      level: 1,
      stars: 1,
      power: Math.floor(template.basePower * powerMultiplier),
      description: template.description,
      icon: template.icon,
      obtainedAt: Date.now()
    };
  }

  static calculateUpgradeCost(item: Item): number {
    const baseCost = 50;
    const rarityMultiplier = this.getRarityMultiplier(item.rarity);
    const levelMultiplier = Math.pow(1.5, item.level - 1);
    return Math.floor(baseCost * rarityMultiplier * levelMultiplier);
  }

  static upgradeItem(item: Item): Item {
    const newPower = Math.floor(item.power * 1.2);
    return {
      ...item,
      level: item.level + 1,
      power: newPower
    };
  }

  private static getRarityMultiplier(rarity: Rarity): number {
    const multipliers = {
      [Rarity.COMMON]: 1,
      [Rarity.UNCOMMON]: 2,
      [Rarity.RARE]: 4,
      [Rarity.SUPER_RARE]: 6,
      [Rarity.EPIC]: 8,
      [Rarity.LEGENDARY]: 16,
      [Rarity.MYTHIC]: 32,
      [Rarity.IMMORTAL]: 64
    };
    return multipliers[rarity];
  }
}