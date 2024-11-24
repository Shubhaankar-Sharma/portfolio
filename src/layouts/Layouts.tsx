// src/layouts/LandingLayout.tsx
import { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import airmailstamp from '../assets/images/airmailstamp.svg';
import postboxstamp from '../assets/images/postboxstamp.svg';
import OverlappingCircles from '../components/OverlappingCircles';

interface LayoutProps {
  children: ReactNode;
}

export const LandingLayout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen bg-landing-bg">
      <div className="noise-overlay" />
      <div className="worn-overlay" />
      
      {/* Stamps Container - increased sizes */}
      <div className="absolute top-8 right-8 flex flex-col gap-4 z-20">
        <img 
          src={postboxstamp} 
          alt="Post Box Stamp" 
          className="w-32" // Increased from w-24
        />
        <img 
          src={airmailstamp} 
          alt="Air Mail Stamp" 
          className="w-32" // Increased from w-24
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
        <div className="flex-grow flex items-center justify-center">
          <OverlappingCircles />
        </div>
      </div>

      
      <Footer />
    </div>
  );
};
// src/layouts/PageLayout.tsx
export const PageLayout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen bg-universal-bg">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Main content */}
      <div className="relative z-10 px-8 py-12 min-h-screen">
        {children}
      </div>

      {/* Navigation */}
      <Footer />
    </div>
  );
};