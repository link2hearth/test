import React, { useState, useEffect } from 'react';
import { ResourceBar } from './components/ResourceBar';
import { Navigation, GameView } from './components/Navigation';
import { GachaPanel } from './components/GachaPanel';
import { Inventory } from './components/Inventory';
import { UpgradePanel } from './components/UpgradePanel';
import { PrestigePanel } from './components/PrestigePanel';
import { SettingsPanel } from './components/SettingsPanel';
import { IdleProgress } from './components/IdleProgress';
import { useGameState } from './hooks/useGameState';
import { Gamepad2 } from 'lucide-react';

function App() {
  const { gameState } = useGameState();
  const [activeView, setActiveView] = useState<GameView>('gacha');

  const renderActiveView = () => {
    switch (activeView) {
      case 'gacha':
        return <GachaPanel />;
      case 'inventory':
        return <Inventory />;
      case 'upgrade':
        return <UpgradePanel />;
      case 'prestige':
        return <PrestigePanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <GachaPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br 
                        from-cyan-500/5 to-purple-500/5 rotate-12 animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl 
                        from-blue-500/5 to-pink-500/5 -rotate-12 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Gamepad2 className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 
                           bg-clip-text text-transparent">
                Gacha Legends
              </h1>
            </div>
            <p className="text-gray-400 text-sm">
              Collect, upgrade, and prestige your way to greatness
            </p>
          </div>
          
          <ResourceBar resources={gameState.resources} />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 pb-20 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {activeView !== 'gacha' && <IdleProgress />}
            {renderActiveView()}
          </div>
        </main>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0">
          <Navigation 
            activeView={activeView} 
            onViewChange={setActiveView} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;