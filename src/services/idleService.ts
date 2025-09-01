import { Resources } from '../types/game';

export class IdleService {
  static calculateIdleGains(timeAway: number, baseRate: number, multipliers: number[]): number {
    const totalMultiplier = multipliers.reduce((acc, mult) => acc * mult, 1);
    const secondsAway = Math.floor(timeAway / 1000);
    return Math.floor(secondsAway * baseRate * totalMultiplier);
  }

  static generateIdleResources(
    timeAway: number,
    currentResources: Resources,
    prestigeLevel: number
  ): Partial<Resources> {
    const baseCoinsPerSecond = 1 + prestigeLevel;
    const baseGemsPerSecond = 0.1;
    
    const coinsGained = this.calculateIdleGains(timeAway, baseCoinsPerSecond, [1]);
    const gemsGained = this.calculateIdleGains(timeAway, baseGemsPerSecond, [1]);
    
    return {
      coins: currentResources.coins + coinsGained,
      gems: currentResources.gems + gemsGained
    };
  }

  static calculateEnergyRegeneration(timeAway: number, maxEnergy: number): number {
    const energyPerMinute = 1;
    const minutesAway = Math.floor(timeAway / 60000);
    const energyGained = minutesAway * energyPerMinute;
    return Math.min(maxEnergy, energyGained);
  }

  static formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
  }
}