import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    rating: 0,
    countries: 0,
    time: 0
  });

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

  useEffect(() => {
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;
      
      const targets = {
        users: 250000,
        rating: 4.9,
        countries: 120,
        time: 5
      };

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStats({
          users: Math.floor(targets.users * progress),
          rating: Math.min(targets.rating * progress, 4.9),
          countries: Math.floor(targets.countries * progress),
          time: Math.floor(targets.time * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, increment);

      return () => clearInterval(timer);
    };

    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url('/very very minimalist website background, light mode, happy soft colors, shapes modern5.jpg')`,
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-b from-white/10 to-white/30 transition-opacity duration-1000 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center relative z-10">
          {/* Main Heading with Animation */}
          <h1 className="text-5xl md:text-7xl font-bold text-stone-800 mb-6">
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Z</span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>e</span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.3s' }}>n</span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.4s' }}>i</span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.5s' }}>l</span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.6s' }}>i</span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.7s' }}>e</span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.8s' }}>n</span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.9s' }}>c</span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '1.0s' }}>e</span>
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-2xl md:text-3xl text-stone-700 mb-4 font-medium animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            Build Your Resilience. The Smarter Path to Mental Wellness
          </h2>
          
          {/* Description */}
          <p className="text-stone-600 text-lg mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
            Personalized AI guidance for mental wellness in 5 minutes daily
          </p>
          
          {/* Trust Badge */}
          <div className="bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 inline-block mb-12 border border-stone-200 animate-fade-in-up" style={{ animationDelay: '1.6s' }}>
            <p className="text-stone-700 font-medium">
              Trusted by 250,000+ users worldwide
            </p>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
                {stats.users >= 1000 ? `${Math.floor(stats.users / 1000)}K+` : stats.users}
              </div>
              <div className="text-stone-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
                {stats.rating.toFixed(1)}
              </div>
              <div className="text-stone-600">App Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
                {stats.countries}+
              </div>
              <div className="text-stone-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
                {stats.time}m
              </div>
              <div className="text-stone-600">Daily Time</div>
            </div>
          </div>
          
          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '1.8s' }}>
            <button className="bg-stone-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-stone-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-stone-500/25 flex items-center justify-center group relative overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-stone-500 to-stone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10 flex items-center">
              Start Your Free Journey
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </span>
            </button>
            <button className="border-2 border-stone-600 text-stone-600 px-8 py-4 rounded-lg font-semibold hover:bg-stone-600 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center group relative overflow-hidden">
              <span className="absolute inset-0 bg-stone-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              <span className="relative z-10 flex items-center">
              <Play className="mr-2 group-hover:scale-110 transition-transform" size={20} />
              See the Science
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Smooth transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/60 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;