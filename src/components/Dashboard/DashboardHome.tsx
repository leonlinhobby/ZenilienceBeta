import React, { useState, useEffect } from 'react';
import { Play, Clock, Star, Flame, Award, ChevronRight, CheckCircle, Lock } from 'lucide-react';
import { Lesson, UserStreaks } from '../../types/dashboard';
import { UserProfile } from '../../types/user';
import { useDashboard } from '../../hooks/useDashboard';
import LessonModal from './LessonModal';

interface DashboardHomeProps {
  profile: UserProfile;
  streaks: UserStreaks | null;
  lessons: Lesson[];
  onCompleteLesson: (lessonId: string) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ 
  profile, 
  streaks, 
  lessons, 
  onCompleteLesson 
}) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showLessonModal, setShowLessonModal] = useState(false);

  const welcomeMessages = [
    `Hallo ${profile.full_name || 'Freund'}! Bereit für deine Wellness-Reise?`,
    `Willkommen zurück, ${profile.full_name || 'Freund'}! Lass uns den Tag großartig machen.`,
    `Hi ${profile.full_name || 'Freund'}! Zeit, heute für dein Wohlbefinden zu sorgen.`,
    `Schön, dich zu sehen, ${profile.full_name || 'Freund'}! Jeder kleine Schritt zählt.`,
    `Hallo ${profile.full_name || 'Freund'}! Deine mentale Gesundheit ist wichtig.`
  ];

  const [currentWelcomeMessage] = useState(
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
  );

  const canStartLesson = () => {
    if (profile.subscription_type === 'zenith') return true;
    
    const today = new Date().toDateString();
    const lastActivity = streaks?.last_activity_date ? new Date(streaks.last_activity_date).toDateString() : null;
    
    return lastActivity !== today;
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (!canStartLesson()) return;
    
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const handleLessonComplete = () => {
    if (selectedLesson) {
      onCompleteLesson(selectedLesson.id);
      setShowLessonModal(false);
      setSelectedLesson(null);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'meditation': return '🧘‍♀️';
      case 'breathing': return '🌬️';
      case 'cbt': return '🧠';
      case 'mindfulness': return '🌸';
      case 'challenge': return '🎯';
      case 'education': return '📚';
      default: return '✨';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-stone-600 bg-stone-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 pb-24">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <div className="flex items-center justify-center mb-4">
          <img 
            src="/zenilience_z_logo_2-removebg-preview.png" 
            alt="Zenilience Logo" 
            className="h-8 w-auto mr-2"
          />
          <span className="text-xl font-bold text-stone-800">Zenilience</span>
        </div>
        <p className="text-stone-600 text-lg">
          {currentWelcomeMessage}
        </p>
      </div>

      {/* Streak Section */}
      <div className="px-4 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-stone-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-3 mr-4">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-800">
                  {streaks?.current_streak || 0} Tage
                </h3>
                <p className="text-stone-600">Aktuelle Serie</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-stone-600 mb-1">
                <Award className="w-4 h-4 mr-1" />
                <span className="text-sm">Längste Serie: {streaks?.longest_streak || 0}</span>
              </div>
              {streaks?.streak_freeze_used && (
                <div className="flex items-center text-orange-600">
                  <span className="text-sm">🩹 Freeze verwendet</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 bg-stone-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-stone-600">Fortschritt heute</span>
              <span className="text-sm font-medium text-stone-800">
                {streaks?.zen_garden_points || 0} Punkte
              </span>
            </div>
            <div className="bg-stone-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-stone-600 to-stone-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(((streaks?.zen_garden_points || 0) % 100), 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-stone-800">Deine Lektionen</h2>
          <div className="text-sm text-stone-600">
            {profile.subscription_type === 'explorer' ? '1/Tag' : 'Unbegrenzt'}
          </div>
        </div>

        {!canStartLesson() && profile.subscription_type === 'explorer' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <div className="flex items-center text-yellow-800">
              <Lock className="w-5 h-5 mr-2" />
              <span className="font-medium">Tageslimit erreicht</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Komm morgen wieder oder upgrade zu Zenith für unbegrenzte Lektionen.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {lessons.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-stone-200">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">
                Neue Lektionen werden erstellt
              </h3>
              <p className="text-stone-600">
                Unsere KI erstellt personalisierte Lektionen basierend auf deinem Profil.
              </p>
            </div>
          ) : (
            lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`bg-white rounded-3xl p-6 shadow-lg border border-stone-200 transition-all duration-300 ${
                  canStartLesson() ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : 'opacity-75'
                }`}
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">
                      {getLessonIcon(lesson.lesson_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-stone-800 mb-1">
                        {lesson.title}
                      </h3>
                      <p className="text-stone-600 text-sm mb-2">
                        {lesson.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-stone-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">{lesson.estimated_duration} min</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty_level)}`}>
                          {lesson.difficulty_level}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {canStartLesson() ? (
                      <ChevronRight className="w-6 h-6 text-stone-400" />
                    ) : (
                      <Lock className="w-6 h-6 text-stone-400" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lesson Modal */}
      {showLessonModal && selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          onComplete={handleLessonComplete}
          onClose={() => setShowLessonModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardHome;