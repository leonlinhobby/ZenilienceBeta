import React from 'react';
import { UserProgress } from '../../types/user';
import { TrendingUp, Calendar, Target, Flame } from 'lucide-react';

interface ProgressTrackerProps {
  progress: UserProgress | null;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress }) => {
  const stats = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Sessions Today',
      value: progress?.completed_sessions || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Mood Score',
      value: progress?.mood_score ? `${progress.mood_score}/10` : 'Not set',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Stress Level',
      value: progress?.stress_level ? `${progress.stress_level}/10` : 'Not set',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: <Flame className="w-5 h-5" />,
      label: 'Current Streak',
      value: `${progress?.current_streak || 0} days`,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
      <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2" />
        Progress Tracker
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-lg p-4 text-center transition-transform hover:scale-105 cursor-pointer`}
          >
            <div className={`${stat.color} mb-2 flex justify-center`}>
              {stat.icon}
            </div>
            <div className="text-xl font-bold text-stone-800 mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-stone-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-stone-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-stone-600">Weekly Goal Progress</span>
          <span className="text-sm font-medium text-stone-800">
            {Math.min((progress?.completed_sessions || 0) * 20, 100)}%
          </span>
        </div>
        <div className="bg-stone-200 rounded-full h-2">
          <div
            className="bg-stone-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min((progress?.completed_sessions || 0) * 20, 100)}%`
            }}
          ></div>
        </div>
        <p className="text-xs text-stone-500 mt-2">
          Complete 5 sessions this week to reach your goal
        </p>
      </div>
    </div>
  );
};

export default ProgressTracker;