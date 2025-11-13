"use client";

import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // First check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

    // Then check the data-theme attribute
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;

    // Determine the correct theme to use
    const themeToUse = savedTheme || currentTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Ensure both localStorage and data-theme are set correctly
    if (themeToUse) {
      setTheme(themeToUse);
      document.documentElement.setAttribute('data-theme', themeToUse);
      localStorage.setItem('theme', themeToUse);
    }
  }, []);

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) {
    return <div className={styles.toggle}></div>;
  }

  return (
    <div className={styles.toggle}>
      <button
        onClick={() => toggleTheme('light')}
        className={theme === 'light' ? styles.active : styles.inactive}
      >
        light
      </button>
      <span className={styles.separator}>/</span>
      <button
        onClick={() => toggleTheme('dark')}
        className={theme === 'dark' ? styles.active : styles.inactive}
      >
        dark
      </button>
    </div>
  );
}
