export interface GameState {
  resources: Resources;
  inventory: Item[];
  stats: PlayerStats;
  settings: GameSettings;
  lastSave: number;
}

export interface Resources {
  coins: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  exp: number;
  level: number;
}

export interface PlayerStats {
  totalSummons: number;
  totalUpgrades: number;
  playtime: number;
  prestigeLevel: number;
  highestRarity: Rarity;
}

export interface GameSettings {
  autoSave: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export enum Rarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  SUPER_RARE = 'super_rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
  IMMORTAL = 'immortal'
}

export enum ItemFamily {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  ARTIFACT = 'artifact',
  CHARACTER = 'character',
  CONSUMABLE = 'consumable'
}

export interface Item {
  id: string;
  name: string;
  family: ItemFamily;
  rarity: Rarity;
  level: number;
  stars: number;
  power: number;
  description: string;
  icon: string;
  obtainedAt: number;
}

export interface GachaPool {
  id: string;
  name: string;
  cost: number;
  currency: keyof Resources;
  rates: Record<Rarity, number>;
  availableItems: ItemTemplate[];
}

export interface ItemTemplate {
  name: string;
  family: ItemFamily;
  rarity: Rarity;
  basePower: number;
  description: string;
  icon: string;
}