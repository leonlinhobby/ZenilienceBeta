import React from 'react';
import { UserProfile } from '../../types/user';
import { Sparkles, ArrowRight, Clock, Star } from 'lucide-react';

interface PersonalizedRecommendationsProps {
  profile: UserProfile;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ profile }) => {
  const recommendations = [
    {
      type: 'meditation',
      title: 'Morning Clarity Meditation',
      description: 'A 10-minute guided meditation to start your day with focus and calm.',
      duration: '10 min',
      difficulty: 'Beginner',
      icon: '🧘‍♀️',
      color: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      type: 'article',
      title: 'Understanding Stress Triggers',
      description: 'Learn to identify and manage the sources of stress in your daily life.',
      duration: '5 min read',
      difficulty: 'Intermediate',
      icon: '📚',
      color: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    {
      type: 'exercise',
      title: 'Breathing for Anxiety',
      description: 'Simple breathing techniques to calm your mind during anxious moments.',
      duration: '7 min',
      difficulty: 'Beginner',
      icon: '🌬️',
      color: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      type: 'sleep',
      title: 'Sleep Hygiene Tips',
      description: 'Improve your sleep quality with these evidence-based strategies.',
      duration: '8 min read',
      difficulty: 'Beginner',
      icon: '😴',
      color: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
      <div className="flex items-center mb-6">
        <Sparkles className="w-5 h-5 text-stone-600 mr-2" />
        <h3 className="text-lg font-semibold text-stone-800">
          Personalized for You
        </h3>
      </div>
      
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${rec.color} border ${rec.borderColor} rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{rec.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-stone-800 mb-1 group-hover:text-stone-600 transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-stone-600 text-sm mb-3 leading-relaxed">
                    {rec.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-stone-500">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {rec.duration}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {rec.difficulty}
                    </div>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-stone-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-stone-600 hover:text-stone-800 font-medium text-sm transition-colors">
          View All Recommendations
        </button>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;