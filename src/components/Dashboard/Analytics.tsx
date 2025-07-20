import React, { useState, useEffect } from 'react';
import { TrendingUp, Brain, Heart, Zap, Moon, Target, Calendar } from 'lucide-react';
import { UserProfile } from '../../types/user';
import { UserStreaks } from '../../types/dashboard';

interface AnalyticsProps {
  profile: UserProfile;
  streaks: UserStreaks | null;
}

const Analytics: React.FC<AnalyticsProps> = ({ profile, streaks }) => {
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const metrics = [
    {
      id: 'stress',
      icon: <Brain className="w-6 h-6" />,
      label: 'Stress Level',
      value: Math.floor(Math.random() * 4) + 3, // 3-6 (lower is better)
      maxValue: 10,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      id: 'mood',
      icon: <Heart className="w-6 h-6" />,
      label: 'Mood Score',
      value: Math.floor(Math.random() * 3) + 7, // 7-9 (higher is better)
      maxValue: 10,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'energy',
      icon: <Zap className="w-6 h-6" />,
      label: 'Energy Level',
      value: Math.floor(Math.random() * 4) + 6, // 6-9
      maxValue: 10,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      id: 'sleep',
      icon: <Moon className="w-6 h-6" />,
      label: 'Sleep Quality',
      value: Math.floor(Math.random() * 3) + 6, // 6-8
      maxValue: 10,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'focus',
      icon: <Target className="w-6 h-6" />,
      label: 'Focus Level',
      value: Math.floor(Math.random() * 4) + 5, // 5-8
      maxValue: 10,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const weeklyData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'][i],
    sessions: Math.floor(Math.random() * 3) + (i < 5 ? 1 : 0), // More sessions on weekdays
    mood: Math.floor(Math.random() * 3) + 6
  }));

  const getStatusText = (metricId: string, value: number) => {
    switch (metricId) {
      case 'stress':
        return value <= 4 ? 'Niedrig' : value <= 7 ? 'Mittel' : 'Hoch';
      case 'mood':
        return value >= 8 ? 'Excellent' : value >= 6 ? 'Gut' : 'Niedrig';
      case 'energy':
        return value >= 8 ? 'Hoch' : value >= 6 ? 'Mittel' : 'Niedrig';
      case 'sleep':
        return value >= 8 ? 'Excellent' : value >= 6 ? 'Gut' : 'Schlecht';
      case 'focus':
        return value >= 8 ? 'Scharf' : value >= 6 ? 'Gut' : 'Niedrig';
      default:
        return 'Normal';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 pb-24">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <div className="flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-stone-600 mr-2" />
          <h1 className="text-3xl font-bold text-stone-800">Analytics</h1>
        </div>
        <p className="text-stone-600 text-lg">
          Dein Wellness-Fortschritt im Überblick
        </p>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-6 h-6 text-stone-600" />
              <span className="text-2xl font-bold text-stone-800">
                {streaks?.current_streak || 0}
              </span>
            </div>
            <p className="text-stone-600 text-sm">Tägliche Serie</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6 text-stone-600" />
              <span className="text-2xl font-bold text-stone-800">
                {streaks?.total_lessons_completed || 0}
              </span>
            </div>
            <p className="text-stone-600 text-sm">Lektionen</p>
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="px-4 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200">
          <h3 className="text-xl font-bold text-stone-800 mb-6">Gesundheitsmetriken</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className={`${metric.bgColor} rounded-2xl p-4 transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`${metric.textColor} mr-3`}>
                      {metric.icon}
                    </div>
                    <span className="font-semibold text-stone-800">{metric.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-stone-800">
                      {metric.value}/{metric.maxValue}
                    </div>
                    <div className={`text-xs ${metric.textColor} font-medium`}>
                      {getStatusText(metric.id, metric.value)}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/50 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${metric.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(metric.value / metric.maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="px-4 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200">
          <h3 className="text-xl font-bold text-stone-800 mb-6">Wöchentlicher Fortschritt</h3>
          
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-stone-600 w-8">
                    {day.day}
                  </span>
                  <div className="flex space-x-1 ml-4">
                    {Array.from({ length: day.sessions }, (_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-green-500 rounded-full"
                      />
                    ))}
                    {Array.from({ length: 3 - day.sessions }, (_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-stone-200 rounded-full"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-stone-600 mr-2">Stimmung:</span>
                  <div className="flex space-x-1">
                    {Array.from({ length: day.mood }, (_, i) => (
                      <Heart
                        key={i}
                        className="w-3 h-3 text-red-500 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="px-4 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200">
          <h3 className="text-xl font-bold text-stone-800 mb-4">Einblicke</h3>
          
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Trend</span>
              </div>
              <p className="text-blue-700 text-sm">
                Deine Stimmung hat sich diese Woche um 15% verbessert!
              </p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">Erfolg</span>
              </div>
              <p className="text-green-700 text-sm">
                Du hast deine wöchentliche Zielsetzung erreicht!
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Brain className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="font-semibold text-yellow-800">Empfehlung</span>
              </div>
              <p className="text-yellow-700 text-sm">
                Versuche mehr Atemübungen für bessere Stressreduzierung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;