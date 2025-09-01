import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { Settings, Save, Volume2, VolumeX, Bell, BellOff } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const { gameState, saveGame } = useGameState();

  const handleExportSave = () => {
    const saveData = JSON.stringify(gameState, null, 2);
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gacha-save-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSave = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const saveData = JSON.parse(e.target?.result as string);
          localStorage.setItem('gachaGameState', JSON.stringify(saveData));
          window.location.reload(); // Reload to apply imported save
        } catch (error) {
          alert('Invalid save file');
        }
      };
      reader.readAsText(file);
    }
  };

  const resetGame = () => {
    if (confirm('Are you sure? This will permanently delete all progress!')) {
      localStorage.removeItem('gachaGameState');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/90 backdrop-blur-sm p-6 rounded-lg border border-cyan-500/30">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-cyan-400" />
          Settings
        </h2>

        {/* Game Settings */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-white">Preferences</h3>
          
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              {gameState.settings.soundEnabled ? 
                <Volume2 className="w-5 h-5 text-green-400" /> : 
                <VolumeX className="w-5 h-5 text-red-400" />
              }
              <span className="text-white">Sound Effects</span>
            </div>
            <button
              className={`
                w-12 h-6 rounded-full transition-colors duration-300
                ${gameState.settings.soundEnabled ? 'bg-green-500' : 'bg-gray-600'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full transition-transform duration-300
                ${gameState.settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'}
              `} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              {gameState.settings.notificationsEnabled ? 
                <Bell className="w-5 h-5 text-green-400" /> : 
                <BellOff className="w-5 h-5 text-red-400" />
              }
              <span className="text-white">Notifications</span>
            </div>
            <button
              className={`
                w-12 h-6 rounded-full transition-colors duration-300
                ${gameState.settings.notificationsEnabled ? 'bg-green-500' : 'bg-gray-600'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full transition-transform duration-300
                ${gameState.settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}
              `} />
            </button>
          </div>
        </div>

        {/* Save Management */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-white">Save Management</h3>
          
          <button
            onClick={saveGame}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 
                     hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg 
                     transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Game</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportSave}
              className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg 
                       transition-colors duration-300 text-sm"
            >
              Export Save
            </button>
            
            <label className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg 
                           transition-colors duration-300 text-sm cursor-pointer text-center">
              Import Save
              <input
                type="file"
                accept=".json"
                onChange={handleImportSave}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Game Stats */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-white">Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-cyan-400 font-bold text-lg">
                {gameState.stats.totalSummons}
              </div>
              <div className="text-gray-400">Total Summons</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-green-400 font-bold text-lg">
                {gameState.stats.totalUpgrades}
              </div>
              <div className="text-gray-400">Total Upgrades</div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-red-500/30 pt-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
          <button
            onClick={resetGame}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold 
                     rounded-lg transition-colors duration-300"
          >
            Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );
};