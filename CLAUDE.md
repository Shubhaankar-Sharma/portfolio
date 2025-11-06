# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Orchestrator Mode: Agent-Based Workflow

When working on this codebase, Claude should operate as an intelligent orchestrator that:

1. **Thinks Architecturally**: Before executing tasks, analyze the high-level architecture and determine the best approach. Break complex changes into logical components.

2. **Divides Work Among Specialized Agents**: For complex tasks involving multiple concerns (e.g., frontend + backend + documentation), spawn specialized agents:
   - **Frontend Agent**: UI components, styling, React/Next.js code
   - **Backend Agent**: API routes, data processing, server-side logic
   - **Documentation Agent**: CLAUDE.md updates, README changes, code comments
   - **Testing Agent**: Test creation, validation, debugging
   - **Content Agent**: MDX articles, JSON content files, data structures

3. **Communicates Progress**: Keep the user informed about which agents are working on what, and coordinate their efforts.

4. **Maintains Documentation**: After making significant architectural changes, automatically update this CLAUDE.md file to reflect the new state of the codebase. This ensures future Claude sessions have accurate information.

   **Update CLAUDE.md when**:
   - Adding or removing major features
   - Changing component architecture or file locations
   - Integrating previously unintegrated components
   - Adding new API routes or content systems
   - Changing development workflows or commands
   - Updating key dependencies

5. **When to Use Multiple Agents**:
   - Tasks spanning 3+ distinct areas of the codebase
   - Complex features requiring frontend, backend, and content changes
   - Major refactoring that affects multiple layers
   - Adding new sections/features to the portfolio

6. **When to Use Single Execution**:
   - Simple component edits or bug fixes
   - Content updates (adding blog posts, updating portfolio data)
   - Styling tweaks
   - Single-file changes

See `agents.md` for detailed agent workflow documentation.

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

**Case Studies** (`/public/content/[slug].md`):
- Markdown files for detailed project write-ups
- Accessed via `app/[slug]/page.tsx` route
- Rendered with CaseStudy component
- Integrated with portfolio data from `profileData.json`

### Component Architecture

**Page Structure:**
- `app/page.tsx`: Main homepage - reads `profileData.json` and passes to Profile component
- `app/layout.tsx`: Root layout with Inter font and theme toggle, generates metadata
- `app/opengraph-image.tsx`: Dynamic OG image generation for social sharing
- `app/[slug]/page.tsx`: Case study pages - renders markdown content from `public/content/[slug].md` with CaseStudy component
- `app/writing/page.tsx`: Blog index - lists articles from `content/writing/` + links from `content/links.json`
- `app/writing/[slug]/page.tsx`: Article page - renders MDX with custom components (currently minimal, supports hero images and back navigation)
- `app/writing/[slug]/llms.txt/route.ts`: Machine-readable article format for LLM consumption
- `app/writing/feed.xml/`: RSS feed for blog articles (static file)
- `app/music/page.tsx`: Music page - displays recommendations + Spotify "Now Playing"
- `app/s/[id]/page.tsx`: Share redirect - loads share data and redirects to article with highlight
- `app/api/chat/route.ts`: AI chat endpoint using Anthropic SDK (Claude Sonnet 4.5) for article discussions - provides structured article guides with diagrams
- `app/api/spotify/now-playing/route.ts`: Spotify API integration for currently playing track

**Portfolio Components:**
- `Profile.tsx`: Main portfolio component that renders all sections based on `profileData.json`
  - Uses colored squiggle underlines (blue, purple, red, green, orange) for different section types
- `CaseStudy.tsx`: Case study page renderer for detailed project write-ups
- `Attachments.tsx`: Gallery component with horizontal scrolling (uses `react-scrollbooster`)
- `Lightbox.tsx`: Full-screen media viewer with navigation
- `RichText.tsx`: Markdown renderer (uses `react-markdown`)
- `Scrollbar.tsx`: Custom scrollbar for galleries
- `Arrow12.tsx`: SVG arrow icon component (12x12px) used across the site

**Writing/Article Components:**
- `WritingClient.tsx`: Blog index with tag filtering and search
- `ArticleNavigation.tsx`: Floating table of contents for articles (component exists, not currently integrated)
- `ArtifactRenderer.tsx`: Renders Mermaid diagrams and artifacts from AI chat responses (component exists, not currently integrated)
- `AnnotationsList.tsx`: Displays article annotations/comments with color-coded highlights (component exists, not currently integrated)
- `CopyContextButton.tsx`: Copies article content for AI context (component exists, not currently integrated)
- `ShareHighlight.tsx`: Handles text sharing functionality with URL generation

**Shared/Text Selection Components (in `/app/components/`):**
- `TextSelectionActions.tsx`: Popup for text selection with share/annotate actions
- `AnnotationHandler.tsx`: Manages highlights and shared text with color-coded annotations
- `TextSelectionShare.tsx`: Share dialog for selected text
- `HighlightHandler.tsx`: Manages text highlighting and selection ranges
- `ArticleComments.tsx`: AI-powered article discussion interface (exists but not integrated)

**Music Components:**
- `MusicClient.tsx`: Music page with Spotify integration and recommendations

**UI Components:**
- `ThemeToggle.tsx`: Dark/light mode switcher
- `Navigation.tsx`: Site navigation with theme toggle
- `isMobile.tsx`: Mobile detection utility

**Utilities:**
- `app/utils/dateFormat.ts`: Date formatting helper for articles

### Styling

- Uses CSS Modules for component-specific styles
- Global styles in `app/globals.css` with CSS custom properties
- Supports dark mode via `prefers-color-scheme`
- Color-coded sections using squiggle underline classes (`.squiggle-blue`, `.squiggle-purple`, etc.)

### Key Dependencies

- **@ai-sdk/anthropic + ai**: Anthropic's AI SDK for chat streaming (Claude Sonnet 4.5 - model ID: `claude-sonnet-4-5-20250929`)
- **next-mdx-remote**: Server-side MDX rendering with custom React components
- **framer-motion**: Animations for Lightbox, Attachments, and page transitions
- **react-markdown**: Markdown rendering for portfolio item descriptions
- **react-scrollbooster**: Touch-enabled horizontal gallery scrolling
- **gray-matter**: Frontmatter parsing for MDX articles
- **mermaid**: Diagram rendering in AI chat artifacts (component exists, not integrated)
- **katex**: LaTeX math equation rendering in articles
- **highlight.js**: Code syntax highlighting with GitHub Dark theme
- **rehype/remark plugins**: Markdown processing pipeline (math, GFM, syntax highlighting)
- **use-resize-observer**: Component resize detection for responsive elements

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

**Case Studies** (`/public/content/[slug].md`):
- Create markdown file with slug matching portfolio item (e.g., `project-name.md`)
- Accessible at `/[slug]` route
- Rendered with CaseStudy component which integrates portfolio data
- Use standard markdown formatting

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
