"use client";

import { useEffect, useState } from "react";
import styles from "./Navigation.module.css";

type NavigationProps = {
  sections: string[];
};

const Navigation: React.FC<NavigationProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollBottom = window.scrollY + windowHeight;

      // If we're at the bottom of the page, activate the last section
      if (scrollBottom >= documentHeight - 50) {
        const lastSection = sections[sections.length - 1];
        if (activeSection !== lastSection) {
          setActiveSection(lastSection);
        }
        return;
      }

      // Find which section is currently in view
      let foundSection = false;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        const elementBottom = elementTop + rect.height;

        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          if (activeSection !== sectionId) {
            setActiveSection(sectionId);
          }
          foundSection = true;
          break;
        }
      }

      // If no section found and we're scrolled past the first section,
      // try to find the closest section above current scroll position
      if (!foundSection) {
        for (let i = sections.length - 1; i >= 0; i--) {
          const sectionId = sections[i];
          const element = document.getElementById(sectionId);
          if (!element) continue;

          const rect = element.getBoundingClientRect();
          const elementTop = window.scrollY + rect.top;

          if (scrollPosition >= elementTop) {
            if (activeSection !== sectionId) {
              setActiveSection(sectionId);
            }
            break;
          }
        }
      }
    };

    // Set initial active section
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

    window.addEventListener('scroll', scrollListener, { passive: true });

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [sections, activeSection]);

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
        {sections.map((section, index) => {
          const sectionName = formatSectionName(section);
          const isActive = activeSection === section;
          return (
            <button
              key={section}
              onClick={() => handleClick(section)}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              aria-label={`Navigate to ${sectionName}`}
            >
              <span className={styles.bracket}>[</span>
              <span className={styles.indicator}>{isActive ? 'x' : ' '}</span>
              <span className={styles.bracket}>]</span>
              <span className={styles.navLabel}>{sectionName}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
