import React from 'react';
import { Brain, Heart, BookOpen, Users, Headphones, Target } from 'lucide-react';

const QuickAccess: React.FC = () => {
  const quickAccessItems = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'CBT Exercises',
      description: 'Interactive cognitive exercises',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Guided Meditations',
      description: 'Calming meditation sessions',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Wellness Library',
      description: 'Articles and resources',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: 'Sleep Stories',
      description: 'Relaxing bedtime content',
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Goal Tracker',
      description: 'Monitor your progress',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community',
      description: 'Connect with others',
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
      <h3 className="text-lg font-semibold text-stone-800 mb-6">
        Quick Access
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickAccessItems.map((item, index) => (
          <button
            key={index}
            className={`bg-gradient-to-r ${item.color} ${item.hoverColor} text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-left group`}
          >
            <div className="flex items-center mb-3">
              <div className="bg-white/20 rounded-lg p-2 mr-3 group-hover:bg-white/30 transition-colors">
                {item.icon}
              </div>
              <div>
                <h4 className="font-semibold text-white">
                  {item.title}
                </h4>
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              {item.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;