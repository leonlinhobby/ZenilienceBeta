import React from 'react';
import { Home, Flower, TrendingUp, MessageSquare, User } from 'lucide-react';
import { NavigationPage } from '../../types/dashboard';

interface BottomNavigationProps {
  currentPage: NavigationPage;
  onPageChange: (page: NavigationPage) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'zen-garden', icon: Flower, label: 'Zen Garden' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'chat', icon: MessageSquare, label: 'Zeno Chat' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-stone-200">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id as NavigationPage)}
                className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-stone-600 text-white shadow-lg transform scale-105' 
                    : 'text-stone-600 hover:text-stone-800 hover:bg-stone-100'
                }`}
              >
                <Icon 
                  className={`w-6 h-6 mb-1 transition-transform duration-300 ${
                    isActive ? 'scale-110' : ''
                  }`} 
                />
                <span className={`text-xs font-medium ${
                  isActive ? 'text-white' : 'text-stone-600'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;