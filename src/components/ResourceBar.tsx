import React from 'react';
import { Resources } from '../types/game';
import { Coins, Gem, Zap } from 'lucide-react';

interface ResourceBarProps {
  resources: Resources;
}

export const ResourceBar: React.FC<ResourceBarProps> = ({ resources }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30">
      <div className="flex justify-between items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400 font-semibold">
            {formatNumber(resources.coins)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Gem className="w-5 h-5 text-purple-400" />
          <span className="text-purple-400 font-semibold">
            {formatNumber(resources.gems)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-semibold">
            {resources.energy}/{resources.maxEnergy}
          </span>
        </div>
        
        <div className="text-right">
          <div className="text-cyan-400 font-semibold">Lv. {resources.level}</div>
          <div className="text-xs text-gray-400">
            EXP: {formatNumber(resources.exp)}
          </div>
        </div>
      </div>
    </div>
  );
};