"use client";

import { useEffect, useState } from "react";
import styles from "./Navigation.module.css";

type NavigationProps = {
  sections: string[];
};

const Navigation: React.FC<NavigationProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    let isScrolling: NodeJS.Timeout;
    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Update the visible sections map
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        // Clear previous debounce
        clearTimeout(isScrolling);

        // Debounce to prevent rapid switching
        isScrolling = setTimeout(() => {
          if (visibleSections.size === 0) return;

          // Find the section with highest intersection ratio
          let maxRatio = 0;
          let bestSection = "";

          visibleSections.forEach((ratio, sectionId) => {
            if (ratio > maxRatio) {
              maxRatio = ratio;
              bestSection = sectionId;
            }
          });

          if (bestSection) {
            setActiveSection(bestSection);
          }
        }, 50); // 50ms debounce
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      clearTimeout(isScrolling);
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
