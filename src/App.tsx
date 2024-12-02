// src/App.tsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { LandingLayout, PageLayout } from "./layouts/Layouts";
import Home from "./pages/Home";
import Career from "./pages/Career";
import Hacking from "./pages/Hacking";
import About from "./pages/About";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Scroll to top on location change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Use LandingLayout only for home page
  if (location.pathname === "/") {
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
          <Route path="/about" element={<About />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
