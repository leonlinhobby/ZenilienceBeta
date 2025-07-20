import React, { useEffect, useState, useRef } from 'react';
import { Brain, Heart, TrendingUp, Target, Users, Zap, CheckCircle, Star } from 'lucide-react';

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const mainFeatures = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Personalization",
      description: "Advanced machine learning adapts to your unique mental health patterns and preferences"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Science-Backed Methods",
      description: "Evidence-based CBT, mindfulness, and positive psychology techniques proven through research"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Visualize your journey with detailed analytics and your personal Zen Garden"
    }
  ];

  const scientificFoundations = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Path",
      description: "AI analyzes your responses to create tailored interventions"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Build Lasting Habits",
      description: "Micro-learning approach makes wellness sustainable"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Stay Motivated",
      description: "Gamification and progress visualization keep you engaged"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Operant Conditioning",
      description: "Positive reinforcement strengthens healthy behaviors"
    }
  ];

  const userJourney = [
    {
      step: "01",
      title: "Get Started",
      description: "Quick onboarding to understand your wellness goals"
    },
    {
      step: "02",
      title: "AI Assessment",
      description: "Our AI evaluates your patterns and sets personalized targets"
    },
    {
      step: "03",
      title: "Tailored Lessons",
      description: "Receive your first personalized exercises and practices"
    },
    {
      step: "04",
      title: "Daily Progress",
      description: "5-minute sessions build lasting resilience"
    },
    {
      step: "05",
      title: "Continuous Evolution",
      description: "AI refines your experience based on progress"
    }
  ];

  const highlights = [
    {
      title: "AI-Driven Personalization",
      description: "Dynamic content that evolves with your progress"
    },
    {
      title: "Interactive CBT Exercises",
      description: "Engaging activities that make therapy accessible"
    },
    {
      title: "Guided Meditations",
      description: "Professionally crafted sessions for immediate calm"
    },
    {
      title: "Zen Garden Visualization",
      description: "Watch your garden bloom as you grow stronger"
    }
  ];

  return (
    <section ref={sectionRef} id="features" className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url('/very very minimalist website background, light mode, happy soft colors, shapes modern4.jpg')`,
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-b from-white/40 to-white/20 transition-opacity duration-1000 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Why Zenilience Works
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Scientifically validated methodologies powered by AI technology
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="bg-stone-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-stone-600 group-hover:bg-stone-200 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-4 group-hover:text-stone-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-stone-600 group-hover:text-stone-500 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Scientific Foundations */}
        <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-stone-200 rounded-full opacity-20 transform translate-x-8 -translate-y-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-stone-300 rounded-full opacity-20 transform -translate-x-4 translate-y-4"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="bg-stone-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
                The Science Behind Zenilience
              </h3>
              <p className="text-stone-600 max-w-2xl mx-auto">
                Our approach combines cutting-edge AI with evidence-based psychological principles
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {scientificFoundations.map((foundation, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl p-3 text-stone-600 group-hover:from-stone-200 group-hover:to-stone-300 group-hover:scale-110 transition-all duration-300">
                      {foundation.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-stone-600 transition-colors">
                        {foundation.title}
                      </h4>
                      <p className="text-stone-600 group-hover:text-stone-500 transition-colors">
                        {foundation.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Journey */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-12 text-center">
            Your Journey to Wellness
          </h3>
          <div className="grid md:grid-cols-5 gap-8">
            {userJourney.map((step, index) => (
              <div key={index} className="text-center relative group cursor-pointer">
                <div className="bg-stone-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold group-hover:bg-stone-700 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                  {step.step}
                </div>
                <h4 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-stone-600 transition-colors">
                  {step.title}
                </h4>
                <p className="text-stone-600 text-sm group-hover:text-stone-500 transition-colors">
                  {step.description}
                </p>
                {index < userJourney.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-stone-200 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-2 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-stone-500/10 transition-all duration-300 transform hover:scale-105 cursor-pointer group">
              <div className="flex items-start space-x-4">
                <Star className="w-6 h-6 text-stone-600 mt-1 group-hover:text-stone-500 group-hover:scale-110 transition-all duration-300" />
                <div>
                  <h4 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-stone-600 transition-colors">
                    {highlight.title}
                  </h4>
                  <p className="text-stone-600 group-hover:text-stone-500 transition-colors">
                    {highlight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
      
      {/* Smooth transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/60 via-white/20 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Features;