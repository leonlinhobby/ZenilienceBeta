import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`bg-white/90 backdrop-blur-xl border-b border-stone-100 sticky top-0 z-50 transition-all duration-500 ${
      isScrolled ? 'shadow-lg py-1' : 'shadow-sm py-2'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-12 sm:h-14">
          {/* Logo */}
          <div className="flex items-center group cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-stone-100 to-stone-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Link to="/" className="flex items-center relative z-10">
            <img 
              src="/zenilience_z_logo_2-removebg-preview.png" 
              alt="Zenilience Logo" 
              className="h-6 sm:h-7 w-auto mr-2 sm:mr-3 group-hover:scale-110 transition-all duration-500 relative z-10 group-hover:rotate-12"
            />
            <span className="text-lg sm:text-xl font-bold text-stone-800 group-hover:text-stone-600 transition-all duration-300 relative z-10 group-hover:scale-105">
              Zenilience
            </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {location.pathname === '/' ? (
              <>
                <a href="#features" className="text-sm lg:text-base text-stone-600 hover:text-stone-900 transition-all duration-300 font-medium relative group py-1.5 px-2 rounded-lg">
              <span className="absolute inset-0 bg-gradient-to-r from-stone-100 to-stone-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
              <span className="relative z-10 group-hover:scale-105 transition-transform duration-300 inline-block">
              Features
              </span>
              <span className="absolute -bottom-0.5 left-2 w-0 h-0.5 bg-gradient-to-r from-stone-600 to-stone-800 transition-all duration-500 group-hover:w-4/5 rounded-full"></span>
                </a>
                <a href="#pricing" className="text-sm lg:text-base text-stone-600 hover:text-stone-900 transition-all duration-300 font-medium relative group py-1.5 px-2 rounded-lg">
              <span className="absolute inset-0 bg-gradient-to-r from-stone-100 to-stone-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
              <span className="relative z-10 group-hover:scale-105 transition-transform duration-300 inline-block">
              Pricing
              </span>
              <span className="absolute -bottom-0.5 left-2 w-0 h-0.5 bg-gradient-to-r from-stone-600 to-stone-800 transition-all duration-500 group-hover:w-4/5 rounded-full"></span>
                </a>
                <a href="#about" className="text-sm lg:text-base text-stone-600 hover:text-stone-900 transition-all duration-300 font-medium relative group py-1.5 px-2 rounded-lg">
              <span className="absolute inset-0 bg-gradient-to-r from-stone-100 to-stone-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
              <span className="relative z-10 group-hover:scale-105 transition-transform duration-300 inline-block">
              About
              </span>
              <span className="absolute -bottom-0.5 left-2 w-0 h-0.5 bg-gradient-to-r from-stone-600 to-stone-800 transition-all duration-500 group-hover:w-4/5 rounded-full"></span>
                </a>
              </>
            ) : null}
            
            {user ? (
              <Link to="/dashboard" className="bg-gradient-to-r from-stone-600 to-stone-700 text-white px-4 lg:px-5 py-1.5 lg:py-2 rounded-lg hover:from-stone-700 hover:to-stone-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-stone-500/25 font-medium flex items-center group relative overflow-hidden text-sm lg:text-base">
              <span className="absolute inset-0 bg-gradient-to-r from-stone-500 to-stone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                Dashboard
              </span>
              <ArrowRight className="ml-1.5 lg:ml-2 w-3.5 lg:w-4 h-3.5 lg:h-4 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300 relative z-10" />
              </Link>
            ) : (
              <Link to="/signup" className="bg-gradient-to-r from-stone-600 to-stone-700 text-white px-4 lg:px-5 py-1.5 lg:py-2 rounded-lg hover:from-stone-700 hover:to-stone-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-stone-500/25 font-medium flex items-center group relative overflow-hidden text-sm lg:text-base">
                <span className="absolute inset-0 bg-gradient-to-r from-stone-500 to-stone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                  Start Free Trial
                </span>
                <ArrowRight className="ml-1.5 lg:ml-2 w-3.5 lg:w-4 h-3.5 lg:h-4 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300 relative z-10" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-600 hover:text-stone-900 p-1.5 rounded-lg hover:bg-stone-100 transition-all duration-300 transform hover:scale-110"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-xl border-t border-stone-100 rounded-b-lg shadow-lg">
              {location.pathname === '/' ? (
                <>
              <a 
                href="#features" 
                className="block px-3 py-2 text-base text-stone-600 hover:text-stone-900 hover:bg-gradient-to-r hover:from-stone-50 hover:to-stone-100 rounded-lg transition-all duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="block px-3 py-2 text-base text-stone-600 hover:text-stone-900 hover:bg-gradient-to-r hover:from-stone-50 hover:to-stone-100 rounded-lg transition-all duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#about" 
                className="block px-3 py-2 text-base text-stone-600 hover:text-stone-900 hover:bg-gradient-to-r hover:from-stone-50 hover:to-stone-100 rounded-lg transition-all duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
                </>
              ) : null}
              
              {user ? (
                <Link
                  to="/dashboard"
                className="w-full mt-2 bg-gradient-to-r from-stone-600 to-stone-700 text-white px-4 py-2.5 rounded-lg hover:from-stone-700 hover:to-stone-800 transition-all duration-300 font-medium flex items-center justify-center group relative overflow-hidden"
                onClick={() => setIsOpen(false)}
                >
                <span className="absolute inset-0 bg-gradient-to-r from-stone-500 to-stone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">
                    Dashboard
                </span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="w-full mt-2 bg-gradient-to-r from-stone-600 to-stone-700 text-white px-4 py-2.5 rounded-lg hover:from-stone-700 hover:to-stone-800 transition-all duration-300 font-medium flex items-center justify-center group relative overflow-hidden"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-stone-500 to-stone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10">
                    Start Free Trial
                  </span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;