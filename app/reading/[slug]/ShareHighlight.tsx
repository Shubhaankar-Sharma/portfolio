'use client';

import { useEffect } from 'react';

type ShareHighlightProps = {
  shareText: string | null;
};

export default function ShareHighlight({ shareText }: ShareHighlightProps) {
  useEffect(() => {
    if (!shareText) return;

    const highlightAndScroll = async () => {
      // Wait longer for content to fully render (MDX, math, etc.)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const articleContent = document.querySelector('[class*="content"]');
      if (!articleContent) {
        console.error('ShareHighlight: Could not find article content');
        return;
      }

      console.log('ShareHighlight: Looking for text:', shareText);

      // Normalize the search text (collapse whitespace)
      const normalizedSearchText = shareText.trim().replace(/\s+/g, ' ');
      console.log('ShareHighlight: Normalized search text:', normalizedSearchText);

      // Get all text content and normalize it
      const fullText = articleContent.textContent || '';
      const normalizedFullText = fullText.replace(/\s+/g, ' ');

      // Find the text in the normalized content
      const index = normalizedFullText.indexOf(normalizedSearchText);

      if (index === -1) {
        console.error('ShareHighlight: Could not find the shared text in the article');
        console.log('ShareHighlight: First 500 chars of article:', normalizedFullText.substring(0, 500));
        return;
      }

      console.log('ShareHighlight: Found text at normalized index:', index);

      // Now we need to find the actual position accounting for the original whitespace
      // Walk through the original text to find the corresponding position
      let currentPos = 0;
      let normalizedPos = 0;

      // Find where our match starts in the original text
      for (let i = 0; i < fullText.length && normalizedPos < index; i++) {
        if (!/\s/.test(fullText[i]) || (i > 0 && !/\s/.test(fullText[i - 1]))) {
          normalizedPos++;
        }
        currentPos++;
      }

      const startPos = currentPos;
      const endPos = startPos + shareText.length;

      console.log('ShareHighlight: Actual positions:', { startPos, endPos });

      // Now find the text nodes that contain this range
      const walker = document.createTreeWalker(
        articleContent,
        NodeFilter.SHOW_TEXT,
        null
      );

      let offset = 0;
      let node;
      let startNode = null;
      let startOffset = 0;
      let endNode = null;
      let endOffset = 0;

      while ((node = walker.nextNode())) {
        const nodeLength = node.textContent?.length || 0;

        // Check if this node contains the start
        if (!startNode && offset + nodeLength > startPos) {
          startNode = node;
          startOffset = startPos - offset;
        }

        // Check if this node contains the end
        if (!endNode && offset + nodeLength >= endPos) {
          endNode = node;
          endOffset = endPos - offset;
          break;
        }

        offset += nodeLength;
      }

      if (startNode && endNode && startNode.parentElement && endNode.parentElement) {
        try {
          const range = document.createRange();
          range.setStart(startNode, startOffset);
          range.setEnd(endNode, endOffset);

          // Create highlight element
          const highlightSpan = document.createElement('mark');
          highlightSpan.style.backgroundColor = 'rgba(234, 179, 8, 0.4)';
          highlightSpan.style.padding = '2px 4px';
          highlightSpan.style.borderRadius = '2px';
          highlightSpan.style.transition = 'background-color 0.3s ease';
          highlightSpan.setAttribute('data-share-highlight', 'true');

          range.surroundContents(highlightSpan);

          console.log('ShareHighlight: Scrolling to highlight');

          // Wait a bit more to ensure everything is laid out
          setTimeout(() => {
            highlightSpan.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }, 200);

          // Pulse animation
          setTimeout(() => {
            highlightSpan.style.backgroundColor = 'rgba(234, 179, 8, 0.4)';
          }, 500);
          setTimeout(() => {
            highlightSpan.style.backgroundColor = 'rgba(168, 85, 247, 0.4)';
          }, 1000);
          setTimeout(() => {
            highlightSpan.style.backgroundColor = 'rgba(234, 179, 8, 0.4)';
          }, 1500);
        } catch (error) {
          console.error('ShareHighlight: Error highlighting shared text:', error);
          // Fallback: just scroll to the first found text
          if (startNode.parentElement) {
            startNode.parentElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }
      } else {
        console.error('ShareHighlight: Could not find text nodes for range');
      }
    };

    highlightAndScroll();
  }, [shareText]);

  return null;
}
