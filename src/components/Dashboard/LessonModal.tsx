import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';

interface LessonModalProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    lesson_type: string;
    content: {
      instruction: string;
      steps: string[];
      duration: number;
      tips: string[];
    };
    estimated_duration: number;
  };
  onComplete: () => void;
  onClose: () => void;
}

const LessonModal: React.FC<LessonModalProps> = ({ lesson, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(lesson.content.duration * 60);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsTimerRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return time - 1;
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

  const resetTimer = () => {
    setTimeLeft(lesson.content.duration * 60);
    setIsTimerRunning(false);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">{lesson.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600 mt-2">{lesson.description}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Instruction */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Instructions</h3>
            <p className="text-gray-600">{lesson.content.instruction}</p>
          </div>

          {/* Timer */}
          {lesson.lesson_type === 'meditation' || lesson.lesson_type === 'breathing' ? (
            <div className="mb-6 text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-colors"
                >
                  {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={resetTimer}
                  className="bg-gray-500 text-white rounded-full p-3 hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>
          ) : null}

          {/* Steps */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Steps</h3>
            <div className="space-y-3">
              {lesson.content.steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                    currentStep === index ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > index ? 'bg-green-500 text-white' :
                    currentStep === index ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {currentStep > index ? '✓' : index + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{step}</p>
                </div>
              ))}
            </div>
            
            {currentStep < lesson.content.steps.length - 1 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Next Step
              </button>
            )}
          </div>

          {/* Tips */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Tips</h3>
            <div className="space-y-2">
              {lesson.content.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">💡</span>
                  <p className="text-gray-600 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={lesson.lesson_type === 'meditation' || lesson.lesson_type === 'breathing' ? !isCompleted && timeLeft > 0 : false}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
              isCompleted || (lesson.lesson_type !== 'meditation' && lesson.lesson_type !== 'breathing')
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isCompleted ? (
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle size={20} />
                <span>Lesson completed!</span>
              </div>
            ) : (
              'Complete Lesson'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonModal;