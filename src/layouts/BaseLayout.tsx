import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-paper bg-noise">
      {/* Paper texture container */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Navigation */}
        <nav className="mb-8 flex justify-between items-center">
          <div className="space-x-4">
            <Link 
              to="/" 
              className={`text-ink hover:opacity-70 ${
                location.pathname === '/' ? 'underline' : ''
              }`}
            >
              home
            </Link>
            <Link 
              to="/career" 
              className={`text-ink hover:opacity-70 ${
                location.pathname === '/career' ? 'underline' : ''
              }`}
            >
              career
            </Link>
            <Link 
              to="/hacking" 
              className={`text-ink hover:opacity-70 ${
                location.pathname === '/hacking' ? 'underline' : ''
              }`}
            >
              hacking
            </Link>
          </div>
          <div>
            {/* Airmail stamp - we'll add this as an SVG component later */}
            <div className="w-24 h-16 bg-paper-torn bg-right-top bg-no-repeat"></div>
          </div>
        </nav>

        {/* Main content */}
        <main className="relative">
          {/* Paper torn effect at the top */}
          <div className="absolute top-0 left-0 w-full h-8 bg-paper-torn bg-repeat-x"></div>
          
          {/* Content */}
          <div className="pt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;