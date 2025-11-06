"use client";

import { useEffect, useState } from "react";
import styles from "./Navigation.module.css";

type NavigationProps = {
  sections: string[];
};

const Navigation: React.FC<NavigationProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    let lastUpdate = 0;
    const UPDATE_INTERVAL = 100; // Only update every 100ms

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        if (now - lastUpdate < UPDATE_INTERVAL) {
          return; // Skip this update if too soon
        }
        lastUpdate = now;

        // Find the most visible section
        let maxRatio = 0;
        let bestSection = "";

        // Query all sections to get their current intersection state
        sections.forEach((sectionId) => {
          const element = document.getElementById(sectionId);
          if (!element) return;

          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          // Calculate how much of the section is visible
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(viewportHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const ratio = visibleHeight / rect.height;

          if (ratio > maxRatio && ratio > 0) {
            maxRatio = ratio;
            bestSection = sectionId;
          }
        });

        if (bestSection && bestSection !== activeSection) {
          setActiveSection(bestSection);
        }
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: "0px",
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [sections]);

  const handleClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const formatSectionName = (section: string) => {
    return section
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.navItems}>
        {sections.map((section) => {
          const sectionName = formatSectionName(section);
          return (
            <button
              key={section}
              onClick={() => handleClick(section)}
              className={`${styles.navItem} ${
                activeSection === section ? styles.active : ""
              }`}
              aria-label={`Navigate to ${sectionName}`}
              data-section={sectionName}
            >
              <span className={styles.navDot}></span>
              <span className={styles.navLabel}>
                {sectionName}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
