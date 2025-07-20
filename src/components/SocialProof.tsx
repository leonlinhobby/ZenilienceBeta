import React, { useState, useEffect, useRef } from 'react';
import { Star, Globe, Users, MessageCircle, Award, Newspaper, Zap, TrendingUp, Smartphone, Play } from 'lucide-react';

const SocialProof: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

  const metrics = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "250K+",
      label: "Active Users",
      description: "Growing community"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      value: "2M+",
      label: "Wellness Sessions",
      description: "Completed successfully"
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: "4.9",
      label: "App Store Rating",
      description: "From 50,000+ reviews"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      value: "120+",
      label: "Countries",
      description: "Worldwide reach"
    }
  ];

  const testimonials = [
    {
      quote: "Zenilience helped me manage my anxiety pretty good. The personalized approach made all the difference. Now I feel in control of my mental health again 😊.",
      name: "Sarah M.",
      title: "Marketing Professional",
      location: "San Francisco, CA"
    },
    {
      quote: "The AI recommendations are spot-on. I've built a sustainable wellness routine that actually fits my life. The 5-minute sessions are perfect for a busy schedule.",
      name: "David L.",
      title: "Software Engineer",
      location: "Austin, TX"
    },
    {
      quote: "I love how the app evolves with me. The Zen Garden feature is beautiful and motivating. Watching my garden bloom as I progress is incredibly rewarding.",
      name: "Emma K.",
      title: "Teacher",
      location: "Portland, OR"
    },
    {
      quote: "The scientific approach really resonates with me. I can see the methodology behind each exercise, which builds my confidence in the process.",
      name: "Dr. Michael R.",
      title: "Psychologist",
      location: "Boston, MA"
    },
    {
      quote: "As someone who travels frequently, having personalized wellness guidance in my pocket has been life-changing. The app adapts to my schedule perfectly.",
      name: "Lisa T.",
      title: "Business Consultant",
      location: "New York, NY"
    },
    {
      quote: "The meditation sessions are incredible. I've never been able to stick to a mindfulness routine before, but Zenilience makes it effortless and enjoyable.",
      name: "James W.",
      title: "Graphic Designer",
      location: "Los Angeles, CA"
    },
    {
      quote: "My sleep quality has improved dramatically. The evening wind-down routines are perfectly calibrated to help me relax after stressful days.",
      name: "Maria G.",
      title: "Nurse",
      location: "Chicago, IL"
    },
    {
      quote: "The AI chat feature feels like having a personal therapist available 24/7. It's remarkable how well it understands my emotional patterns.",
      name: "Alex C.",
      title: "Data Scientist",
      location: "Seattle, WA"
    },
    {
      quote: "I've tried many mental health apps, but Zenilience is the only one that actually adapts to my progress. It's like having a personalized wellness coach.",
      name: "Rachel H.",
      title: "Product Manager",
      location: "Denver, CO"
    },
    {
      quote: "The stress management techniques are game-changing. I can now handle work pressure without feeling overwhelmed. Highly recommend!",
      name: "Kevin P.",
      title: "Financial Analyst",
      location: "Miami, FL"
    },
    {
      quote: "What sets Zenilience apart is how it learns from my responses. Every session feels tailored specifically to what I need that day.",
      name: "Sophie L.",
      title: "UX Designer",
      location: "Amsterdam, NL"
    },
    {
      quote: "The breathing exercises have become my go-to for anxiety management. Simple, effective, and always available when I need them most.",
      name: "Marcus J.",
      title: "Entrepreneur",
      location: "Toronto, CA"
    },
    {
      quote: "I love the scientific backing behind every exercise. As a researcher, I appreciate evidence-based approaches to mental wellness.",
      name: "Dr. Amanda F.",
      title: "Research Scientist",
      location: "London, UK"
    },
    {
      quote: "The app's ability to track my mood patterns has given me incredible insights into my mental health. Knowledge is power, and Zenilience provides both.",
      name: "Tyler R.",
      title: "Marketing Director",
      location: "Phoenix, AZ"
    },
    {
      quote: "The community features help me feel less alone in my wellness journey. Connecting with others who share similar goals is incredibly motivating.",
      name: "Isabella M.",
      title: "Social Worker",
      location: "Barcelona, ES"
    },
    {
      quote: "As a parent, finding time for self-care is challenging. Zenilience's quick sessions fit perfectly into my hectic schedule without compromising effectiveness.",
      name: "Jennifer S.",
      title: "Mother & Freelancer",
      location: "Nashville, TN"
    },
    {
      quote: "The progressive muscle relaxation feature has eliminated my chronic tension headaches. It's like having a personal massage therapist in my phone.",
      name: "Carlos R.",
      title: "Physical Therapist",
      location: "San Diego, CA"
    },
    {
      quote: "The cognitive behavioral therapy exercises are expertly crafted. I've seen more progress in 3 months than in years of traditional therapy.",
      name: "Priya N.",
      title: "Software Developer",
      location: "Bangalore, IN"
    },
    {
      quote: "The mindfulness reminders throughout the day help me stay grounded and present. It's transformed how I approach both work and relationships.",
      name: "Oliver K.",
      title: "Architect",
      location: "Stockholm, SE"
    },
    {
      quote: "The personalized wellness plans evolve with my needs. What started as anxiety management has grown into a comprehensive self-care routine.",
      name: "Zoe B.",
      title: "Creative Director",
      location: "Melbourne, AU"
    }
  ];

  const featuredIn = [
    "TechCrunch",
    "Wired",
    "Forbes",
    "App Store",
    "Google Play"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url('/very minimalist website background, light mode, happy soft colors, shapes modern3.jpg')`,
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-b from-white/30 to-white/20 transition-opacity duration-1000 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Join a growing community of individuals transforming their mental wellness
          </p>
        </div>

        {/* Metrics */}
        <div className="bg-gradient-to-r from-stone-600 to-stone-700 rounded-3xl p-12 mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-stone-600/95 to-stone-700/95"></div>
          <div className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 group-hover:shadow-2xl">
                    <div className="text-white/80 mb-4 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                      {metric.icon}
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-stone-100 transition-colors">
                      {metric.value}
                    </div>
                    <div className="text-lg font-semibold text-stone-200 mb-1 group-hover:text-white transition-colors">
                      {metric.label}
                    </div>
                    <div className="text-sm text-stone-300 group-hover:text-stone-100 transition-colors">
                      {metric.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Founder's Story */}
        <div className="bg-white rounded-3xl p-8 md:p-12 mb-20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-stone-200 transition-colors">
                <Award className="w-10 h-10 text-stone-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">Leon Lin</h3>
              <p className="text-stone-600">Founder & CEO</p>
            </div>
            <blockquote className="text-lg text-stone-700 text-center italic leading-relaxed">
              "After struggling with phone addiction and unhealthy habits as a student, I realized that traditional therapy, while valuable, wasn't accessible or personalized enough for our fast-paced world. Zenilience was born from the vision of making mental wellness as intelligent and personalized as the technology we use every day."
            </blockquote>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-12 text-center">
            What Our Users Say
          </h3>
          
          {/* Modern Infinite Scrolling Testimonials */}
          <div className="relative overflow-hidden">
            <div className="flex flex-col space-y-6">
              {/* First row - Left to Right */}
              <div className="flex animate-scroll-left">
                {/* First set of testimonials */}
                {testimonials.slice(0, 10).map((testimonial, index) => (
                  <div key={index} className="flex-shrink-0 w-80 mx-4">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100 hover:shadow-xl transition-all duration-300">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-stone-700 text-sm mb-4 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-stone-400 to-stone-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-800 text-sm">{testimonial.name}</div>
                          <div className="text-stone-600 text-xs">{testimonial.title}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {testimonials.slice(0, 10).map((testimonial, index) => (
                  <div key={`duplicate-${index}`} className="flex-shrink-0 w-80 mx-4">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100 hover:shadow-xl transition-all duration-300">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-stone-700 text-sm mb-4 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-stone-400 to-stone-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-800 text-sm">{testimonial.name}</div>
                          <div className="text-stone-600 text-xs">{testimonial.title}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second row - Right to Left */}
              <div className="flex animate-scroll-right">
                {/* Second set of testimonials */}
                {testimonials.slice(10, 20).map((testimonial, index) => (
                  <div key={index} className="flex-shrink-0 w-80 mx-4">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100 hover:shadow-xl transition-all duration-300">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-stone-700 text-sm mb-4 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-stone-400 to-stone-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-800 text-sm">{testimonial.name}</div>
                          <div className="text-stone-600 text-xs">{testimonial.title}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {testimonials.slice(10, 20).map((testimonial, index) => (
                  <div key={`duplicate-${index}`} className="flex-shrink-0 w-80 mx-4">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100 hover:shadow-xl transition-all duration-300">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-stone-700 text-sm mb-4 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-stone-400 to-stone-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-800 text-sm">{testimonial.name}</div>
                          <div className="text-stone-600 text-xs">{testimonial.title}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories Summary */}
        <div className="bg-gradient-to-r from-stone-50 to-stone-100 rounded-2xl p-8 mb-20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-stone-800 mb-6">Success Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-stone-600 mb-2">89%</div>
                <div className="text-stone-700">Report reduced anxiety</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-stone-600 mb-2">7 days</div>
                <div className="text-stone-700">Average time to see results</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-stone-600 mb-2">94%</div>
                <div className="text-stone-700">Continue using after 30 days</div>
              </div>
            </div>
          </div>
        </div>
        {/* Featured In - Creative Design */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-stone-800 mb-8">As Featured In</h3>
          <div className="bg-gradient-to-r from-stone-600 to-stone-700 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-stone-600/90 to-stone-700/90"></div>
            <div className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {featuredIn.map((publication, index) => (
                  <div key={index} className="text-center group cursor-pointer">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                      <div className="text-white/80 mb-3 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                        {publication === 'TechCrunch' && <Newspaper className="w-8 h-8 mx-auto" />}
                        {publication === 'Wired' && <Zap className="w-8 h-8 mx-auto" />}
                        {publication === 'Forbes' && <TrendingUp className="w-8 h-8 mx-auto" />}
                        {publication === 'App Store' && <Smartphone className="w-8 h-8 mx-auto" />}
                        {publication === 'Google Play' && <Play className="w-8 h-8 mx-auto" />}
                      </div>
                      <span className="text-white font-semibold text-sm group-hover:text-stone-200 transition-colors">
                        {publication}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      
      {/* Smooth transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/60 via-white/20 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default SocialProof;