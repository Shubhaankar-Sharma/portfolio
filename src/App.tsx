// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LandingLayout, PageLayout } from './layouts/Layouts';
import Home from './pages/Home';
import Career from './pages/Career';
import Hacking from './pages/Hacking';

// Wrapper component to choose layout based on route
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Use LandingLayout only for home page
  if (location.pathname === '/') {
    return <LandingLayout>{children}</LandingLayout>;
  }
  
  // Use PageLayout for all other pages
  return <PageLayout>{children}</PageLayout>;
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/career" element={<Career />} />
          <Route path="/hacking" element={<Hacking />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;