import { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import airmailstamp from '../assets/images/airmailstamp.svg';
import postboxstamp from '../assets/images/postboxstamp.svg';
import OverlappingCircles from '../components/OverlappingCircles';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export const LandingLayout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-landing-bg">
      <div className="noise-overlay" />
      <div className="worn-overlay" />
      
      {/* Stamps Container - increased sizes */}
      <div className="absolute top-8 right-8 flex flex-col gap-4 z-20">
        <img 
          src={postboxstamp} 
          alt="Post Box Stamp" 
          className="w-24 md:w-32" // Responsive size
        />
        <img 
          src={airmailstamp} 
          alt="Air Mail Stamp" 
          className="w-24 md:w-32" // Responsive size
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-grow flex flex-col">
        {children}
        <div className="flex-grow flex items-center justify-center">
          <OverlappingCircles />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export const PageLayout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (direction: 'left' | 'right') => {
    const paths = ['/', '/career', '/hacking', '/about'];
    const currentIndex = paths.indexOf(location.pathname);
    if (direction === 'left' && currentIndex > 0) {
      navigate(paths[currentIndex - 1]);
    } else if (direction === 'right' && currentIndex < paths.length - 1) {
      navigate(paths[currentIndex + 1]);
    }
  };

  const getLinkNames = () => {
    const paths = ['/', '/career', '/hacking', '/about'];
    const currentIndex = paths.indexOf(location.pathname);
    const leftLink = currentIndex > 0 ? paths[currentIndex - 1] : '';
    const rightLink = currentIndex < paths.length - 1 ? paths[currentIndex + 1] : '';
    return {
      left: leftLink === '/' ? 'Home' : leftLink.charAt(1).toUpperCase() + leftLink.slice(2),
      right: rightLink ? rightLink.charAt(1).toUpperCase() + rightLink.slice(2) : '',
    };
  };

  const { left, right } = getLinkNames();

  return (
    <div className="relative min-h-screen flex flex-col bg-universal-bg font-eb-garamond">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center p-2 text-lg text-secondary-text">
        {left && (
          <button onClick={() => handleNavigation('left')} className="hover:underline">
            &larr; {left}
          </button>
        )}
        {right && (
          <button onClick={() => handleNavigation('right')} className="hover:underline">
            {right} &rarr;
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-grow relative z-10 px-4 py-2 mt-12 md:px-8 md:py-2">
        {children}
      </div>

      <Footer />
    </div>
  );
};