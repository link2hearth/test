import React, { useEffect, useState, useCallback } from 'react';
import { Item, Rarity } from '../types/game';
import { RARITY_COLORS, RARITY_GLOW } from '../data/itemTemplates';
import { Sparkles } from 'lucide-react';
import { ItemCard } from './ItemCard';

type GachaAnimationProps = {
  items: Item[];
  onComplete: () => void;
};

const sparkleColors: Record<Rarity, string> = {
  [Rarity.COMMON]: 'text-gray-300',
  [Rarity.UNCOMMON]: 'text-green-300',
  [Rarity.RARE]: 'text-blue-300',
  [Rarity.EPIC]: 'text-purple-300',
  [Rarity.LEGENDARY]: 'text-orange-300',
  [Rarity.MYTHIC]: 'text-pink-300'
};

export const GachaAnimation: React.FC<GachaAnimationProps> = ({ items, onComplete }) => {
  const [itemList] = useState<Item[]>(items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const playSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 880;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio context not supported or user gesture missing
    }
  }, []);

  useEffect(() => {
    setTransitioning(true);
    playSound();
    const t = setTimeout(() => setTransitioning(false), 300);
    return () => clearTimeout(t);
  }, [currentIndex, playSound]);

  const handleNext = useCallback(() => {
    if (transitioning) return;
    if (currentIndex < itemList.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      onComplete();
    }
  }, [transitioning, currentIndex, itemList.length, onComplete]);

  const currentItem = itemList[currentIndex];
  const rarityColor = RARITY_COLORS[currentItem.rarity];
  const rarityGlow = RARITY_GLOW[currentItem.rarity];
  const isEpicPlus = [Rarity.EPIC, Rarity.LEGENDARY, Rarity.MYTHIC].includes(currentItem.rarity);
  const particleColor = sparkleColors[currentItem.rarity];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={handleNext}
    >
      <div
        className={`relative transform transition-all duration-300 ${
          transitioning ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div
          className={`p-4 rounded-xl bg-gradient-to-br ${rarityColor} ${rarityGlow}`}
        >
          <ItemCard item={currentItem} />
        </div>

        {isEpicPlus && (
          <>
            <Sparkles className={`absolute -top-6 -left-6 w-8 h-8 ${particleColor} animate-ping`} />
            <Sparkles className={`absolute -bottom-6 right-0 w-8 h-8 ${particleColor} animate-ping`} />
          </>
        )}
      </div>
      <div className="absolute bottom-8 text-white text-sm opacity-70 animate-pulse">
        Click to continue
      </div>
    </div>
  );
};

