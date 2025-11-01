# Web-Based UI for OpenCode - Implementation Plan

## Overview

This document outlines the comprehensive plan to build a secure, browser-based UI for OpenCode that provides full functionality parity with the terminal UI.

## Architecture Overview

OpenCode already has a **client/server architecture** in place:

- **Server**: The `opencode serve` command runs a headless HTTP server with a full REST API (OpenAPI 3.1 spec)
- **SDK**: JavaScript/TypeScript SDK (`@opencode-ai/sdk`) for connecting to the server
- **Desktop App**: An existing SolidJS desktop application (`packages/desktop`) that demonstrates full client functionality
- **UI Components**: Shared UI library (`packages/ui`) with reusable components
- **TUI**: Terminal UI written in Go that communicates with the server

## Key Components to Build

### 1. Web Application Package (New)

- **Location**: `packages/web-ui/` (new package)
- **Framework**: SolidJS with TypeScript (matches existing desktop app)
- **Build Tool**: Vite (consistent with existing packages)
- **Styling**: Tailwind CSS (matches existing packages)

### 2. Core Features for Parity

Based on the desktop app (`packages/desktop/src/pages/index.tsx`), implement:

#### Session Management

- List all sessions
- Create/delete sessions
- Switch between sessions
- Fork sessions at specific messages
- Share/unshare sessions

#### Chat Interface

- Message list with streaming responses
- Rich message rendering (text, code, diffs, tool outputs)
- Syntax highlighting (using Shiki)
- Markdown rendering (using marked)
- Typewriter effect for streaming

#### Prompt Input

- Multi-line text input
- File attachment support
- Drag & drop files
- Context management (files, selections)
- Keyboard shortcuts (Cmd/Ctrl+P for file picker)

#### File Explorer

- File tree navigation
- File search
- File status (git changes)
- Open files in editor
- Line selection for context

#### Tool Visualization

- Bash command outputs
- File edits with diffs
- Read/write operations
- Todo list tracking

#### Configuration

- Model selection
- Provider management
- Agent selection
- Theme customization

#### Real-time Updates

- Server-Sent Events (SSE) for live updates
- Event bus for session/message changes
- Progress indicators

## Security Considerations

### Authentication & Authorization

- Add OAuth/JWT authentication layer (not in current codebase)
- Session-based authentication
- API key management for providers
- CORS configuration for allowed origins

### Network Security

- HTTPS only in production
- WebSocket/SSE over secure connections
- Rate limiting on API endpoints
- Input sanitization and validation

### Access Control

- User-specific sessions
- Permission management for sensitive operations
- Audit logging for actions

## Deployment Options

### Option A: Self-Hosted

- User runs `opencode serve` on their machine
- Web UI connects to localhost
- Similar to current desktop app model
- Best for development and personal use

### Option B: Cloud-Hosted

- Deploy web UI to static hosting (Vercel, Netlify, Cloudflare)
- Users connect to their own opencode server instances
- Server runs on user's infrastructure
- Web UI is just a client

### Option C: Fully Managed

- Host both web UI and opencode server instances
- Multi-tenant architecture with user isolation
- Requires significant infrastructure and security work
- Database for user management

## Implementation Plan

### Phase 1: Foundation (Week 1-2) ✅ COMPLETED

1. ✅ Create new SolidJS package structure
   - Created `packages/web-ui/` with all configuration files
   - Set up package.json with SolidJS, Vite, Tailwind, and all dependencies
   - Configured tsconfig.json and vite.config.ts matching desktop app
2. ✅ Set up routing and layout
   - Integrated @solidjs/router
   - Created basic index.tsx entry point
   - Set up provider hierarchy (Shiki, Marked, SDK, Sync, Local, Meta)
3. ✅ Integrate SDK for API communication
   - Copied all context providers from desktop app (sdk.tsx, sync.tsx, local.tsx, helper.tsx)
   - Set up SDK client initialization with SSE event handling
   - Implemented state management for sessions, messages, files, models, and agents
4. ⏭️ Implement authentication wrapper (deferred - not needed for initial implementation)
5. 🚧 Create basic session list and chat interface (placeholder page created, full implementation pending)

### Phase 2: Core Features (Week 3-4) ✅ COMPLETED

1. ✅ Message rendering with syntax highlighting
   - Created message-progress.tsx for streaming AI responses
   - Created code.tsx with Shiki syntax highlighting and line selection
   - Implemented message list in main page with markdown rendering
2. ✅ Streaming message support
   - MessageProgress component handles real-time SSE updates
   - Displays current task status and completed tool executions
   - Auto-scrolling viewport for ongoing responses
3. ✅ File attachment and context management
   - Prompt input supports @ mention syntax for file autocomplete
   - File attachment UI integrated into prompt component
4. ✅ Tool output visualization
   - Message progress shows tool executions with spinner animations
   - Collapsible response details with tool parts
   - Diffs and file operations rendered in messages
5. ✅ Real-time updates via SSE
   - Context providers handle SSE event stream
   - Messages update live as they stream from server
   - Progress indicators for ongoing operations

### Phase 3: Advanced Features (Week 5-6)

