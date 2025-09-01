import React from 'react';
import { Sparkles, Package, TrendingUp, Settings, Star } from 'lucide-react';

export type GameView = 'gacha' | 'inventory' | 'upgrade' | 'prestige' | 'settings';

interface NavigationProps {
  activeView: GameView;
  onViewChange: (view: GameView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'gacha' as GameView, icon: Sparkles, label: 'Summon' },
    { id: 'inventory' as GameView, icon: Package, label: 'Collection' },
    { id: 'upgrade' as GameView, icon: TrendingUp, label: 'Upgrade' },
    { id: 'prestige' as GameView, icon: Star, label: 'Prestige' },
    { id: 'settings' as GameView, icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-t border-cyan-500/30">
      <div className="flex justify-around py-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`
              flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300
              ${activeView === id 
                ? 'text-cyan-400 bg-cyan-400/10 shadow-lg' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
              }
            `}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};