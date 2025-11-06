# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 portfolio site built with TypeScript and React 19. The site combines:
- **Portfolio content** from `public/content/profileData.json` (work experience, education, projects, awards, contact)
- **Writing/blog system** with MDX articles in `content/writing/`
- **Music recommendations** from `content/music.json`
- **Links/reading list** from `content/links.json`
- **AI chat assistant** powered by Anthropic's Claude for article discussions
- **Spotify integration** showing currently playing music
- **Text sharing** using file-based storage in `.shares/` directory

## Development Commands

- **Development server**: `pnpm dev` (or `npm run dev` / `bun dev`)
- **Production build**: `pnpm build` (or `npm run build` / `bun build`)
- **Start production server**: `pnpm start`
- **Linting**: `pnpm lint`

Note: This project primarily uses pnpm as the package manager (see `pnpm-lock.yaml`).

## Architecture

### Content System

**Portfolio** (`/public/content/profileData.json`):
- `general`: Basic profile information (name, photo, byline, about, sectionOrder)
- `allCollections`: Array of collections containing items for each section (work experience, education, projects, awards, contact)
- Each item has consistent structure: `id`, `year`, `heading`, `url`, `description`, `attachments`, `technologies`, etc.

**Writing/Blog** (`/content/writing/*.mdx`):
- MDX files with frontmatter (title, date, description, tags, status)
- Rendered using `next-mdx-remote` with support for:
  - Math equations (remark-math, rehype-katex)
  - Syntax highlighting (rehype-highlight)
  - GitHub Flavored Markdown (remark-gfm)
  - Custom React components (e.g., `GreenContextSimulation`)
- Articles accessible at `/writing/[slug]`
- RSS feed generated at `/writing/feed.xml`
- Machine-readable format at `/writing/[slug]/llms.txt`

**Music** (`/content/music.json`):
- Music recommendations with metadata (title, artist, year, album art, streaming links)
- Spotify "Now Playing" integration via `/api/spotify/now-playing`

**Links** (`/content/links.json`):
- Organized reading list with categories and subcategories
- Displayed on `/writing` page alongside articles

**Text Sharing**:
- File-based storage in `.shares/` directory
- Share URLs: `/s/[id]` redirect to article with highlight
- JSON format: `{ id, text, articleSlug, articleTitle, createdAt }`

### Component Architecture

**Page Structure:**
- `app/page.tsx`: Main homepage - reads `profileData.json` and passes to Profile component
- `app/layout.tsx`: Root layout with Inter font and theme toggle, generates metadata
- `app/writing/page.tsx`: Blog index - lists articles from `content/writing/` + links from `content/links.json`
- `app/writing/[slug]/page.tsx`: Article page - renders MDX with AI chat, navigation, and annotations
- `app/music/page.tsx`: Music page - displays recommendations + Spotify "Now Playing"
- `app/s/[id]/page.tsx`: Share redirect - loads share data and redirects to article with highlight
- `app/api/chat/route.ts`: AI chat endpoint using Anthropic SDK for article discussions
- `app/api/spotify/now-playing/route.ts`: Spotify API integration for currently playing track

**Portfolio Components:**
- `Profile.tsx`: Main portfolio component that renders all sections based on `profileData.json`
  - Uses colored squiggle underlines (blue, purple, red, green, orange) for different section types
- `Attachments.tsx`: Gallery component with horizontal scrolling (uses `react-scrollbooster`)
- `Lightbox.tsx`: Full-screen media viewer with navigation
- `RichText.tsx`: Markdown renderer (uses `react-markdown`)
- `Scrollbar.tsx`: Custom scrollbar for galleries

**Writing/Article Components:**
- `WritingClient.tsx`: Blog index with tag filtering and search
- `ArticleNavigation.tsx`: Floating table of contents for articles
- `ArtifactRenderer.tsx`: Renders Mermaid diagrams and artifacts from AI responses
- `AnnotationsList.tsx`: Displays article annotations/comments
- `TextSelectionActions.tsx`: Popup for text selection (share/annotate actions)
- `AnnotationHandler.tsx`: Manages highlights and shared text
- `CopyContextButton.tsx`: Copies article content for AI context

**Music Components:**
- `MusicClient.tsx`: Music page with Spotify integration and recommendations

**UI Components:**
- `ThemeToggle.tsx`: Dark/light mode switcher
- `Navigation.tsx`: Site navigation with theme toggle
- `isMobile.tsx`: Mobile detection utility

### Styling

- Uses CSS Modules for component-specific styles
- Global styles in `app/globals.css` with CSS custom properties
- Supports dark mode via `prefers-color-scheme`
- Color-coded sections using squiggle underline classes (`.squiggle-blue`, `.squiggle-purple`, etc.)

### Key Dependencies

- **@ai-sdk/anthropic + ai**: Anthropic's AI SDK for chat streaming (Claude Sonnet 4.5)
- **next-mdx-remote**: Server-side MDX rendering with custom components
- **framer-motion**: Animations (Lightbox, Attachments, page transitions)
- **react-markdown**: Markdown rendering for descriptions
- **react-scrollbooster**: Horizontal gallery scrolling
- **gray-matter**: Frontmatter parsing for MDX articles
- **mermaid**: Diagram rendering in AI artifacts
- **katex**: LaTeX math equation rendering
- **highlight.js**: Code syntax highlighting
- **rehype/remark plugins**: Markdown processing pipeline
- **use-resize-observer**: Component resize detection

## Content Editing

**Portfolio** (`/public/content/profileData.json`):
1. Add new items to the appropriate collection in `allCollections`
2. Required fields: `id`, `year`, `heading`, `type`
3. Add `attachments` array for images/videos (with `url`, `type`, `width`, `height`)
4. Add `technologies` array to display tech tags
5. Use markdown in `description` fields for rich formatting

**Writing/Blog** (`/content/writing/*.mdx`):
1. Create new MDX file with frontmatter:
   ```yaml
   ---
   title: "Article Title"
   date: "2025-01-15"
   description: "Article description"
   tags: ["tag1", "tag2"]
   status: "published"  # or "draft" or "research"
   image: "/images/hero.jpg"  # optional
   ---
   ```
2. Write content using markdown + LaTeX math + custom React components
3. Articles automatically appear on `/writing` page
4. Use `<GreenContextSimulation />` or other custom components as needed

**Music** (`/content/music.json`):
- Add items to `recommendations` array with: `title`, `artist`, `year`, `note`, `albumArt`, `links` (spotify, appleMusic, tidal, youtube)

**Links** (`/content/links.json`):
- Organize by `categories` → `subcategories` → `links`
- Optional top-level: `onMyDesk`, `futureReading`
- Link format: `{ title, url, author(s), year, note }`

## Environment Variables

Required for full functionality:

```env
# Anthropic AI (for article chat)
ANTHROPIC_API_KEY=sk-ant-...

# Spotify Integration (for Now Playing)
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REFRESH_TOKEN=...
```

Spotify setup: See `scripts/SPOTIFY_SETUP.md` for instructions on obtaining refresh token.
