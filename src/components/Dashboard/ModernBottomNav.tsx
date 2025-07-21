import React from 'react';
import { Home, Flower, TrendingUp, MessageCircle, User } from 'lucide-react';

interface ModernBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ModernBottomNav: React.FC<ModernBottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'zen-garden', icon: Flower, label: 'Garden' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-lg rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-2xl border border-gray-200/50">
        <div className="flex items-center space-x-4 sm:space-x-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative p-2 sm:p-3 rounded-full transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon size={18} className="sm:w-5 sm:h-5" />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
                
                {/* Tooltip */}
                <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap ${isActive ? 'hidden' : ''}`}>
                  {tab.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModernBottomNav;