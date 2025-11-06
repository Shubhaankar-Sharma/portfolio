"use client";

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './AnnotationHandler.module.css';

type Annotation = {
  id: number;
  highlightedText: string | null;
  commentText: string;
  startOffset: number | null;
  endOffset: number | null;
  color: string;
  authorName: string | null;
  createdAt: string;
};

const COLORS = [
  { name: 'yellow', label: 'Yellow', value: '#fef08a' },
  { name: 'blue', label: 'Blue', value: '#bfdbfe' },
  { name: 'green', label: 'Green', value: '#bbf7d0' },
  { name: 'purple', label: 'Purple', value: '#e9d5ff' },
  { name: 'pink', label: 'Pink', value: '#fbcfe8' },
];

export default function AnnotationHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const articleSlug = pathname?.split('/').pop() || '';
  const shareId = searchParams?.get('shareid');

  // Load annotations from database
  useEffect(() => {
    if (!articleSlug) return;

    const loadAnnotations = async () => {
      try {
        const response = await fetch(`/api/comments?articleSlug=${articleSlug}`);
        if (response.ok) {
          const data = await response.json();
          setAnnotations(data);
        }
      } catch (error) {
        console.error('Error loading annotations:', error);
      }
    };

    loadAnnotations();
  }, [articleSlug]);

  // Handle shared text highlighting
  useEffect(() => {
    if (!shareId) return;

    const loadAndHighlightShare = async () => {
      try {
        const response = await fetch(`/api/share/${shareId}`);
        if (!response.ok) return;

        const shareData = await response.json();
        const targetText = shareData.text;

        // Wait for content to be rendered
        await new Promise(resolve => setTimeout(resolve, 1000));

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
          highlightSpan.style.backgroundColor = '#fef08a';
          highlightSpan.style.padding = '2px 4px';
          highlightSpan.style.borderRadius = '2px';
          highlightSpan.style.transition = 'background-color 0.3s ease';

          range.surroundContents(highlightSpan);

          // Scroll to the highlighted text
          highlightSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Flash the highlight
          setTimeout(() => {
            highlightSpan.style.backgroundColor = '#fef08a';
          }, 300);
          setTimeout(() => {
            highlightSpan.style.backgroundColor = '#e9d5ff';
          }, 800);
          setTimeout(() => {
            highlightSpan.style.backgroundColor = '#fef08a';
          }, 1300);
        }
      } catch (error) {
        console.error('Error highlighting shared text:', error);
      }
    };

    loadAndHighlightShare();
  }, [shareId]);

  // Apply highlights from database
  useEffect(() => {
    if (annotations.length === 0) return;

    const applyHighlights = () => {
      const articleContent = document.querySelector('[class*="content"]');
      if (!articleContent) return;

      annotations.forEach((annotation) => {
        if (!annotation.highlightedText || !annotation.startOffset || !annotation.endOffset) return;

        const walker = document.createTreeWalker(
          articleContent,
          NodeFilter.SHOW_TEXT,
          null
        );

        let currentOffset = 0;
        let node;

        while ((node = walker.nextNode())) {
          const text = node.textContent || '';
          const nodeLength = text.length;

          if (
            currentOffset + nodeLength > annotation.startOffset &&
            currentOffset < annotation.endOffset
          ) {
            const startInNode = Math.max(0, annotation.startOffset - currentOffset);
            const endInNode = Math.min(nodeLength, annotation.endOffset - currentOffset);

            try {
              const range = document.createRange();
              range.setStart(node, startInNode);
              range.setEnd(node, endInNode);

              const mark = document.createElement('mark');
              mark.className = styles.highlight;
              mark.setAttribute('data-annotation-id', annotation.id.toString());
              mark.style.backgroundColor = COLORS.find(c => c.name === annotation.color)?.value || '#fef08a';
              mark.style.cursor = 'pointer';
              mark.title = annotation.commentText;

              mark.addEventListener('click', () => {
                alert(`${annotation.authorName || 'Anonymous'}: ${annotation.commentText}`);
              });

              range.surroundContents(mark);
            } catch (e) {
              // Skip if range cannot be applied
              console.warn('Could not apply highlight:', e);
            }
          }

          currentOffset += nodeLength;
        }
      });
    };

    // Wait for content to render
    const timer = setTimeout(applyHighlights, 500);
    return () => clearTimeout(timer);
  }, [annotations]);

  // Handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      // Don't close if clicking inside our popup
      if (popupRef.current?.contains(document.activeElement)) {
        return;
      }

      if (text && text.length > 0) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setSelectedText(text);
          setSelectedRange(range.cloneRange());
          setPopupPosition({
            x: rect.left + rect.width / 2 + 40, // Offset to the right
            y: rect.top - 10,
          });
          setShowPopup(true);
          setShowCommentForm(false);
        }
      } else {
        // Only close if not clicking inside the form
        if (!popupRef.current?.contains(document.activeElement) && !showCommentForm) {
          setShowPopup(false);
          setShowCommentForm(false);
        }
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [showCommentForm]);

  const handleAnnotate = () => {
    setShowCommentForm(true);
  };

  const handleSubmitAnnotation = async () => {
    if (!commentText.trim() || !selectedRange) return;

    setIsSubmitting(true);

    try {
      // Calculate offsets
      const articleContent = document.querySelector('[class*="content"]');
      if (!articleContent) return;

      let startOffset = 0;
      let endOffset = 0;
      let found = false;

      const walker = document.createTreeWalker(
        articleContent,
        NodeFilter.SHOW_TEXT,
        null
      );

      let currentOffset = 0;
      let node;

      while ((node = walker.nextNode())) {
        const text = node.textContent || '';
        const textIndex = text.indexOf(selectedText);

        if (textIndex !== -1 && !found) {
          startOffset = currentOffset + textIndex;
          endOffset = startOffset + selectedText.length;
          found = true;
          break;
        }

        currentOffset += text.length;
      }

      // Submit annotation
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleSlug,
          highlightedText: selectedText,
          commentText: commentText.trim(),
          startOffset,
          endOffset,
          color: selectedColor,
          authorName: authorName.trim() || null,
        }),
      });

      if (response.ok) {
        const newAnnotation = await response.json();
        setAnnotations([...annotations, newAnnotation]);

        // Reset form
        setCommentText('');
        setAuthorName('');
        setShowPopup(false);
        setShowCommentForm(false);
        window.getSelection()?.removeAllRanges();
      }
    } catch (error) {
      console.error('Error submitting annotation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showPopup) return null;

  return (
    <div
      ref={popupRef}
      className={styles.popup}
      style={{
        left: `${popupPosition.x}px`,
        top: `${popupPosition.y}px`,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {!showCommentForm ? (
        <button onClick={handleAnnotate} className={styles.annotateButton}>
          Add annotation
        </button>
      ) : (
        <div className={styles.commentForm}>
          <div className={styles.colorPicker}>
            {COLORS.map((color) => (
              <button
                key={color.name}
                className={`${styles.colorButton} ${selectedColor === color.name ? styles.selected : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => setSelectedColor(color.name)}
                title={color.label}
              />
            ))}
          </div>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className={styles.input}
          />
          <textarea
            placeholder="Add your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className={styles.textarea}
            rows={3}
          />
          <div className={styles.actions}>
            <button
              onClick={() => {
                setShowCommentForm(false);
                setShowPopup(false);
              }}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitAnnotation}
              disabled={!commentText.trim() || isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
