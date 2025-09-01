import React from 'react';
import { Item, Rarity } from '../types/game';
import { RARITY_COLORS, RARITY_GLOW } from '../data/itemTemplates';
import { Star, TrendingUp } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
  showPower?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onClick, 
  showPower = true 
}) => {
  const rarityColor = RARITY_COLORS[item.rarity];
  const rarityGlow = RARITY_GLOW[item.rarity];

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg border-2 cursor-pointer
        transform transition-all duration-300 hover:scale-105 hover:shadow-xl
        ${rarityGlow} hover:shadow-2xl
        bg-gradient-to-br ${rarityColor}
        ${onClick ? 'hover:brightness-110' : ''}
      `}
    >
      {/* Rarity indicator */}
      <div className="absolute top-2 right-2 z-10">
        <div className="flex">
          {Array.from({ length: item.stars }, (_, i) => (
            <Star key={i} className="w-3 h-3 text-yellow-300 fill-current" />
          ))}
        </div>
      </div>

      {/* Item content */}
      <div className="p-4 text-center">
        <div className="text-4xl mb-2">{item.icon}</div>
        <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">
          {item.name}
        </h3>
        <p className="text-xs text-gray-200 opacity-80 capitalize mb-2">
          {item.family}
        </p>
        
        {showPower && (
          <div className="flex items-center justify-center space-x-1 mb-2">
            <TrendingUp className="w-3 h-3 text-white" />
            <span className="text-white font-semibold text-sm">
              {item.power}
            </span>
          </div>
        )}
        
        <div className="text-xs text-white/70">
          Lv. {item.level}
        </div>
      </div>

      {/* Rarity border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] 
                      transition-transform duration-1000" />
    </div>
  );
};