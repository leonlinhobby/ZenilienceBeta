import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Play, Clock, Star, Flame, Lock } from 'lucide-react';
import LessonModal from './LessonModal';

interface Lesson {
  id: string;
  title: string;
  description: string;
  lesson_type: string;
  estimated_duration: number;
  difficulty_level: string;
  content: any;
}

interface Streak {
  current_streak: number;
  longest_streak: number;
  zen_garden_points: number;
}

interface UserProfile {
  subscription_type: 'explorer' | 'zenith';
}

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [streak, setStreak] = useState<Streak>({ current_streak: 0, longest_streak: 0, zen_garden_points: 0 });
  const [profile, setProfile] = useState<UserProfile>({ subscription_type: 'explorer' });
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyLessonsCompleted, setDailyLessonsCompleted] = useState(0);

  useEffect(() => {
    if (user) {
      initializeDashboard();
    }
  }, [user]);

  const initializeDashboard = async () => {
    try {
      await Promise.all([
        fetchProfile(),
        fetchStreak(),
        fetchDailyProgress(),
        fetchLessons()
      ]);
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('subscription_type')
        .eq('id', user?.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchDailyProgress = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('user_progress')
        .select('completed_sessions')
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();

      if (data) {
        setDailyLessonsCompleted(data.completed_sessions || 0);
      }
    } catch (error) {
      console.error('Error fetching daily progress:', error);
    }
  };

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_completed', false)
        .order('position_in_queue')
        .limit(5);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        await generateDefaultLessons();
      } else {
        setLessons(data);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      await generateDefaultLessons();
    }
  };

  const fetchStreak = async () => {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (data) {
        setStreak(data);
      }
    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  };

  const generateDefaultLessons = async () => {
    const defaultLessons = [
      {
        title: "Morning Meditation",
        description: "Start your day with a calming 5-minute meditation",
        lesson_type: "meditation",
        estimated_duration: 5,
        difficulty_level: "beginner",
        content: {
          instruction: "Find a quiet place and sit comfortably.",
          steps: ["Close your eyes", "Breathe deeply in and out", "Focus on your breath"],
          duration: 5,
          tips: ["Don't worry if your thoughts wander", "Gently return to your breath"]
        }
      },
      {
        title: "4-7-8 Breathing Exercise",
        description: "A powerful breathing technique for instant relaxation",
        lesson_type: "breathing",
        estimated_duration: 5,
        difficulty_level: "beginner",
        content: {
          instruction: "Breathe following the proven 4-7-8 rhythm.",
          steps: ["Inhale for 4 seconds", "Hold for 7 seconds", "Exhale for 8 seconds"],
          duration: 5,
          tips: ["Repeat 4-5 cycles", "Focus only on counting"]
        }
      },
      {
        title: "Thought Check",
        description: "Learn to recognize and change your thought patterns",
        lesson_type: "cbt",
        estimated_duration: 10,
        difficulty_level: "intermediate",
        content: {
          instruction: "Identify a troubling thought from today.",
          steps: ["Write down the thought", "Ask: Is this really true?", "Find a more balanced perspective"],
          duration: 10,
          tips: ["Be patient with yourself", "It's normal that this takes practice"]
        }
      },
      {
        title: "Mindful Walking",
        description: "Connect with the present moment",
        lesson_type: "mindfulness",
        estimated_duration: 15,
        difficulty_level: "beginner",
        content: {
          instruction: "Walk slowly and mindfully for 15 minutes.",
          steps: ["Feel your feet on the ground", "Notice sounds consciously", "Observe your surroundings without judgment"],
          duration: 15,
          tips: ["Have no destination", "Simply be present"]
        }
      },
      {
        title: "Digital Detox Challenge",
        description: "Reduce your screen time for better wellbeing",
        lesson_type: "challenge",
        estimated_duration: 120,
        difficulty_level: "intermediate",
        content: {
          instruction: "Avoid all screens for the next 2 hours.",
          steps: ["Put phone on silent", "Do something else (read, walk, cook)", "Reflect on the experience"],
          duration: 120,
          tips: ["Prepare an alternative activity", "Tell others you'll be offline"]
        }
      }
    ];

    try {
      const lessonsToInsert = defaultLessons.map((lesson, index) => ({
        user_id: user?.id,
        title: lesson.title,
        description: lesson.description,
        lesson_type: lesson.lesson_type,
        content: lesson.content,
        estimated_duration: lesson.estimated_duration,
        difficulty_level: lesson.difficulty_level,
        position_in_queue: index + 1
      }));

      const { data, error } = await supabase
        .from('lessons')
        .insert(lessonsToInsert)
        .select();

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error generating lessons:', error);
    }
  };

  const canStartLesson = () => {
    if (profile.subscription_type === 'zenith') return true;
    return dailyLessonsCompleted < 1;
  };

  const completeLesson = async (lessonId: string) => {
    try {
      // Mark lesson as completed
      await supabase
        .from('lessons')
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq('id', lessonId);

      // Update or create daily progress
      const today = new Date().toISOString().split('T')[0];
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();

      if (existingProgress) {
        await supabase
          .from('user_progress')
          .update({
            completed_sessions: existingProgress.completed_sessions + 1,
            zen_garden_points: existingProgress.zen_garden_points + 10
          })
          .eq('id', existingProgress.id);
      } else {
        await supabase
          .from('user_progress')
          .insert({
            user_id: user?.id,
            date: today,
            completed_sessions: 1,
            zen_garden_points: 10
          });
      }

      // Update streak
      const { data: currentStreak } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (currentStreak) {
        const newStreak = currentStreak.current_streak + 1;
        await supabase
          .from('user_streaks')
          .update({
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, currentStreak.longest_streak),
            zen_garden_points: currentStreak.zen_garden_points + 10,
            total_lessons_completed: currentStreak.total_lessons_completed + 1,
            last_activity_date: today
          })
          .eq('user_id', user?.id);
      }

      // Refresh data
      await initializeDashboard();
      setSelectedLesson(null);
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meditation': return '🧘‍♀️';
      case 'breathing': return '💨';
      case 'cbt': return '🧠';
      case 'mindfulness': return '🌸';
      case 'challenge': return '🎯';
      default: return '✨';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-24">
      {/* Header */}
      <div className="text-center pt-6 sm:pt-8 pb-4 sm:pb-6 px-4">
        <div className="flex items-center justify-center mb-2">
          <img 
            src="/zenilience_z_logo_2-removebg-preview.png" 
            alt="Zenilience Logo" 
            className="h-6 sm:h-8 w-auto mr-2"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Zenilience</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Welcome back! Ready for today's journey?</p>
      </div>

      {/* Streak Section */}
      <div className="mx-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-full p-2 sm:p-3">
                <Flame className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Streak</h3>
                <p className="text-sm text-gray-600">Keep your motivation going</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500">{streak.current_streak}</div>
              <div className="text-xs sm:text-sm text-gray-500">days</div>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex justify-between text-xs sm:text-sm text-gray-600">
            <span>Longest streak: {streak.longest_streak} days</span>
            <span>Zen points: {streak.zen_garden_points}</span>
          </div>
        </div>
      </div>

      {/* Subscription Limit Info */}
      {profile.subscription_type === 'explorer' && (
        <div className="mx-4 mb-4 sm:mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-center">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm sm:text-base text-yellow-800 font-medium">Explorer Plan</p>
                <p className="text-xs sm:text-sm text-yellow-700">
                  {dailyLessonsCompleted}/1 daily lesson completed. 
                  {!canStartLesson() && " Upgrade to Zenith for unlimited lessons."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lessons Section */}
      <div className="mx-4 pb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Your Lessons</h2>
        <div className="space-y-3 sm:space-y-4">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                    <span className="text-xl sm:text-2xl">{getTypeIcon(lesson.lesson_type)}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{lesson.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{lesson.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 sm:space-x-4 mt-3 sm:mt-4">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock size={14} />
                      <span className="text-xs sm:text-sm">{lesson.estimated_duration} min</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty_level)}`}>
                      {lesson.difficulty_level}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => canStartLesson() ? setSelectedLesson(lesson) : null}
                  disabled={!canStartLesson()}
                  className={`ml-3 sm:ml-4 rounded-full p-2 sm:p-3 transition-all duration-300 flex-shrink-0 ${
                    canStartLesson()
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canStartLesson() ? <Play size={16} /> : <Lock size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Modal */}
      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          onComplete={() => completeLesson(selectedLesson.id)}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
};

export default DashboardHome;