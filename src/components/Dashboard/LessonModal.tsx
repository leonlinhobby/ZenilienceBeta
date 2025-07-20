import React, { useState } from 'react';
import { X, Play, Pause, CheckCircle, Heart, Brain, Wind } from 'lucide-react';
import { Lesson } from '../../types/dashboard';
import { useDashboard } from '../../hooks/useDashboard';

interface LessonModalProps {
  lesson: Lesson;
  onComplete: () => void;
  onClose: () => void;
}

const LessonModal: React.FC<LessonModalProps> = ({ lesson, onComplete, onClose }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(lesson.estimated_duration * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    stress_level: 5,
    mood_score: 5,
    energy_level: 5
  });

  const { recordHealthMetrics } = useDashboard();

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsStarted(true);
    if (lesson.lesson_type === 'meditation' || lesson.lesson_type === 'breathing') {
      setIsTimerRunning(true);
    }
  };

  const handleComplete = async () => {
    setShowFeedback(true);
  };

  const handleSubmitFeedback = async () => {
    await recordHealthMetrics(feedback);
    onComplete();
  };

  const getLessonIcon = () => {
    switch (lesson.lesson_type) {
      case 'meditation': return <Heart className="w-8 h-8 text-pink-600" />;
      case 'breathing': return <Wind className="w-8 h-8 text-blue-600" />;
      case 'cbt': return <Brain className="w-8 h-8 text-purple-600" />;
      default: return <CheckCircle className="w-8 h-8 text-green-600" />;
    }
  };

  const renderLessonContent = () => {
    const content = lesson.content;
    
    switch (lesson.lesson_type) {
      case 'meditation':
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-16 h-16 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2">Meditation</h3>
              <p className="text-stone-600 mb-4">{content?.instruction || 'Finde einen ruhigen Platz und entspanne dich.'}</p>
            </div>
            
            <div className="mb-8">
              <div className="text-4xl font-bold text-stone-800 mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center"
                >
                  {isTimerRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'breathing':
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2">Atemübung</h3>
              <p className="text-stone-600 mb-4">{content?.instruction || 'Folge dem Atemrhythmus.'}</p>
            </div>
            
            <div className="mb-8">
              <div className="text-lg text-stone-700 mb-4">
                4 Sekunden einatmen - 4 Sekunden halten - 4 Sekunden ausatmen
              </div>
              <div className="text-4xl font-bold text-stone-800 mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  {isTimerRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'cbt':
        return (
          <div>
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-16 h-16 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2">CBT Übung</h3>
            </div>
            
            <div className="bg-stone-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-stone-800 mb-2">Deine Aufgabe:</h4>
              <p className="text-stone-700">{content?.task || 'Reflektiere über deine Gedanken und Gefühle.'}</p>
            </div>
            
            <div className="text-center">
              <button
                onClick={handleComplete}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Übung abschließen
              </button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2">{lesson.title}</h3>
              <p className="text-stone-600 mb-4">{lesson.description}</p>
            </div>
            
            <div className="bg-stone-50 rounded-xl p-6 mb-6">
              <div className="text-stone-700">
                {content?.content || 'Inhalt der Lektion...'}
              </div>
            </div>
            
            <button
              onClick={handleComplete}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Lektion abschließen
            </button>
          </div>
        );
    }
  };

  if (showFeedback) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-stone-800 mb-2">Gut gemacht!</h3>
            <p className="text-stone-600">Wie fühlst du dich nach der Lektion?</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Stress Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={feedback.stress_level}
                onChange={(e) => setFeedback(prev => ({ ...prev, stress_level: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-stone-600 mt-1">
                {feedback.stress_level}/10
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Stimmung (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={feedback.mood_score}
                onChange={(e) => setFeedback(prev => ({ ...prev, mood_score: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-stone-600 mt-1">
                {feedback.mood_score}/10
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Energie Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={feedback.energy_level}
                onChange={(e) => setFeedback(prev => ({ ...prev, energy_level: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-stone-600 mt-1">
                {feedback.energy_level}/10
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleSubmitFeedback}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Feedback senden
            </button>
            <button
              onClick={() => {
                setShowFeedback(false);
                onComplete();
              }}
              className="px-4 py-3 text-stone-600 hover:text-stone-800 transition-colors"
            >
              Überspringen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-800">{lesson.title}</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {!isStarted ? (
          <div className="text-center">
            <div className="mb-8">
              {getLessonIcon()}
              <h3 className="text-xl font-bold text-stone-800 mt-4 mb-2">
                Bereit für deine Lektion?
              </h3>
              <p className="text-stone-600 mb-4">{lesson.description}</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-stone-500">
                <span>⏱️ {lesson.estimated_duration} min</span>
                <span>📊 {lesson.difficulty_level}</span>
              </div>
            </div>
            
            <button
              onClick={handleStart}
              className="bg-stone-600 text-white px-8 py-3 rounded-lg hover:bg-stone-700 transition-colors flex items-center mx-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              Lektion starten
            </button>
          </div>
        ) : (
          <div>
            {renderLessonContent()}
            
            {isCompleted && (
              <div className="text-center mt-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-stone-800 mb-2">Lektion abgeschlossen!</h3>
                <button
                  onClick={handleComplete}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Weiter
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonModal;