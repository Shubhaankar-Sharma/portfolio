"use client";

import { useEffect, useState } from "react";
import styles from "./articleNav.module.css";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type ArticleNavProps = {
  headings: Heading[];
};

const ArticleNav: React.FC<ArticleNavProps> = ({ headings }) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [readSections, setReadSections] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`article-progress-${window.location.pathname}`);
      if (stored) {
        try {
          setReadSections(new Set(JSON.parse(stored)));
        } catch (e) {
          // Ignore parsing errors
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever readSections changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded && readSections.size > 0) {
      localStorage.setItem(
        `article-progress-${window.location.pathname}`,
        JSON.stringify([...readSections])
      );
    }
  }, [readSections, isLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      const newReadSections = new Set<string>();
      let currentSectionId = "";

      // Check all sections and mark those that have been scrolled past
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const element = document.getElementById(heading.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        const elementBottom = elementTop + rect.height;

        // Mark as read if we've scrolled past it
        if (scrollPosition >= elementTop) {
          newReadSections.add(heading.id);
        }

        // Check if this is the current section
        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          currentSectionId = heading.id;
        }
      }

      // Use batch updates to reduce re-renders
      if (currentSectionId !== activeSection ||
          newReadSections.size !== readSections.size ||
          ![...newReadSections].every(id => readSections.has(id))) {

        if (currentSectionId !== activeSection) {
          setActiveSection(currentSectionId);
        }

        if (newReadSections.size !== readSections.size ||
            ![...newReadSections].every(id => readSections.has(id))) {
          setReadSections(newReadSections);
        }
      }
    };

    // Set initial state
    handleScroll();

    // Add scroll listener with throttling
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [headings, activeSection, readSections]);

  const handleClick = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.navItems}>
        {headings.map((heading) => {
          const isRead = readSections.has(heading.id);
          return (
            <button
              key={heading.id}
              onClick={() => handleClick(heading.id)}
              className={`${styles.navItem} ${
                activeSection === heading.id ? styles.active : ""
              }`}
              aria-label={`Navigate to ${heading.text}`}
            >
              <span className={styles.bracket}>[</span>
              <span className={styles.indicator}>{isRead ? "x" : " "}</span>
              <span className={styles.bracket}>]</span>
              <span className={styles.navLabel}>{heading.text}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default ArticleNav;
