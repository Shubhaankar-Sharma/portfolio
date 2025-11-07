'use client';

import { useEffect } from 'react';
import styles from './AnnotationsList.module.css';

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

type AnnotationGroup = {
  annotations: Annotation[];
  top: number;
  marks: HTMLElement[];
};

const COLORS = [
  { name: 'yellow', value: '#eab308' },
  { name: 'blue', value: '#3b82f6' },
  { name: 'green', value: '#10b981' },
  { name: 'purple', value: '#a855f7' },
  { name: 'pink', value: '#ec4899' },
];

export default function AnnotationsList({ annotations }: { annotations: Annotation[] }) {
  useEffect(() => {
    if (annotations.length === 0) return;

    // Helper to format author name as link if it's a Twitter handle
    const formatAuthor = (authorName: string | null) => {
      const name = authorName || 'Anonymous';
      if (name.startsWith('@')) {
        const handle = name.slice(1);
        return `<a href="https://twitter.com/${handle}" target="_blank" rel="noopener noreferrer" class="${styles.author}" onclick="event.stopPropagation()">${name}</a>`;
      }
      return `<span class="${styles.author}">${name}</span>`;
    };

    const applyHighlights = () => {
      const articleContent = document.querySelector('[class*="content"]');
      if (!articleContent) return;

      // Remove existing highlights and markers
      document.querySelectorAll('[data-annotation-marker]').forEach(el => el.remove());
      document.querySelectorAll('[data-annotation-id]').forEach(el => {
        const parent = el.parentNode;
        if (parent) {
          const textNode = document.createTextNode(el.textContent || '');
          parent.replaceChild(textNode, el);
        }
      });

      // First pass: create all highlights and collect positions
      const annotationData: Array<{
        annotation: Annotation;
        mark: HTMLElement;
        top: number;
      }> = [];

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
              const color = COLORS.find(c => c.name === annotation.color);
              mark.style.backgroundColor = 'transparent';
              mark.style.borderBottom = `2px dotted ${color?.value || '#eab308'}`;
              mark.style.cursor = 'pointer';

              range.surroundContents(mark);

              const rect = mark.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

              annotationData.push({
                annotation,
                mark,
                top: rect.top + scrollTop,
              });

            } catch (e) {
              console.warn('Could not apply highlight:', e);
            }
            break;
          }

          currentOffset += nodeLength;
        }
      });

      // Second pass: group nearby annotations (within 80px vertically)
      const GROUPING_THRESHOLD = 80;
      const groups: AnnotationGroup[] = [];

      annotationData
        .sort((a, b) => a.top - b.top)
        .forEach(({ annotation, mark, top }) => {
          const existingGroup = groups.find(
            g => Math.abs(g.top - top) < GROUPING_THRESHOLD
          );

          if (existingGroup) {
            existingGroup.annotations.push(annotation);
            existingGroup.marks.push(mark);
            existingGroup.top = existingGroup.marks.reduce((sum, m) => {
              const rect = m.getBoundingClientRect();
              return sum + rect.top + (window.pageYOffset || document.documentElement.scrollTop);
            }, 0) / existingGroup.marks.length;
          } else {
            groups.push({
              annotations: [annotation],
              marks: [mark],
              top,
            });
          }
        });

      // Third pass: create markers - positioned in a fixed container
      const container = document.createElement('div');
      container.className = styles.annotationsContainer;
      container.setAttribute('data-annotation-marker', 'true');
      document.body.appendChild(container);

      // Function to reposition all groups based on their actual heights
      const repositionGroups = () => {
        const allMarkers = Array.from(container.querySelectorAll('[data-group-index]')) as HTMLElement[];
        let cumulativeTop = 0;

        allMarkers.forEach((marker, idx) => {
          const groupIdx = parseInt(marker.getAttribute('data-group-index') || '0');
          const group = groups[groupIdx];

          if (idx === 0) {
            // First group uses its original position
            marker.style.top = `${group.top}px`;
            cumulativeTop = group.top + marker.offsetHeight + 12; // 12px gap
          } else {
            // Subsequent groups check if they would overlap
            const desiredTop = group.top;
            const actualTop = Math.max(desiredTop, cumulativeTop);
            marker.style.top = `${actualTop}px`;
            cumulativeTop = actualTop + marker.offsetHeight + 12;
          }
        });
      };

      groups.forEach((group, groupIndex) => {
        const marker = document.createElement('div');
        marker.className = styles.annotationMarker;
        marker.setAttribute('data-group-index', groupIndex.toString());
        marker.setAttribute('data-expanded', 'false');
        marker.style.top = `${group.top}px`;

        const isSingle = group.annotations.length === 1;

        if (isSingle) {
          // Single annotation
          const annotation = group.annotations[0];
          const color = COLORS.find(c => c.name === annotation.color);

          marker.innerHTML = `
            <div class="${styles.annotationCard}" style="cursor: pointer;">
              <div class="${styles.annotationHeader}">
                <div class="${styles.dot}" style="background-color: ${color?.value || '#eab308'}"></div>
                ${formatAuthor(annotation.authorName)}
              </div>
              <div class="${styles.comment}">${annotation.commentText}</div>
              <div class="${styles.date}">${new Date(annotation.createdAt).toLocaleDateString()}</div>
            </div>
          `;

          // Click to scroll to highlight
          marker.addEventListener('click', () => {
            group.marks[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        } else {
          // Multiple annotations - start collapsed
          const count = group.annotations.length;
          const dots = group.annotations
            .map(a => {
              const color = COLORS.find(c => c.name === a.color);
              return `<div class="${styles.dot}" style="background-color: ${color?.value || '#eab308'}"></div>`;
            })
            .join('');

          marker.innerHTML = `
            <div class="${styles.annotationCard} ${styles.grouped}">
              <div class="${styles.groupedHeader}" data-header="true" style="cursor: pointer;">
                <div class="${styles.dots}">${dots}</div>
                <span class="${styles.count}">${count} annotations</span>
                <span class="${styles.expand}">▶</span>
              </div>
            </div>
          `;

          // Add click handler to header only
          const header = marker.querySelector('[data-header]');
          header?.addEventListener('click', (e) => {
            e.stopPropagation();

            // Toggle expanded state locally without triggering React re-render
            const isCurrentlyExpanded = marker.getAttribute('data-expanded') === 'true';
            marker.setAttribute('data-expanded', (!isCurrentlyExpanded).toString());

            // Update the HTML content
            if (!isCurrentlyExpanded) {
              // Expand
              const annotationsHTML = group.annotations
                .map((a, idx) => {
                  const color = COLORS.find(c => c.name === a.color);
                  return `
                    <div class="${styles.annotationItem}" style="cursor: pointer;" data-annotation-idx="${idx}">
                      <div class="${styles.annotationHeader}">
                        <div class="${styles.dot}" style="background-color: ${color?.value || '#eab308'}"></div>
                        <span class="${styles.author}">${a.authorName || 'Anonymous'}</span>
                      </div>
                      <div class="${styles.comment}">${a.commentText}</div>
                      <div class="${styles.date}">${new Date(a.createdAt).toLocaleDateString()}</div>
                    </div>
                  `;
                })
                .join('');

              marker.innerHTML = `
                <div class="${styles.annotationCard} ${styles.expanded}">
                  <div class="${styles.groupedHeader}" data-header="true" style="cursor: pointer;">
                    <span class="${styles.count}">${count} annotations</span>
                    <span class="${styles.collapse}">▼</span>
                  </div>
                  <div class="${styles.annotationsList}">
                    ${annotationsHTML}
                  </div>
                </div>
              `;

              // Re-attach click handlers to individual annotation items
              marker.querySelectorAll('[data-annotation-idx]').forEach((item) => {
                item.addEventListener('click', (e) => {
                  e.stopPropagation();
                  const idx = parseInt(item.getAttribute('data-annotation-idx') || '0');
                  group.marks[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
              });

              // Re-attach header click handler
              const newHeader = marker.querySelector('[data-header]');
              newHeader?.addEventListener('click', (e) => {
                e.stopPropagation();
                header?.dispatchEvent(new Event('click'));
              });
            } else {
              // Collapse
              marker.innerHTML = `
                <div class="${styles.annotationCard} ${styles.grouped}">
                  <div class="${styles.groupedHeader}" data-header="true" style="cursor: pointer;">
                    <div class="${styles.dots}">${dots}</div>
                    <span class="${styles.count}">${count} annotations</span>
                    <span class="${styles.expand}">▶</span>
                  </div>
                </div>
              `;

              // Re-attach header click handler
              const newHeader = marker.querySelector('[data-header]');
              newHeader?.addEventListener('click', (e) => {
                e.stopPropagation();
                header?.dispatchEvent(new Event('click'));
              });
            }

            // Reposition after content change
            setTimeout(() => {
              repositionGroups();
            }, 10);
          });
        }

        // Add hover effects for all marks in group
        group.marks.forEach(mark => {
          mark.addEventListener('mouseenter', () => {
            marker.classList.add(styles.active);
          });
          mark.addEventListener('mouseleave', () => {
            marker.classList.remove(styles.active);
          });

          const handleClick = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mark clicked, attempting to toggle mobile modal');
            console.log('Marker element:', marker);
            console.log('Current classes:', marker.className);

            // Close any other open markers first
            document.querySelectorAll(`[class*="annotationMarker"]`).forEach(am => {
              if (am !== marker) {
                am.classList.remove(styles.mobileActive);
              }
            });

            marker.classList.toggle(styles.mobileActive);
            console.log('After toggle classes:', marker.className);
            console.log('Has mobileActive:', marker.classList.contains(styles.mobileActive));
          };

          mark.addEventListener('click', handleClick);
          mark.addEventListener('touchend', handleClick);
        });

        // Close on backdrop click (for mobile)
        const handleMarkerClick = (e: MouseEvent | TouchEvent) => {
          // Only close if clicking the marker itself (backdrop), not the card
          if (e.target === marker) {
            marker.classList.remove(styles.mobileActive);
          }
        };

        marker.addEventListener('click', handleMarkerClick);
        marker.addEventListener('touchend', handleMarkerClick);

        container.appendChild(marker);
      });

      // Reposition after all markers are added
      setTimeout(() => {
        repositionGroups();
      }, 10);

      // Add global click handler to close modal when clicking outside
      const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
        const target = e.target as HTMLElement;

        // Don't close if clicking on a marker or annotation card
        if (target.closest('[class*="annotationMarker"]') ||
            target.closest('[class*="annotationCard"]') ||
            target.closest('mark[data-annotation-id]')) {
          return;
        }

        // Close all open mobile modals
        document.querySelectorAll('[class*="mobileActive"]').forEach(marker => {
          marker.classList.remove(styles.mobileActive);
        });
      };

      document.addEventListener('click', handleGlobalClick);
      document.addEventListener('touchend', handleGlobalClick);
    };

    const timer = setTimeout(applyHighlights, 300);
    return () => {
      clearTimeout(timer);
      document.querySelectorAll('[data-annotation-marker]').forEach(el => el.remove());
    };
  }, [annotations]);

  return null;
}
