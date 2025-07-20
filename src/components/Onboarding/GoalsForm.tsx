import React, { useState } from 'react';
import { ArrowRight, Target, Plus, X, CheckCircle } from 'lucide-react';

interface GoalsFormProps {
  onComplete: (goals: Array<{ goal_type: string; goal_description?: string }>) => void;
}

const GoalsForm: React.FC<GoalsFormProps> = ({ onComplete }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState('');
  const [customGoals, setCustomGoals] = useState<string[]>([]);

  const predefinedGoals = [
    { id: 'stress-reduction', label: 'Reduce Stress & Anxiety', description: 'Learn techniques to manage daily stress' },
    { id: 'sleep-improvement', label: 'Improve Sleep Quality', description: 'Develop better sleep habits and routines' },
    { id: 'mindfulness', label: 'Increase Mindfulness', description: 'Build present-moment awareness' },
    { id: 'emotional-regulation', label: 'Better Emotional Control', description: 'Manage emotions more effectively' },
    { id: 'focus-concentration', label: 'Enhance Focus', description: 'Improve attention and concentration' },
    { id: 'self-esteem', label: 'Build Self-Confidence', description: 'Develop a positive self-image' },
    { id: 'relationships', label: 'Improve Relationships', description: 'Enhance social connections and communication' },
    { id: 'work-life-balance', label: 'Work-Life Balance', description: 'Create healthy boundaries between work and personal life' },
    { id: 'resilience', label: 'Build Resilience', description: 'Develop ability to bounce back from challenges' },
    { id: 'habit-building', label: 'Build Healthy Habits', description: 'Create and maintain positive daily routines' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleAddCustomGoal = () => {
    if (customGoal.trim() && !customGoals.includes(customGoal.trim())) {
      setCustomGoals(prev => [...prev, customGoal.trim()]);
      setCustomGoal('');
    }
  };

  const handleRemoveCustomGoal = (goalToRemove: string) => {
    setCustomGoals(prev => prev.filter(goal => goal !== goalToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goals = [
      ...selectedGoals.map(goalId => ({ goal_type: goalId })),
      ...customGoals.map(goal => ({ goal_type: 'custom', goal_description: goal }))
    ];
    
    onComplete(goals);
  };

  const isValid = selectedGoals.length > 0 || customGoals.length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/very minimalist website background, light mode, happy soft colors, shapes modern.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-stone-200">
            <div className="text-center mb-8">
              <div className="bg-stone-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-stone-600" />
              </div>
              <h2 className="text-3xl font-bold text-stone-800 mb-2">
                What are your wellness goals?
              </h2>
              <p className="text-stone-600">
                Select the areas you'd like to focus on. You can choose multiple goals.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Predefined Goals */}
              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-4">
                  Choose from our recommended goals:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predefinedGoals.map(goal => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedGoals.includes(goal.id)
                          ? 'border-stone-600 bg-stone-50 shadow-md'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-stone-800 mb-1">
                            {goal.label}
                          </h4>
                          <p className="text-sm text-stone-600">
                            {goal.description}
                          </p>
                        </div>
                        {selectedGoals.includes(goal.id) && (
                          <CheckCircle className="w-5 h-5 text-stone-600 ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Goals */}
              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-4">
                  Add your own goals:
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input
                    type="text"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    className="flex-1 px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    placeholder="Describe your personal wellness goal..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomGoal())}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomGoal}
                    disabled={!customGoal.trim()}
                    className="px-4 py-3 bg-stone-600 text-white rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </button>
                </div>
                
                {customGoals.length > 0 && (
                  <div className="space-y-2">
                    {customGoals.map((goal, index) => (
                      <div key={index} className="flex items-center justify-between bg-stone-50 p-3 rounded-lg">
                        <span className="text-stone-800">{goal}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomGoal(goal)}
                          className="text-stone-400 hover:text-stone-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-stone-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center group"
              >
                Complete Setup
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsForm;