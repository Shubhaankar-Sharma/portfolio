"use client";

import { useEffect, useState } from "react";
import styles from "./ArticleNavigation.module.css";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type ArticleNavigationProps = {
  headings: Heading[];
};

const ArticleNavigation: React.FC<ArticleNavigationProps> = ({ headings }) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;

    let lastUpdate = 0;
    const UPDATE_INTERVAL = 100;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastUpdate < UPDATE_INTERVAL) return;
      lastUpdate = now;

      const scrollPosition = window.scrollY + 100; // Offset for better UX

      // Only show navigation when scrolled past hero section
      const heroHeight = 600;
      setIsVisible(window.scrollY > heroHeight);

      // Find the current active heading
      let currentHeading = headings[0]?.id || "";

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;

          if (scrollPosition >= elementTop) {
            currentHeading = heading.id;
          }
        }
      }

      setActiveSection(currentHeading);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className={`${styles.navigation} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.navItems}>
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={`${styles.navItem} ${
              activeSection === heading.id ? styles.active : ""
            } ${heading.level === 2 ? styles.subheading : ""}`}
            aria-label={`Navigate to ${heading.text}`}
          >
            <span className={styles.navLabel}>{heading.text}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default ArticleNavigation;
