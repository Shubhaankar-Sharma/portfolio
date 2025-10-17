# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 portfolio site built with TypeScript and React 19. The site uses a data-driven approach where portfolio content is loaded from a single JSON file (`public/content/profileData.json`) that contains all work experience, education, projects, awards, and contact information.

## Development Commands

- **Development server**: `npm run dev` or `bun dev`
- **Production build**: `npm run build` or `bun build`
- **Start production server**: `npm run start` or `bun start`
- **Linting**: `npm run lint` or `bun lint`

Note: This project uses bun as the package manager (see `bun.lockb`).

## Architecture

### Data-Driven Content System

The entire portfolio is driven by `/public/content/profileData.json`, which contains:
- `general`: Basic profile information (name, photo, byline, about, sectionOrder)
- `allCollections`: Array of collections containing items for each section:
  - Work Experience (`workExperience`)
  - Education (`education`)
  - Open Source Work (`openSourceWork`)
  - Projects (`projects`)
  - Awards (`awards`)
  - Links/Contact (`contact`)

Each item in a collection follows a consistent structure with fields like `id`, `year`, `heading`, `url`, `description`, `attachments`, `technologies`, and type-specific fields (e.g., `logo`, `company`, `location`).

### Component Architecture

**Page Structure:**
- `app/page.tsx`: Main homepage that reads `profileData.json` and passes it to Profile component
- `app/layout.tsx`: Root layout with Inter font, generates metadata from profile data
- `app/[slug]/page.tsx`: Dynamic route for case studies (reads markdown files from `/public/content/*.md`)

**Key Components:**
- `Profile.tsx`: Main portfolio component that renders all sections based on `profileData.json`
  - Contains `ProfileItem` for rendering work/education/project items
  - Contains `ContactItem` for rendering contact links
  - Uses colored squiggle underlines (blue, purple, red, green, orange) for different section types
- `Attachments.tsx`: Gallery component with horizontal scrolling (uses `react-scrollbooster`)
  - Supports images and videos
  - Opens lightbox on click
  - Custom scrollbar via `Scrollbar.tsx`
- `Lightbox.tsx`: Full-screen media viewer with navigation
- `RichText.tsx`: Markdown renderer (uses `react-markdown`)
- `Scrollbar.tsx`: Custom scrollbar component
- `isMobile.tsx`: Mobile detection utility

### Styling

- Uses CSS Modules for component-specific styles
- Global styles in `app/globals.css` with CSS custom properties
- Supports dark mode via `prefers-color-scheme`
- Color-coded sections using squiggle underline classes (`.squiggle-blue`, `.squiggle-purple`, etc.)

### Key Dependencies

- **framer-motion**: Animations (used in Lightbox and Attachments)
- **react-markdown**: Markdown rendering for descriptions and case studies
- **react-scrollbooster**: Horizontal gallery scrolling
- **use-resize-observer**: Component resize detection

## Content Editing

To add/edit portfolio content, modify `/public/content/profileData.json`:
1. Add new items to the appropriate collection in `allCollections`
2. Ensure required fields are included: `id`, `year`, `heading`, `type`
3. Add `attachments` array for images/videos (with `url`, `type`, `width`, `height`)
4. Add `technologies` array to display tech tags
5. Use markdown in `description` fields for rich formatting

For case studies, create markdown files in `/public/content/` and access via `/{filename}` route.
