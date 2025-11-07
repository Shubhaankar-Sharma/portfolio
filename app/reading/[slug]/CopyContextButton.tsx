"use client";

import { useState } from 'react';
import styles from './CopyContextButton.module.css';

type CopyContextButtonProps = {
  articleContent: string;
  articleTitle: string;
};

export default function CopyContextButton({ articleContent, articleTitle }: CopyContextButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyContext = async () => {
    const context = `Title: ${articleTitle}\n\n${articleContent}`;

    try {
      await navigator.clipboard.writeText(context);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleCopyContext}
      className={styles.copyTrigger}
    >
      {copied ? 'Copied!' : 'Copy Context'}
    </button>
  );
}
