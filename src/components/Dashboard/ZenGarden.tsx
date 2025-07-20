import React, { useState, useEffect } from 'react';
import { UserStreaks } from '../../types/dashboard';
import { TreePine, Flower, Sprout, Star, Sparkles } from 'lucide-react';

interface ZenGardenProps {
  streaks: UserStreaks | null;
}

const ZenGarden: React.FC<ZenGardenProps> = ({ streaks }) => {
  const zenPoints = streaks?.zen_garden_points || 0;
  const totalLessons = streaks?.total_lessons_completed || 0;
  const currentStreak = streaks?.current_streak || 0;
  const [animateFlowers, setAnimateFlowers] = useState(false);

  useEffect(() => {
    setAnimateFlowers(true);
  }, []);

  const getGardenElements = () => {
    const elements = [];
    
    // Add flowers based on lesson milestones: 1, 3, 5, 7, 9, etc.
    const flowerMilestones = [1, 3, 5, 7, 9, 12, 15, 18, 21, 25, 30];
    
    flowerMilestones.forEach((milestone, index) => {
      if (totalLessons >= milestone) {
        const flowerTypes = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🌿', '🌱', '🪷', '🌵', '🌴'];
        elements.push({
          type: `flower-${index}`,
          emoji: flowerTypes[index % flowerTypes.length],
          label: `${milestone} Lektionen`,
          milestone: milestone
        });
      }
    });
    
    return elements;
  };

  const gardenElements = getGardenElements();
  
  const quotes = [
    "Der Garten deines Geistes blüht mit jeder Lektion.",
    "Wie Blumen braucht auch dein Wohlbefinden Zeit zum Wachsen.",
    "Jede abgeschlossene Lektion ist ein Samen für deine Zukunft.",
    "In der Ruhe liegt die Kraft - wie in einem stillen Garten.",
    "Dein innerer Garten wird jeden Tag schöner.",
    "Wachstum geschieht leise, aber stetig - wie in der Natur.",
    "Pflege deinen Geist wie einen Garten - mit Liebe und Geduld."
  ];
  
  const todaysQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <div className="flex items-center justify-center mb-4">
          <TreePine className="w-8 h-8 text-green-600 mr-2" />
          <h1 className="text-3xl font-bold text-stone-800">Dein Zen Garten</h1>
        </div>
        <p className="text-stone-600 text-lg">
          {todaysQuote}
        </p>
      </div>

      {/* Garden Stats */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">{totalLessons}</div>
            <div className="text-xs text-stone-600">Lektionen</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">{gardenElements.length}</div>
            <div className="text-xs text-stone-600">Blumen</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">{zenPoints}</div>
            <div className="text-xs text-stone-600">Punkte</div>
          </div>
        </div>
      </div>

      {/* Garden Display */}
      <div className="px-4 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-stone-200">
          <div className="bg-gradient-to-b from-sky-100 to-green-100 rounded-3xl p-8 min-h-[300px] relative overflow-hidden">
            {/* Garden Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-200/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-green-300 to-green-400 rounded-b-3xl"></div>
            
            {gardenElements.length === 0 ? (
              <div className="text-center py-16">
                <Sprout className="w-20 h-20 text-stone-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-stone-800 mb-2">
                  Dein Garten wartet darauf zu blühen
                </h3>
                <p className="text-stone-600">
                  Schließe deine erste Lektion ab, um die erste Blume zu pflanzen
                </p>
              </div>
            ) : (
              <div className="relative z-10">
                {/* Garden Grid */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                  {gardenElements.map((element, index) => (
                    <div
                      key={index}
                      className={`text-center transform transition-all duration-500 hover:scale-125 cursor-pointer ${
                        animateFlowers ? 'animate-bounce' : ''
                      }`}
                      style={{
                        animationDelay: `${index * 0.3}s`,
                        animationDuration: '0.8s',
                        animationFillMode: 'both'
                      }}
                    >
                      <div className="text-5xl mb-2 relative">
                        {element.emoji}
                        {index < 3 && (
                          <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                        )}
                      </div>
                      <div className="text-xs text-stone-600 bg-white/90 px-2 py-1 rounded-full shadow-sm">
                        {element.label}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <p className="text-stone-700 font-medium mb-3">
                    Dein Garten {gardenElements.length < 3 ? 'wächst' : 'blüht wunderschön'}!
                  </p>
                  <div className="flex items-center justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(gardenElements.length / 2) ? 'text-yellow-400 fill-current' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      <div className="px-4 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-800">Nächstes Ziel</h3>
            <Flower className="w-6 h-6 text-green-600" />
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-stone-800 mb-2">
              {totalLessons === 0 ? '1' : 
               totalLessons < 3 ? '3' :
               totalLessons < 5 ? '5' :
               totalLessons < 7 ? '7' :
               totalLessons < 9 ? '9' :
               `${Math.ceil(totalLessons / 5) * 5 + 5}`} Lektionen
            </div>
            <p className="text-stone-600 text-sm mb-4">
              {totalLessons === 0 ? 'Für deine erste Blume' :
               'Für deine nächste Blume'}
            </p>
            
            <div className="bg-stone-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((totalLessons % 5) / 5 * 100, 100)}%`
                }}
              ></div>
            </div>
            
            <div className="text-xs text-stone-500">
              {totalLessons % 5}/5 Lektionen bis zur nächsten Blume
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZenGarden;