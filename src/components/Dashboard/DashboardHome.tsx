import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Play, Clock, Star, Flame } from 'lucide-react';
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

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [streak, setStreak] = useState<Streak>({ current_streak: 0, longest_streak: 0, zen_garden_points: 0 });
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLessons();
      fetchStreak();
    }
  }, [user]);

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
        await generateNewLessons();
      } else {
        setLessons(data);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStreak = async () => {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setStreak(data);
    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  };

  const generateNewLessons = async () => {
    const defaultLessons = [
      {
        title: "Morgen-Meditation",
        description: "Starte deinen Tag mit einer beruhigenden 5-Minuten Meditation",
        lesson_type: "meditation",
        estimated_duration: 5,
        difficulty_level: "beginner",
        content: {
          instruction: "Finde einen ruhigen Platz und setze dich bequem hin.",
          steps: ["Schließe die Augen", "Atme tief ein und aus", "Konzentriere dich auf deinen Atem"],
          duration: 5,
          tips: ["Keine Sorge, wenn deine Gedanken abschweifen", "Kehre sanft zu deinem Atem zurück"]
        }
      },
      {
        title: "Atemübung 4-7-8",
        description: "Eine kraftvolle Atemtechnik zur sofortigen Entspannung",
        lesson_type: "breathing",
        estimated_duration: 5,
        difficulty_level: "beginner",
        content: {
          instruction: "Atme nach dem bewährten 4-7-8 Rhythmus.",
          steps: ["4 Sekunden einatmen", "7 Sekunden anhalten", "8 Sekunden ausatmen"],
          duration: 5,
          tips: ["Wiederhole 4-5 Zyklen", "Konzentriere dich nur auf das Zählen"]
        }
      },
      {
        title: "Gedanken-Check",
        description: "Lerne deine Gedankenmuster zu erkennen und zu verändern",
        lesson_type: "cbt",
        estimated_duration: 10,
        difficulty_level: "intermediate",
        content: {
          instruction: "Identifiziere einen belastenden Gedanken von heute.",
          steps: ["Schreibe den Gedanken auf", "Frage: Ist das wirklich wahr?", "Finde eine ausgewogenere Sichtweise"],
          duration: 10,
          tips: ["Sei geduldig mit dir", "Es ist normal, dass das Üben braucht"]
        }
      },
      {
        title: "Achtsamkeits-Spaziergang",
        description: "Verbinde dich mit dem gegenwärtigen Moment",
        lesson_type: "mindfulness",
        estimated_duration: 15,
        difficulty_level: "beginner",
        content: {
          instruction: "Gehe langsam und bewusst für 15 Minuten.",
          steps: ["Spüre deine Füße auf dem Boden", "Nimm Geräusche bewusst wahr", "Beobachte deine Umgebung ohne zu bewerten"],
          duration: 15,
          tips: ["Kein Ziel haben", "Einfach nur da sein"]
        }
      },
      {
        title: "Digital Detox Challenge",
        description: "Reduziere deine Bildschirmzeit für besseres Wohlbefinden",
        lesson_type: "challenge",
        estimated_duration: 120,
        difficulty_level: "intermediate",
        content: {
          instruction: "Vermeide für die nächsten 2 Stunden alle Bildschirme.",
          steps: ["Handy stumm schalten", "Etwas anderes machen (lesen, spazieren, kochen)", "Reflektiere über die Erfahrung"],
          duration: 120,
          tips: ["Bereite eine Alternative vor", "Teile anderen mit, dass du offline bist"]
        }
      }
    ];

    try {
      for (let i = 0; i < defaultLessons.length; i++) {
        const lesson = defaultLessons[i];
        await supabase
          .from('lessons')
          .insert({
            user_id: user?.id,
            title: lesson.title,
            description: lesson.description,
            lesson_type: lesson.lesson_type,
            content: lesson.content,
            estimated_duration: lesson.estimated_duration,
            difficulty_level: lesson.difficulty_level,
            position_in_queue: i + 1
          });
      }
      await fetchLessons();
    } catch (error) {
      console.error('Error generating lessons:', error);
    }
  };

  const completeLesson = async (lessonId: string) => {
    try {
      // Mark lesson as completed
      await supabase
        .from('lessons')
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq('id', lessonId);

      // Update streak
      await supabase.rpc('update_user_streak', { user_uuid: user?.id });

      // Refresh data
      await fetchLessons();
      await fetchStreak();
      
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-24">
      {/* Header */}
      <div className="text-center pt-8 pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Zenilience</h1>
        <p className="text-gray-600">Willkommen zurück! Bereit für deine heutige Reise?</p>
      </div>

      {/* Streak Section */}
      <div className="mx-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-full p-3">
                <Flame className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Deine Serie</h3>
                <p className="text-gray-600">Halte deine Motivation aufrecht</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-500">{streak.current_streak}</div>
              <div className="text-sm text-gray-500">Tage</div>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Längste Serie: {streak.longest_streak} Tage</span>
            <span>Zen Punkte: {streak.zen_garden_points}</span>
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="mx-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Deine Lektionen</h2>
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(lesson.lesson_type)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
                      <p className="text-gray-600 text-sm">{lesson.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock size={16} />
                      <span className="text-sm">{lesson.estimated_duration} Min</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty_level)}`}>
                      {lesson.difficulty_level}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedLesson(lesson)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-3 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Play size={20} />
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