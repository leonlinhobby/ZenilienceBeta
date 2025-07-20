import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import Hero from './Hero';
import Features from './Features';
import SocialProof from './SocialProof';
import Pricing from './Pricing';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <SocialProof />
      <Pricing />
      <Footer />
    </div>
  );
};

export default LandingPage;