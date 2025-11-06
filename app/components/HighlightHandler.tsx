"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function HighlightHandler() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');

  useEffect(() => {
    if (!highlightId) return;

    const loadAndHighlight = async () => {
      try {
        // Fetch the share data
        const response = await fetch(`/api/share/${highlightId}`);
        if (!response.ok) return;

        const shareData = await response.json();
        const targetText = shareData.text;

        // Wait for content to be rendered
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find the text in the article content
        const articleContent = document.querySelector('[class*="content"]');
        if (!articleContent) return;

        const walker = document.createTreeWalker(
          articleContent,
          NodeFilter.SHOW_TEXT,
          null
        );

        let node;
        let foundNode = null;
        let foundOffset = 0;

        while ((node = walker.nextNode())) {
          const text = node.textContent || '';
          const index = text.indexOf(targetText);

          if (index !== -1) {
            foundNode = node;
            foundOffset = index;
            break;
          }
        }

        if (foundNode && foundNode.parentElement) {
          // Create a highlight wrapper
          const range = document.createRange();
          range.setStart(foundNode, foundOffset);
          range.setEnd(foundNode, foundOffset + targetText.length);

          const highlightSpan = document.createElement('mark');
          highlightSpan.style.backgroundColor = '#e9d5ff';
          highlightSpan.style.padding = '2px 4px';
          highlightSpan.style.borderRadius = '2px';
          highlightSpan.style.transition = 'background-color 0.3s ease';

          range.surroundContents(highlightSpan);

          // Scroll to the highlighted text
          highlightSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Flash the highlight
          setTimeout(() => {
            highlightSpan.style.backgroundColor = '#fef08a';
          }, 500);
          setTimeout(() => {
            highlightSpan.style.backgroundColor = '#e9d5ff';
          }, 1000);
        }
      } catch (error) {
        console.error('Error highlighting text:', error);
      }
    };

    loadAndHighlight();
  }, [highlightId]);

  return null;
}
