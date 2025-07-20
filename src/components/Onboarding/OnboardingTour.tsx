import React, { useState } from 'react';
import { ArrowRight, Brain, MessageCircle, TreePine, BookOpen, CheckCircle } from 'lucide-react';

interface OnboardingTourProps {
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Zenilience',
      icon: <Brain className="w-12 h-12 text-stone-600" />,
      content: 'Your personal AI-powered wellness companion. We\'re here to help you build resilience, reduce stress, and achieve lasting mental well-being.',
      highlight: 'Personalized AI guidance in just 5 minutes daily'
    },
    {
      title: 'Your Dashboard',
      icon: <CheckCircle className="w-12 h-12 text-stone-600" />,
      content: 'Track your progress, view daily recommendations, and monitor your wellness journey through beautiful visualizations.',
      highlight: 'Everything you need in one place'
    },
    {
      title: 'Zeno Chat',
      icon: <MessageCircle className="w-12 h-12 text-stone-600" />,
      content: 'Chat with Zeno, your AI wellness companion. Available 24/7 to provide support, guidance, and personalized exercises.',
      highlight: 'Like having a personal therapist in your pocket'
    },
    {
      title: 'Your Zen Garden',
      icon: <TreePine className="w-12 h-12 text-stone-600" />,
      content: 'Watch your garden bloom as you make progress. Each completed session helps your plants grow, reflecting your inner growth.',
      highlight: 'Visual progress that motivates'
    },
    {
      title: 'Wellness Library',
      icon: <BookOpen className="w-12 h-12 text-stone-600" />,
      content: 'Access guided meditations, CBT exercises, and educational content tailored to your needs and goals.',
      highlight: 'Evidence-based techniques at your fingertips'
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-stone-600">Step {currentStep + 1} of {steps.length}</span>
              <span className="text-sm text-stone-600">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div 
                className="bg-stone-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Tour Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-stone-200 text-center">
            <div className="mb-6">
              {steps[currentStep].icon}
            </div>
            
            <h2 className="text-3xl font-bold text-stone-800 mb-4">
              {steps[currentStep].title}
            </h2>
            
            <p className="text-stone-600 text-lg mb-6 leading-relaxed">
              {steps[currentStep].content}
            </p>
            
            <div className="bg-stone-50 rounded-xl p-4 mb-8">
              <p className="text-stone-700 font-medium">
                ✨ {steps[currentStep].highlight}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 text-stone-600 hover:text-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep ? 'bg-stone-600' : 'bg-stone-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextStep}
                className="bg-stone-600 text-white px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors flex items-center group"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;