1. File explorer with search
2. Diff viewer for code changes
3. Model and agent selection
4. Theme customization
5. Keyboard shortcuts

### Phase 4: Polish & Security (Week 7-8)

1. Add authentication layer
2. Implement security best practices
3. Error handling and loading states
4. Responsive design
5. Performance optimization

### Phase 5: Deployment (Week 9-10)

1. Production build optimization
2. Docker containerization
3. Deployment documentation
4. E2E testing
5. User documentation

## Technical Stack

### Web UI

- SolidJS (matches existing desktop app)
- TypeScript
- Vite
- Tailwind CSS
- @solidjs/router
- @opencode-ai/sdk (existing)
- @opencode-ai/ui (existing components - direct reuse)
- Shiki (syntax highlighting)
- marked (markdown)
- diff library

### Backend

- Existing opencode serve (no changes needed)
- Add authentication middleware (optional)
- Add rate limiting (optional)

### Deployment

- Docker for containerization
- Nginx for reverse proxy
- Let's Encrypt for SSL

## Key API Endpoints to Use

Already available in opencode server:

- `POST /session` - Create session
- `GET /session` - List sessions
- `GET /session/:id/message` - Get messages
- `POST /session/:id/message` - Send prompt
- `GET /event` - SSE event stream
- `GET /file` - File operations
- `GET /config` - Configuration
- `POST /session/:id/abort` - Cancel operation

## Advantages of This Approach

1. **Reuse Existing Infrastructure**: No changes needed to core opencode
2. **Leverage SDK**: Use battle-tested `@opencode-ai/sdk`
3. **Component Reuse**: Direct reuse of existing SolidJS components from desktop app and @opencode-ai/ui
4. **Security**: Run server locally or on user's infrastructure
5. **Flexibility**: Multiple deployment options
6. **Maintainability**: Separate concerns (server vs. client)

## File Structure

```
packages/web-ui/
├── public/
│   └── favicon.svg                    ✅ Created
├── src/
│   ├── components/                    ✅ Created
│   │   ├── prompt-input.tsx           ✅ Full prompt input with model/agent selection
│   │   ├── message-progress.tsx       ✅ Streaming message progress with tool outputs
│   │   ├── code.tsx                   ✅ Syntax highlighting with line selection
│   │   ├── spinner.tsx                ✅ Animated loading spinner
│   │   ├── file/                      📁 To be created
│   │   │   ├── FileTree.tsx
│   │   │   └── FileExplorer.tsx
│   │   └── layout/                    📁 To be created
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── context/                       ✅ Created (copied from desktop)
│   │   ├── helper.tsx                 ✅
│   │   ├── sdk.tsx                    ✅
│   │   ├── sync.tsx                   ✅
│   │   └── local.tsx                  ✅
│   ├── utils/                         ✅ Created (copied from desktop)
│   │   ├── binary.ts                  ✅
│   │   ├── dom.ts                     ✅
│   │   ├── index.ts                   ✅
│   │   ├── path.ts                    ✅
│   │   └── speech.ts                  ✅
│   ├── pages/
│   │   └── index.tsx                  ✅ Full chat interface with message history
│   ├── index.tsx                      ✅ Created (main entry)
│   └── index.css                      ✅ Created
├── package.json                       ✅ Created
├── tsconfig.json                      ✅ Created
├── vite.config.ts                     ✅ Created
├── sst-env.d.ts                       ✅ Created
├── .gitignore                         ✅ Created
└── README.md                          ✅ Created
```

Legend:

- ✅ Created and configured
- 📁 Directory structure exists, components to be added
- (No marker) = Planned for future implementation

## Implementation Status

### ✅ Completed

- **Phase 1**: Package structure, routing, SDK integration, context providers
  - All configuration files (package.json, tsconfig.json, vite.config.ts)
  - Context providers for state management (SDK, Sync, Local)
  - Basic project structure and documentation
- **Phase 2**: Core chat features implementation
  - Message rendering with syntax highlighting (Shiki)
  - Streaming message support with real-time updates
  - Prompt input with agent/model selection and file attachments
  - Tool output visualization with progress indicators
  - Real-time SSE event handling
  - Components: spinner.tsx, message-progress.tsx, prompt-input.tsx, code.tsx
  - Full chat interface in pages/index.tsx
  - Successful production build (779KB main JS bundle)

### 🚧 In Progress

- None currently

### 📋 Next Steps

1. **Immediate (Testing)**
   - Test the web UI: `cd packages/web-ui && bun dev`
   - Verify chat interface works with `opencode serve`
   - Test message streaming and tool output display
   - Validate agent/model selection and file attachments

2. **Phase 3: Advanced Features**
   - Implement file explorer with search
   - Add diff viewer for code changes
   - Build model and agent selection UI
   - Add theme customization
   - Implement keyboard shortcuts

3. **Future Phases**
   - Phase 4: Polish & Security
   - Phase 5: Deployment

## References

- Existing desktop app: `packages/desktop/`
- UI component library: `packages/ui/`
- OpenCode SDK: `packages/sdk/js/`
- Server implementation: `packages/opencode/src/server/server.ts`
- API documentation: `packages/web/src/content/docs/server.mdx`
