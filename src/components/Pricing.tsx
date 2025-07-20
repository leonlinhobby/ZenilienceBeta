import React, { useEffect, useState, useRef } from 'react';
import { Check, Star, Zap } from 'lucide-react';

const Pricing: React.FC = () => {
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

  const explorerFeatures = [
    "Basic AI Recommendations",
    "Daily Exercise",
    "5 AI Chat messages per day",
    "Basic Zen Garden",
    "Core Meditation Library",
    "Progress Tracking",
    "Community Access"
  ];

  const zenithFeatures = [
    "Advanced AI Personalization",
    "Unlimited Daily tasks",
    "Unlimited AI Chats",
    "Full Zen Garden Experience",
    "Premium Meditation Library",
    "Personalized CBT Exercises",
    "Advanced Progress Analytics",
    "Priority Support",
    "Expert-Led Workshops",
    "Stress Pattern Analysis",
    "Custom Wellness Plans"
  ];

  return (
    <section ref={sectionRef} id="pricing" className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url('/very minimalist website background, light mode, happy soft colors, shapes modern2.jpg')`,
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-b from-white/25 to-white/30 transition-opacity duration-1000 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Choose Your Path
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Start your journey to better mental health today
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* Explorer Plan */}
          <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-3xl p-8 border-2 border-stone-200 hover:shadow-xl hover:shadow-stone-500/10 transition-all duration-300 transform hover:scale-105">
            <div className="text-center mb-8">
              <div className="bg-stone-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:bg-stone-300 hover:scale-110 transition-all duration-300">
                <Star className="w-8 h-8 text-stone-600" />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2">Explorer</h3>
              <div className="text-4xl font-bold text-stone-800 mb-2">Free</div>
              <p className="text-stone-600">
                Perfect for getting started with mindfulness and building healthy habits
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {explorerFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-stone-600 mr-3" />
                  <span className="text-stone-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-stone-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-stone-700 transition-colors">
              Start Free
            </button>
          </div>

          {/* Zenith Plan */}
          <div className="bg-gradient-to-br from-stone-600 to-stone-700 rounded-3xl p-8 text-white relative overflow-hidden hover:shadow-xl hover:shadow-stone-800/30 transition-all duration-300 transform hover:scale-105">
            <div className="absolute top-4 right-4 bg-yellow-400 text-stone-800 px-3 py-1 rounded-full text-sm font-semibold">
              Popular
            </div>
            
            <div className="text-center mb-8">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:bg-white/30 hover:scale-110 transition-all duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Zenith</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$5.99</span>
                <span className="text-stone-100">/month</span>
              </div>
              <div className="text-stone-100 mb-2">
                or $59.9/year (save 17%)
              </div>
              <p className="text-stone-100">
                Complete wellness transformation with full AI power and premium features
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {zenithFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-stone-200 mr-3" />
                  <span className="text-stone-50">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-white text-stone-600 py-3 px-6 rounded-lg font-semibold hover:bg-stone-50 transition-colors">
              Start Premium Trial
            </button>
          </div>
        </div>

        {/* Final Call-to-Action */}
        <div className="text-center bg-gradient-to-r from-stone-600 to-stone-700 rounded-3xl p-12 text-white relative overflow-hidden hover:shadow-2xl hover:shadow-stone-800/30 transition-all duration-300 transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-stone-600/80 to-stone-700/80 group-hover:from-stone-500/80 group-hover:to-stone-600/80 transition-all duration-300"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Mental Wellness?
            </h3>
            <p className="text-xl mb-8 text-stone-100 max-w-2xl mx-auto">
              Join thousands who have discovered the power of personalized AI-driven mental wellness.
            </p>
            <button className="bg-white text-stone-600 px-12 py-4 rounded-lg font-bold text-lg hover:bg-stone-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              Start Your Free Journey Today
            </button>
          </div>
        </div>
        </div>
      </div>
      
      {/* Smooth transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/60 via-white/20 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Pricing;