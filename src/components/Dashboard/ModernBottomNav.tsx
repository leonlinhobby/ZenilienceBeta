import React from 'react';
import { Home, Flower, TrendingUp, MessageCircle, User } from 'lucide-react';

interface ModernBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ModernBottomNav: React.FC<ModernBottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'zen-garden', icon: Flower, label: 'Zen Garden' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'chat', icon: MessageCircle, label: 'Zeno Chat' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-lg rounded-full px-6 py-3 shadow-2xl border border-gray-200/50">
        <div className="flex items-center space-x-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative p-3 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon size={20} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModernBottomNav;