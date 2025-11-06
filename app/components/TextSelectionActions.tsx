"use client";

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import styles from './TextSelectionActions.module.css';

type Annotation = {
  id: number;
  highlightedText: string | null;
  commentText: string;
  startOffset: number | null;
  endOffset: number | null;
  color: string;
  authorName: string | null;
  createdAt: string;
  articleSlug: string;
};

const COLORS = [
  { name: 'yellow', label: 'Yellow', value: '#eab308' },
  { name: 'blue', label: 'Blue', value: '#3b82f6' },
  { name: 'green', label: 'Green', value: '#10b981' },
  { name: 'purple', label: 'Purple', value: '#a855f7' },
  { name: 'pink', label: 'Pink', value: '#ec4899' },
];

type TextSelectionActionsProps = {
  initialAnnotations?: Annotation[];
};

export default function TextSelectionActions({ initialAnnotations = [] }: TextSelectionActionsProps) {
  const pathname = usePathname();
  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const [selectionOffsets, setSelectionOffsets] = useState<{ start: number; end: number } | null>(null);
  const [mode, setMode] = useState<'buttons' | 'share' | 'annotate'>('buttons');
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const highlightMarkRef = useRef<HTMLElement | null>(null);

  const articleSlug = pathname?.split('/').pop() || '';

  // Handle text selection
  useEffect(() => {
    const handleSelection = (e: MouseEvent) => {
      // Ignore clicks on citation buttons in AI Mode
      const target = e.target as HTMLElement;
      if (target && target.closest('[class*="citation"]')) {
        return;
      }

      // Ignore selections inside AI Mode conversation
      if (target && target.closest('[class*="conversationSide"]')) {
        return;
      }

      // Ignore selections inside AI Mode in general
      if (target && target.closest('[class*="aiMode"]')) {
        return;
      }

      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (popupRef.current?.contains(document.activeElement)) {
        return;
      }

      if (text && text.length > 0) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          // Calculate offsets immediately while selection is still active using the Range
          const articleContent = document.querySelector('[class*="content"]');
          if (articleContent && range) {
            const walker = document.createTreeWalker(
              articleContent,
              NodeFilter.SHOW_TEXT,
              null
            );

            let currentOffset = 0;
            let node;
            let startOffset = -1;
            let endOffset = -1;
            const startContainer = range.startContainer;
            const endContainer = range.endContainer;

            // Walk through all text nodes to find the range boundaries
            while ((node = walker.nextNode())) {
              const nodeLength = node.textContent?.length || 0;

              // Check if this node is the start or end container, or if they're the same
              const isStartNode = node === startContainer || (node.parentNode && node.parentNode.contains(startContainer));
              const isEndNode = node === endContainer || (node.parentNode && node.parentNode.contains(endContainer));

              // If start and end are in the same node
              if (node === startContainer && node === endContainer) {
                startOffset = currentOffset + range.startOffset;
                endOffset = currentOffset + range.endOffset;
                break;
              }
              // Check if this is the start node
              else if (node === startContainer) {
                startOffset = currentOffset + range.startOffset;
              }
              // Check if this is the end node
              else if (node === endContainer) {
                endOffset = currentOffset + range.endOffset;
                break; // We found both, can stop
              }

              currentOffset += nodeLength;
            }

            // If we still couldn't find offsets, try a simpler approach
            if (startOffset === -1 || endOffset === -1) {
              // Just use the text content to find the selection
              const contentText = articleContent.textContent || '';
              const selectionText = text;
              const searchStart = contentText.indexOf(selectionText);

              if (searchStart !== -1) {
                startOffset = searchStart;
                endOffset = searchStart + selectionText.length;
              }
            }

            if (startOffset !== -1 && endOffset !== -1) {
              console.log('Calculated offsets:', { start: startOffset, end: endOffset, text });
              setSelectionOffsets({ start: startOffset, end: endOffset });

              // Create a persistent visual highlight that won't disappear when clicking
              try {
                const tempRange = range.cloneRange();
                const mark = document.createElement('mark');
                mark.className = styles.tempHighlight;
                mark.style.backgroundColor = 'rgba(234, 179, 8, 0.2)';
                mark.style.padding = '2px 0';
                mark.style.borderRadius = '2px';
                mark.setAttribute('data-temp-highlight', 'true');

                tempRange.surroundContents(mark);
                highlightMarkRef.current = mark;
              } catch (e) {
                console.warn('Could not create temp highlight:', e);
              }
            } else {
              console.error('Failed to calculate offsets', {
                startOffset,
                endOffset,
                startContainer: startContainer.nodeName,
                endContainer: endContainer.nodeName,
                text
              });
            }
          }

          setSelectedText(text);
          setSelectedRange(range.cloneRange());
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
          });
          setShowPopup(true);
          setMode('buttons');
          setCopied(false);
        }
      } else {
        if (!popupRef.current?.contains(document.activeElement) && mode === 'buttons') {
          // Clean up temp highlight if it exists
          if (highlightMarkRef.current) {
            const parent = highlightMarkRef.current.parentNode;
            if (parent) {
              const textNode = document.createTextNode(highlightMarkRef.current.textContent || '');
              parent.replaceChild(textNode, highlightMarkRef.current);
              highlightMarkRef.current = null;
            }
          }
          setShowPopup(false);
        }
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [mode]);

  const handleShare = async () => {
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedText,
          articleSlug,
          articleTitle: document.querySelector('h1')?.textContent || 'Article',
        }),
      });

      if (!response.ok) throw new Error('Failed to create share');

      const data = await response.json();
      await navigator.clipboard.writeText(data.url);

      setCopied(true);
      setTimeout(() => {
        setShowPopup(false);
        setCopied(false);
        setMode('buttons');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmitAnnotation = async () => {
    if (!commentText.trim() || !selectionOffsets) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleSlug,
          highlightedText: selectedText,
          commentText: commentText.trim(),
          startOffset: selectionOffsets.start,
          endOffset: selectionOffsets.end,
          color: selectedColor,
          authorName: authorName.trim() || null,
        }),
      });

      if (response.ok) {
        const newAnnotation = await response.json();
        setAnnotations([...annotations, newAnnotation]);

        // Remove temp highlight
        if (highlightMarkRef.current) {
          const parent = highlightMarkRef.current.parentNode;
          if (parent) {
            const textNode = document.createTextNode(highlightMarkRef.current.textContent || '');
            parent.replaceChild(textNode, highlightMarkRef.current);
            highlightMarkRef.current = null;
          }
        }

        setCommentText('');
        setAuthorName('');
        setSelectedText('');
        setSelectionOffsets(null);
        setShowPopup(false);
        setMode('buttons');
        window.getSelection()?.removeAllRanges();

        // Refresh to show new annotation
        setTimeout(() => {
          window.location.reload();
        }, 500);
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
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {mode === 'buttons' && (
        <div className={styles.buttonGroup}>
          <button onClick={handleShare} className={styles.actionButton}>
            {copied ? 'Copied!' : 'Share'}
          </button>
          <button onClick={() => setMode('annotate')} className={styles.actionButton}>
            Annotate
          </button>
        </div>
      )}

      {mode === 'annotate' && (
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
            placeholder="Twitter (@username)"
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
                // Remove temp highlight
                if (highlightMarkRef.current) {
                  const parent = highlightMarkRef.current.parentNode;
                  if (parent) {
                    const textNode = document.createTextNode(highlightMarkRef.current.textContent || '');
                    parent.replaceChild(textNode, highlightMarkRef.current);
                    highlightMarkRef.current = null;
                  }
                }

                setMode('buttons');
                setCommentText('');
                setAuthorName('');
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
