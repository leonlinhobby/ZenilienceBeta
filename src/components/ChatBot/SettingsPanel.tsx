import React from 'react';
import { ChatSettings } from './types';
import { X } from 'lucide-react';

interface SettingsPanelProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, onClose }) => {
  const handleChange = (key: keyof ChatSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-white border-b border-stone-200 p-3 sm:p-4 space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-stone-800 text-sm sm:text-base">Chat Settings</h4>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            Temperature ({settings.temperature})
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-stone-400 mt-1">
            <span>Focused</span>
            <span>Creative</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            Model
          </label>
          <select
            value={settings.model}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full px-2 py-1 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-stone-500"
          >
            <option value="deepseek/deepseek-r1-0528">DeepSeek R1</option>
            <option value="deepseek/deepseek-chat">DeepSeek Chat</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            Max Tokens
          </label>
          <input
            type="number"
            min="100"
            max="4000"
            value={settings.maxTokens}
            onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
            className="w-full px-2 py-1 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;