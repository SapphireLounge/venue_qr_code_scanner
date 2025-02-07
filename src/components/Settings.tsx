import { useState } from 'react';
import { Bell, Volume2, Vibrate, Moon, Sun } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibration: true,
    darkMode: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-4">
        <button
          onClick={() => toggleSetting('notifications')}
          className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Bell size={24} />
            <span>Notifications</span>
          </div>
          <div className={`w-12 h-6 rounded-full relative ${settings.notifications ? 'bg-blue-600' : 'bg-gray-600'}`}>
            <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${settings.notifications ? 'right-0.5' : 'left-0.5'}`} />
          </div>
        </button>

        <button
          onClick={() => toggleSetting('sound')}
          className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Volume2 size={24} />
            <span>Sound</span>
          </div>
          <div className={`w-12 h-6 rounded-full relative ${settings.sound ? 'bg-blue-600' : 'bg-gray-600'}`}>
            <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${settings.sound ? 'right-0.5' : 'left-0.5'}`} />
          </div>
        </button>

        <button
          onClick={() => toggleSetting('vibration')}
          className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Vibrate size={24} />
            <span>Vibration</span>
          </div>
          <div className={`w-12 h-6 rounded-full relative ${settings.vibration ? 'bg-blue-600' : 'bg-gray-600'}`}>
            <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${settings.vibration ? 'right-0.5' : 'left-0.5'}`} />
          </div>
        </button>

        <button
          onClick={() => toggleSetting('darkMode')}
          className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg"
        >
          <div className="flex items-center gap-3">
            {settings.darkMode ? <Moon size={24} /> : <Sun size={24} />}
            <span>Dark Mode</span>
          </div>
          <div className={`w-12 h-6 rounded-full relative ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-600'}`}>
            <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${settings.darkMode ? 'right-0.5' : 'left-0.5'}`} />
          </div>
        </button>
      </div>
    </div>
  );
}