-- Create shares table for text snippet sharing
CREATE TABLE IF NOT EXISTS shares (
  id VARCHAR(10) PRIMARY KEY,
  text TEXT NOT NULL,
  article_slug VARCHAR(255) NOT NULL,
  article_title VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table for text annotations/highlights
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  article_slug VARCHAR(255) NOT NULL,
  highlighted_text TEXT,
  comment_text TEXT NOT NULL,
  start_offset INT,
  end_offset INT,
  color VARCHAR(20) DEFAULT 'yellow',
  author_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create article_comments table for general article comments
CREATE TABLE IF NOT EXISTS article_comments (
  id SERIAL PRIMARY KEY,
  article_slug VARCHAR(255) NOT NULL,
  comment_text TEXT NOT NULL,
  author_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shares_article_slug ON shares(article_slug);
CREATE INDEX IF NOT EXISTS idx_comments_article_slug ON comments(article_slug);
CREATE INDEX IF NOT EXISTS idx_article_comments_article_slug ON article_comments(article_slug);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_comments_created_at ON article_comments(created_at DESC);
