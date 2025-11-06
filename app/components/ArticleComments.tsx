"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './ArticleComments.module.css';

type ArticleComment = {
  id: number;
  commentText: string;
  authorName: string | null;
  createdAt: string;
};

export default function ArticleComments() {
  const pathname = usePathname();
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const articleSlug = pathname?.split('/').pop() || '';

  // Load comments from database
  useEffect(() => {
    if (!articleSlug) return;

    const loadComments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/article-comments?articleSlug=${articleSlug}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [articleSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/article-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleSlug,
          commentText: commentText.trim(),
          authorName: authorName.trim() || null,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setCommentText('');
        setAuthorName('');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className={styles.commentsSection}>
      <h2 className={styles.title}>Comments</h2>

      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <input
          type="text"
          placeholder="Twitter (@username)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className={styles.input}
        />
        <textarea
          placeholder="Share your thoughts..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className={styles.textarea}
          rows={4}
          required
        />
        <button
          type="submit"
          disabled={!commentText.trim() || isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Posting...' : 'Post comment'}
        </button>
      </form>

      <div className={styles.commentsList}>
        {isLoading ? (
          <p className={styles.loading}>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className={styles.emptyState}>No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => {
            const authorName = comment.authorName || 'Anonymous';
            const isTwitterHandle = authorName.startsWith('@');
            const twitterUrl = isTwitterHandle
              ? `https://twitter.com/${authorName.slice(1)}`
              : null;

            return (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  {twitterUrl ? (
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.author}
                    >
                      {authorName}
                    </a>
                  ) : (
                    <span className={styles.author}>{authorName}</span>
                  )}
                  <span className={styles.date}>{formatDate(comment.createdAt)}</span>
                </div>
                <p className={styles.commentText}>{comment.commentText}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
