import React from 'react';
import { DailyRecommendation as DailyRecommendationType, UserProfile } from '../../types/user';
import { Brain, Heart, Wind, BookOpen, CheckCircle, Lock } from 'lucide-react';

interface DailyRecommendationProps {
  recommendation: DailyRecommendationType;
  profile: UserProfile;
  onComplete: () => void;
}

const DailyRecommendation: React.FC<DailyRecommendationProps> = ({ 
  recommendation, 
  profile, 
  onComplete 
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'meditation': return <Heart className="w-8 h-8 text-stone-600" />;
      case 'cbt': return <Brain className="w-8 h-8 text-stone-600" />;
      case 'breathing': return <Wind className="w-8 h-8 text-stone-600" />;
      case 'gratitude': return <BookOpen className="w-8 h-8 text-stone-600" />;
      default: return <Brain className="w-8 h-8 text-stone-600" />;
    }
  };

  const canComplete = !recommendation.completed && (
    profile.subscription_type === 'zenith' || 
    profile.subscription_type === 'explorer'
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-stone-100 rounded-full p-3 mr-4">
            {getIcon(recommendation.recommendation_type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-800">
              Today's Recommendation
            </h3>
            <p className="text-sm text-stone-600">
              Personalized for you
            </p>
          </div>
        </div>
        {recommendation.completed && (
          <CheckCircle className="w-6 h-6 text-green-600" />
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-xl font-bold text-stone-800 mb-2">
          {recommendation.title}
        </h4>
        <p className="text-stone-600 leading-relaxed">
          {recommendation.description}
        </p>
      </div>

      {recommendation.completed ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center text-green-800">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Completed! Great work!</span>
          </div>
          <p className="text-green-600 text-sm mt-1">
            You've earned 10 Zen Garden points for completing today's exercise.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {profile.subscription_type === 'explorer' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center text-yellow-800">
                <Lock className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Explorer Plan: 1 session per day. Upgrade to Zenith for unlimited access.
                </span>
              </div>
            </div>
          )}
          
          <button
            onClick={onComplete}
            disabled={!canComplete}
            className="w-full bg-stone-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center group"
          >
            {canComplete ? (
              <>
                Start Exercise
                <Brain className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </>
            ) : (
              <>
                <Lock className="mr-2 w-5 h-5" />
                Daily limit reached
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyRecommendation;