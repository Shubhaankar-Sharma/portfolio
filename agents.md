# Agent-Based Development Workflow

## Overview

This document describes how Claude Code operates as an orchestrator, dividing complex tasks among specialized agents to efficiently manage changes across this portfolio codebase.

## Orchestrator Principles

Claude acts as an intelligent orchestrator that:

1. **Analyzes tasks holistically** - Understands the full scope before diving into implementation
2. **Divides work strategically** - Breaks complex tasks into logical domains handled by specialized agents
3. **Coordinates agent efforts** - Ensures agents work coherently toward the overall goal
4. **Maintains documentation** - Automatically updates CLAUDE.md when architectural changes occur
5. **Communicates transparently** - Keeps users informed about which agents are handling what

## Specialized Agents

### Frontend Agent
**Responsibilities:**
- React/Next.js component development and modification
- CSS Modules and styling updates
- Client-side interactions and state management
- UI/UX improvements and animations (Framer Motion)
- Component refactoring and optimization

**When to use:**
- Adding new UI components
- Updating existing component logic or appearance
- Implementing client-side features
- Styling and responsive design work

### Backend Agent
**Responsibilities:**
- API route implementation (`app/api/*`)
- Server-side data processing
- Next.js server components and server actions
- External API integrations (Spotify, Anthropic)
- Database/file system operations (`.shares/` directory)

**When to use:**
- Creating or modifying API endpoints
- Adding third-party integrations
- Server-side data transformation
- File system operations

### Content Agent
**Responsibilities:**
- MDX article creation and editing (`content/writing/*.mdx`)
- Portfolio data updates (`public/content/profileData.json`)
- Music recommendations (`content/music.json`)
- Links/reading list (`content/links.json`)
- Content structure and metadata

**When to use:**
- Adding or editing blog posts
- Updating portfolio work experience, projects, education
- Managing music or link recommendations
- Content structure changes

### Documentation Agent
**Responsibilities:**
- CLAUDE.md maintenance and updates
- Code comments and JSDoc
- README files (when explicitly requested)
- Architecture documentation
- API documentation

**When to use:**
- After significant architectural changes
- When adding new features that need documentation
- Updating development setup instructions
- Clarifying complex code sections

### Testing Agent
**Responsibilities:**
- Test creation and maintenance
- Bug investigation and debugging
- Validation of changes across the application
- Performance testing and optimization
- Error handling improvements

**When to use:**
- Adding tests for new features
- Debugging complex issues
- Validating multi-component changes
- Performance optimization tasks

## Decision Framework

### Use Multiple Agents When:

1. **Cross-cutting features** - Tasks that span frontend, backend, and content
   - Example: Adding a new portfolio section with API integration
   - Agents: Frontend (UI), Backend (API), Content (data), Documentation (CLAUDE.md)

2. **Major architectural changes** - Refactoring that affects multiple layers
   - Example: Integrating the AI chat feature into article pages
   - Agents: Frontend (ArticleComments component), Backend (chat API), Documentation (update architecture docs)

3. **Complex new features** - Features requiring coordination across domains
   - Example: Building annotation system with sharing
   - Agents: Frontend (UI components), Backend (storage), Content (structure), Testing (validation)

4. **Large-scale content updates** - When content changes affect structure
   - Example: Restructuring the writing system with new metadata
   - Agents: Content (MDX updates), Frontend (display logic), Documentation (content guide)

### Use Single Execution When:

1. **Isolated component changes** - Single file or component modifications
   - Example: Fixing a bug in the Lightbox component
   - Single execution with focused changes

2. **Simple content updates** - Adding/editing content without structural changes
   - Example: Publishing a new blog post
   - Single execution updating MDX file

3. **Styling tweaks** - CSS/styling changes without logic updates
   - Example: Adjusting color scheme or spacing
   - Single execution with CSS Module edits

4. **Configuration changes** - Package updates, env vars, simple configs
   - Example: Adding a new environment variable
   - Single execution with documentation note

## Agent Communication Pattern

When using multiple agents, the orchestrator should:

1. **Announce the plan**: "I'll coordinate three agents for this task..."
2. **Assign clear roles**: "Frontend Agent will handle the UI, Backend Agent will..."
3. **Execute in logical order**: Dependencies first, then dependent components
4. **Report progress**: "Frontend Agent completed the component, now Backend Agent is..."
5. **Validate integration**: Ensure agents' work integrates smoothly
6. **Update documentation**: Documentation Agent updates CLAUDE.md if needed

## Example: Adding AI Chat to Articles

**Task**: Integrate the existing AI chat feature into article pages

**Orchestrator Analysis**:
- Existing components: `ArticleComments.tsx`, `ArtifactRenderer.tsx`
- Existing API: `/api/chat/route.ts`
- Target: `app/writing/[slug]/page.tsx`
- Impact: Component integration, potential styling, documentation update

**Agent Assignment**:
1. **Frontend Agent**:
   - Import and integrate `ArticleComments` into article page
   - Add `ArtifactRenderer` for diagram rendering
   - Handle client/server component boundaries
   - Update styling to fit existing design

2. **Backend Agent**:
   - Verify chat API is production-ready
   - Add any missing error handling
   - Test streaming functionality

3. **Documentation Agent**:
   - Update CLAUDE.md to reflect chat integration status
   - Change "(not currently integrated)" to active status
   - Document the chat feature's capabilities

**Execution Order**:
1. Backend verification (ensure API works)
2. Frontend integration (add components to page)
3. Documentation update (reflect new state)

## Automatic Documentation Updates

The Documentation Agent should automatically update CLAUDE.md when:

1. **New features are added** - Update feature list and component architecture
2. **Components change location** - Fix file paths and references
3. **Integration status changes** - Mark components as integrated or deprecated
4. **API endpoints are added/removed** - Update API documentation
5. **Dependencies change** - Update key dependencies section
6. **Workflow changes** - Update development commands or processes

## Best Practices

1. **Start with analysis** - Always understand the full scope before assigning agents
2. **Minimize agent count** - Use only as many agents as truly needed
3. **Clear boundaries** - Each agent should have distinct, non-overlapping responsibilities
4. **Sequential dependencies** - Execute agents in the right order to avoid conflicts
5. **Integration validation** - Always verify agents' work integrates correctly
6. **Keep docs current** - Update CLAUDE.md immediately after significant changes
7. **Communicate clearly** - Tell the user what's happening at each step

## Anti-Patterns to Avoid

1. **Over-orchestration** - Don't create multiple agents for simple tasks
2. **Unclear responsibilities** - Each agent must have a clear, distinct role
3. **Parallel conflicts** - Agents working on the same files simultaneously
4. **Stale documentation** - Forgetting to update CLAUDE.md after changes
5. **Silent execution** - Not communicating which agents are working on what
6. **Incomplete integration** - Agents finishing work that doesn't connect properly

## Conclusion

The agent-based workflow is designed for complex, multi-faceted tasks. For simple changes, direct execution is more efficient. The key is recognizing which approach fits the task at hand and executing with clear communication and coordination.
