'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import styles from './ArtifactRenderer.module.css';

type ArtifactRendererProps = {
  type: string;
  content: string;
};

export default function ArtifactRenderer({ type, content }: ArtifactRendererProps) {
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === 'diagram' && diagramRef.current) {
      mermaid.initialize({ startOnLoad: false, theme: 'dark' });
      const renderDiagram = async () => {
        try {
          const { svg } = await mermaid.render(`mermaid-${Date.now()}`, content);
          if (diagramRef.current) {
            diagramRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      };
      renderDiagram();
    }
  }, [type, content]);

  if (type === 'diagram') {
    return (
      <div className={styles.artifact}>
        <div ref={diagramRef} className={styles.diagram} />
      </div>
    );
  }

  if (type === 'code') {
    const language = content.split('\n')[0] || 'javascript';
    const code = content.split('\n').slice(1).join('\n');

    return (
      <div className={styles.artifact}>
        <pre className={styles.codeBlock}>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  if (type === 'comparison') {
    const parts = content.split('---');
    return (
      <div className={styles.artifact}>
        <div className={styles.comparison}>
          {parts.map((part, idx) => (
            <div key={idx} className={styles.comparisonItem}>
              {part.trim()}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
