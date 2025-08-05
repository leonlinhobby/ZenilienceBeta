import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface ZenGardenProps {}

const ZenGarden: React.FC<ZenGardenProps> = () => {
  const { user } = useAuth();
  const [totalLessons, setTotalLessons] = useState(0);
  const [zenPoints, setZenPoints] = useState(0);
  const [quote, setQuote] = useState('');

  const quotes = [
    "The way is the goal. - Confucius",
    "In stillness lies strength. - Confucius",
    "He who knows others is wise. He who knows himself is enlightened. - Laozi",
    "The happiness of your life depends upon the quality of your thoughts. - Marcus Aurelius",
    "Be yourself the change you wish to see in this world. - Mahatma Gandhi",
    "The best time to plant a tree was 20 years ago. The second best is now. - Chinese Proverb"
  ];

  useEffect(() => {
    if (user) {
      fetchGardenData();
      setRandomQuote();
    }
  }, [user]);

  const fetchGardenData = async () => {
    try {
      // Handle demo user
      if (user?.id === 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        setTotalLessons(15);
        setZenPoints(150);
        console.log('Demo garden data loaded');
        return;
      }
      
      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('total_lessons_completed, zen_garden_points')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (streakData) {
        setTotalLessons(streakData.total_lessons_completed || 0);
        setZenPoints(streakData.zen_garden_points || 0);
      }
    } catch (error) {
      console.error('Error fetching garden data:', error);
    }
  };

  const setRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  const getFlowerCount = () => {
    if (totalLessons >= 9) return 5;
    if (totalLessons >= 7) return 4;
    if (totalLessons >= 5) return 3;
    if (totalLessons >= 3) return 2;
    if (totalLessons >= 1) return 1;
    return 0;
  };

  const flowerCount = getFlowerCount();

  const renderFlowers = () => {
    const flowers = [];
    const flowerTypes = ['🌸', '🌺', '🌻', '🌷', '🌹'];
    
    for (let i = 0; i < flowerCount; i++) {
      flowers.push(
        <div
          key={i}
          className={`text-6xl animate-bounce transition-all duration-1000 ${
            i % 2 === 0 ? 'animation-delay-200' : 'animation-delay-400'
          }`}
          style={{
            animationDelay: `${i * 200}ms`,
            transform: `rotate(${Math.random() * 20 - 10}deg)`
          }}
        >
          {flowerTypes[i % flowerTypes.length]}
        </div>
      );
    }
    return flowers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-24">
      {/* Header */}
      <div className="text-center pt-8 pb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🌸 Zen Garden</h1>
        <p className="text-gray-600">Your personal garden of growth</p>
      </div>

      {/* Garden Stats */}
      <div className="mx-4 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{totalLessons}</div>
              <div className="text-sm text-gray-600">Completed Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{zenPoints}</div>
              <div className="text-sm text-gray-600">Zen Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Garden Visualization */}
      <div className="mx-4 mb-8">
        <div className="bg-gradient-to-b from-sky-100 to-green-100 rounded-2xl p-8 shadow-lg border border-gray-100 min-h-[300px] relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-green-200 to-transparent"></div>
            <div className="absolute top-4 right-4 text-4xl">☀️</div>
            <div className="absolute top-8 left-8 text-2xl">☁️</div>
            <div className="absolute bottom-4 left-4 text-xl">🌿</div>
            <div className="absolute bottom-4 right-4 text-xl">🌿</div>
          </div>

          {/* Garden Content */}
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Your Garden ({flowerCount} flowers)
            </h3>
            
            {flowerCount === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌱</div>
                <p className="text-gray-600">Your garden is waiting to bloom!</p>
                <p className="text-sm text-gray-500 mt-2">Complete your first lesson to plant a flower.</p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center items-end space-x-4 py-8">
                {renderFlowers()}
              </div>
            )}

            {/* Progress to next flower */}
            {flowerCount < 5 && (
              <div className="mt-8 text-center">
                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Next flower at {flowerCount === 0 ? 1 : flowerCount === 1 ? 3 : flowerCount === 2 ? 5 : flowerCount === 3 ? 7 : 9} lessons
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(totalLessons / (flowerCount === 0 ? 1 : flowerCount === 1 ? 3 : flowerCount === 2 ? 5 : flowerCount === 3 ? 7 : 9)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Quote */}
      <div className="mx-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">💭 Wisdom of the Day</h3>
          <blockquote className="text-center text-gray-700 italic text-lg leading-relaxed">
            "{quote}"
          </blockquote>
          <button
            onClick={setRandomQuote}
            className="mt-4 mx-auto block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm hover:shadow-lg transition-all duration-300"
          >
            New Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZenGarden;