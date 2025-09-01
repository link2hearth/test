import { ItemTemplate, ItemFamily, Rarity } from '../types/game';

export const ITEM_TEMPLATES: ItemTemplate[] = [
  // Common Weapons
  {
    name: 'Wooden Sword',
    family: ItemFamily.WEAPON,
    rarity: Rarity.COMMON,
    basePower: 10,
    description: 'A simple wooden sword for beginners.',
    icon: '⚔️'
  },
  {
    name: 'Basic Staff',
    family: ItemFamily.WEAPON,
    rarity: Rarity.COMMON,
    basePower: 8,
    description: 'A basic magical staff.',
    icon: '🪄'
  },
  
  // Uncommon Weapons
  {
    name: 'Iron Blade',
    family: ItemFamily.WEAPON,
    rarity: Rarity.UNCOMMON,
    basePower: 25,
    description: 'A sturdy iron blade with decent sharpness.',
    icon: '🗡️'
  },
  
  // Rare Weapons
  {
    name: 'Flame Sword',
    family: ItemFamily.WEAPON,
    rarity: Rarity.RARE,
    basePower: 50,
    description: 'A sword imbued with the power of fire.',
    icon: '🔥'
  },

  // Super Rare Weapons
  {
    name: 'Photon Blade',
    family: ItemFamily.WEAPON,
    rarity: Rarity.SUPER_RARE,
    basePower: 75,
    description: 'A blade forged from condensed light.',
    icon: '✨'
  },

  // Epic Weapons
  {
    name: 'Dragon Fang',
    family: ItemFamily.WEAPON,
    rarity: Rarity.EPIC,
    basePower: 100,
    description: 'A legendary weapon forged from dragon bones.',
    icon: '🐉'
  },
  
  // Legendary Weapons
  {
    name: 'Excalibur',
    family: ItemFamily.WEAPON,
    rarity: Rarity.LEGENDARY,
    basePower: 200,
    description: 'The legendary sword of kings.',
    icon: '⚡'
  },
  
  // Common Armor
  {
    name: 'Cloth Robe',
    family: ItemFamily.ARMOR,
    rarity: Rarity.COMMON,
    basePower: 5,
    description: 'Basic cloth protection.',
    icon: '👘'
  },
  
  // Uncommon Armor
  {
    name: 'Leather Armor',
    family: ItemFamily.ARMOR,
    rarity: Rarity.UNCOMMON,
    basePower: 15,
    description: 'Flexible leather protection.',
    icon: '🦺'
  },
  
  // Rare Armor
  {
    name: 'Mithril Mail',
    family: ItemFamily.ARMOR,
    rarity: Rarity.RARE,
    basePower: 35,
    description: 'Lightweight yet strong mithril armor.',
    icon: '🛡️'
  },
  
  // Epic Characters
  {
    name: 'Fire Mage',
    family: ItemFamily.CHARACTER,
    rarity: Rarity.EPIC,
    basePower: 80,
    description: 'A powerful spellcaster who commands fire.',
    icon: '🧙'
  },
  
  // Legendary Characters
  {
    name: 'Ancient Dragon',
    family: ItemFamily.CHARACTER,
    rarity: Rarity.LEGENDARY,
    basePower: 180,
    description: 'An ancient being of immense power.',
    icon: '🐲'
  },
  
  // Mythic Characters
  {
    name: 'Cosmic Entity',
    family: ItemFamily.CHARACTER,
    rarity: Rarity.MYTHIC,
    basePower: 300,
    description: 'A being from beyond the stars.',
    icon: '🌟'
  },

  // Immortal Characters
  {
    name: 'Time Weaver',
    family: ItemFamily.CHARACTER,
    rarity: Rarity.IMMORTAL,
    basePower: 500,
    description: 'An eternal being that manipulates time itself.',
    icon: '⏳'
  }
];

export const RARITY_COLORS = {
  [Rarity.COMMON]: 'from-gray-400 to-gray-600',
  [Rarity.UNCOMMON]: 'from-green-400 to-green-600',
  [Rarity.RARE]: 'from-blue-400 to-blue-600',
  [Rarity.SUPER_RARE]: 'from-teal-400 to-teal-600',
  [Rarity.EPIC]: 'from-purple-400 to-purple-600',
  [Rarity.LEGENDARY]: 'from-orange-400 to-orange-600',
  [Rarity.MYTHIC]: 'from-pink-400 to-pink-600',
  [Rarity.IMMORTAL]: 'from-yellow-400 to-yellow-600'
};

export const RARITY_GLOW = {
  [Rarity.COMMON]: 'shadow-gray-400/50',
  [Rarity.UNCOMMON]: 'shadow-green-400/50',
  [Rarity.RARE]: 'shadow-blue-400/50',
  [Rarity.SUPER_RARE]: 'shadow-teal-400/50',
  [Rarity.EPIC]: 'shadow-purple-400/50',
  [Rarity.LEGENDARY]: 'shadow-orange-400/50',
  [Rarity.MYTHIC]: 'shadow-pink-400/50',
  [Rarity.IMMORTAL]: 'shadow-yellow-400/50'
};