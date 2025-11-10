"use client";

import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read the theme that was already set by the blocking script
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
    if (currentTheme) {
      setTheme(currentTheme);
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
