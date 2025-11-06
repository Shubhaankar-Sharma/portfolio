"use client";

import { useEffect, useState, useRef } from 'react';
import styles from './TextSelectionShare.module.css';

export default function TextSelectionShare() {
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      // Don't close if clicking inside our popup
      if (popupRef.current?.contains(document.activeElement)) {
        return;
      }

      if (text && text.length > 0) {
        setSelectedText(text);
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setPosition({
            x: rect.left + rect.width / 2 - 40, // Offset to the left
            y: rect.top - 10,
          });
          setShowPopup(true);
          setCopied(false);
        }
      } else {
        setShowPopup(false);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
    };
  }, []);

  const handleShare = async () => {
    try {
      // Extract article slug from URL
      const pathParts = window.location.pathname.split('/');
      const articleSlug = pathParts[pathParts.length - 1];
      const articleTitle = document.querySelector('h1')?.textContent || 'Article';

      // Create share via API
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedText,
          articleSlug,
          articleTitle,
        }),
      });

      if (!response.ok) throw new Error('Failed to create share');

      const data = await response.json();
      await navigator.clipboard.writeText(data.url);

      setCopied(true);
      setTimeout(() => {
        setShowPopup(false);
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!showPopup) return null;

  return (
    <div
      ref={popupRef}
      className={styles.popup}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button onClick={handleShare} className={styles.shareButton}>
        {copied ? 'Copied!' : 'Share'}
      </button>
    </div>
  );
}
