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

### Option A: Self-Hosted (Local Network)

- User runs `opencode serve --host 0.0.0.0 --port 4096` on their machine
- Web UI runs on `bun dev --host` to allow remote access
- Accessible from any device on the local network
- Configure web UI via `http://<server-ip>:3001/?url=http://<server-ip>:4096`
- Best for development and personal use across multiple devices

### Option B: Self-Hosted (Production)

- Build web UI: `bun run build`
- Serve static files via nginx/caddy
- Run opencode server with `--host 0.0.0.0`
- Configure CORS for web UI domain
- Optional: Use reverse proxy for single domain
- Optional: SSL/TLS with Let's Encrypt

### Option C: Cloud-Hosted (Static UI)

- Deploy web UI to static hosting (Vercel, Netlify, Cloudflare)
- Users run `opencode serve --host 0.0.0.0` on their infrastructure
- Configure server URL in web UI settings
- Web UI is just a client connecting to user's server
- Requires proper CORS configuration

### Option D: Fully Managed (Future)

- Host both web UI and opencode server instances
- Multi-tenant architecture with user isolation
- Requires significant infrastructure and security work
- Database for user management
- Authentication and authorization required

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

### Phase 3: Advanced Features (Week 5-6) ✅ COMPLETED

1. ✅ File explorer with tree view
   - Created file-tree.tsx with recursive directory navigation
   - Expand/collapse folders with visual indicators
   - Git status indicators (modified, added, deleted files)
   - File selection and click-to-open functionality
   - Emoji-based file icons for 50+ file types
   - Tooltips showing full file paths
2. ✅ Layout components
   - Created header.tsx with menu toggle and branding
   - Created sidebar.tsx with sessions list and file explorer
   - Sessions list shows file change counts and last modified
   - Toggle-able file explorer panel (Cmd/Ctrl+P)
   - Responsive layout integration
3. ✅ Model and agent selection
   - Full model selector already in prompt-input.tsx from Phase 2
   - Provider management with logos and metadata
   - Cost information display
   - Agent dropdown with available agents
4. ✅ Theme customization
   - Created theme-switcher.tsx component
   - Light/dark mode toggle with localStorage persistence
   - System preference detection on first load
   - Applies theme to HTML root element
5. ✅ Keyboard shortcuts
   - Created shortcuts.ts utility
   - Cmd/Ctrl+P: Toggle file explorer
   - Cmd/Ctrl+N: Create new session
   - Escape: Close inputs/modals (existing)
   - Platform-aware modifier key detection

### Phase 4: Theme System (Week 7) ⚠️ PARTIALLY COMPLETE

1. ✅ Port TUI theme system to web UI
   - Copied all 24 built-in themes from TUI (aura, ayu, catppuccin, cobalt2, dracula, everforest, github, gruvbox, kanagawa, material, matrix, mellow, monokai, nightowl, nord, one-dark, opencode, palenight, rosepine, solarized, synthwave84, tokyonight, vesper, zenburn)
   - Created theme JSON parser with recursive color reference resolution
   - Mapped all theme colors to 59 CSS custom properties
   - Implemented theme selection UI as dropdown in header
   - System theme detection with MediaQuery listener
   - localStorage persistence for theme preference
2. ❌ Theme integration (NOT WORKING)
   - **Problem**: Theme colors are not applying to UI components
   - **Root Cause**: `@opencode-ai/ui` package uses its own design system with ~510 CSS variables (e.g., `--background-base`, `--text-strong`, `--border-weak-base`, etc.) that are completely different from our theme system variables (e.g., `--color-background`, `--color-text`)
   - **Current State**: Theme selection works (localStorage, mode detection, dropdown), but colors don't change
   - **Fix Required**: Map TUI theme colors to UI package's CSS variable naming convention

### Phase 4.5: Theme Integration Fix (Week 7.5)

**Critical Issue**: Theme system infrastructure is complete but colors don't apply because of CSS variable mismatch between TUI themes and UI package design system.

#### Problem Analysis

**TUI Theme Structure** (from `packages/tui/internal/theme/`):

- Defines ~78 semantic color properties
- Uses adaptive colors (light/dark variants)
- Categories: background (3), border (3), brand (3), text (2), status (4), diff (12), markdown (14), syntax (9)
- Variables we created: `--color-background`, `--color-text`, `--color-primary`, etc.

**UI Package Design System** (from `packages/ui/src/styles/theme.css`):

- Defines ~510 CSS variables
- Uses Radix-style naming convention
- Variables: `--background-base`, `--text-strong`, `--border-weak-base`, `--surface-raised-strong`, etc.
- Based on primitive color scales (smoke, cobalt, ember, apple, etc.)
- Each primitive has light/dark variants and alpha variants

#### Solution: Two-Layer Mapping System

**Option A: Direct Mapping (Simpler, Less Flexible)**

Map TUI theme colors directly to UI package variables:

1. Create mapping from TUI semantic colors → UI design tokens
2. Update `css-properties.ts` to apply theme colors to UI variables
3. Handle light/dark mode by applying appropriate variant

**Challenges**:

- UI package has many more variables than TUI themes (510 vs 78)
- UI package has granular states (hover, active, focus, disabled) that TUI doesn't
- May not achieve full design fidelity

**Option B: Color Scale Generation (Complex, More Accurate)**

Generate Radix-style color scales from TUI theme base colors:

1. Extract base colors from each TUI theme
2. Generate 12-step color scales (Radix pattern) for each base
3. Map generated scales to UI package primitives
4. Apply to UI design tokens

**Challenges**:

- Requires color scale generation algorithm
- More complex implementation
- May drift from original theme intent

**Recommendation: Option A with Intelligent Fallbacks**

#### Implementation Plan

**Step 1: Analyze UI Package Variables** (Research)

- Categorize all 510 UI variables by purpose
- Identify critical variables that affect main UI (background, text, borders)
- Identify less critical variables (specific component states)
- Document which variables can share values

**Step 2: Create Mapping Schema** (Design)

- Map TUI theme categories to UI variable categories:
  - `background` → `--background-*`, `--surface-*`
  - `border` → `--border-*`
  - `text` → `--text-*`, `--icon-*`
  - `brand/primary` → `--surface-brand-*`, `--border-interactive-*`
  - `status colors` → `--surface-success-*`, `--surface-critical-*`, etc.
  - `diff` → `--surface-diff-*`, `--text-diff-*`

**Step 3: Implement Intelligent Mapping** (Code)

Create `src/theme/ui-mapping.ts`:

```typescript
export function mapThemeToUIVariables(
  theme: Theme,
  mode: "light" | "dark",
): Record<string, string> {
  const colors = mode === "dark" ? theme.dark : theme.light

  return {
    // Backgrounds
    "--background-base": colors.background,
    "--background-weak": colors.backgroundPanel,
    "--background-strong": colors.backgroundElement,
    // ... map all ~510 variables

    // For unmapped variables, use intelligent fallbacks:
    // - Hover states: slightly lighter/darker than base
    // - Active states: more contrast
    // - Disabled states: more muted
  }
}
```

**Step 4: Generate Intermediate Shades** (Enhancement)

For variables that need shades between our defined colors:

- Implement color interpolation utilities
- Generate hover/active/focus variants
- Use alpha blending for subtle states

**Step 5: Update Theme Application** (Integration)

Update `src/theme/css-properties.ts`:

- Remove current hardcoded variable mapping
- Call `mapThemeToUIVariables()` instead
- Apply all UI package variables
- Ensure proper light/dark mode handling

**Step 6: Testing** (Validation)

Test each of 24 themes for:

- Overall appearance matches theme intent
- Light/dark modes work correctly
- Interactive states (hover, focus, active) look good
- Diff viewer colors are readable
- Code syntax highlighting uses theme colors
- No visual regressions

#### Deliverables

1. `src/theme/ui-mapping.ts` - Mapping logic
2. `src/theme/color-utils.ts` - Color interpolation utilities
3. Updated `src/theme/css-properties.ts` - Apply mapped variables
4. Documentation of mapping decisions
5. Visual regression tests (optional)

#### Success Criteria

- All 24 themes visually apply when selected
- Light/dark mode toggle works per theme
- UI maintains good contrast and accessibility
- No hardcoded colors remain in components
- Theme changes feel cohesive and intentional

### Phase 5: Remote Access & Server Discovery (Week 8)

**Core Requirement**: Web UI must be accessible from any device on the network, not just localhost.

#### 1. Server Connection Configuration UI

**Problem**: Currently hardcoded to `http://127.0.0.1:4096`

**Solution**: Create server connection settings UI

- Settings panel/modal for server configuration
- Input fields for:
  - Server host (IP address or hostname)
  - Server port (default: 4096)
  - Protocol (http/https)
- Save server URL to localStorage (key: "opencode-server-url")
- "Test Connection" button to verify server availability
- Show connection status indicator in header
- Auto-reconnect on network change

#### 2. Server Discovery (Optional Enhancement)

**Options to explore**:

- mDNS/Bonjour for local network discovery
- Server broadcasts availability on local network
- Web UI scans common ports (4096, 3000, 8080) on detected network
- QR code generation from server for easy mobile connection

#### 3. Environment Variable & URL Parameter Support

**Already partially implemented via SDK context**:

- `VITE_OPENCODE_SERVER_HOST` - Server hostname/IP
- `VITE_OPENCODE_SERVER_PORT` - Server port
- URL parameter: `?url=http://192.168.1.100:4096`

**Enhancements needed**:

- Make URL parameter override localStorage
- Show current server in UI
- Easy way to switch between saved servers
- "Recent servers" list in localStorage

#### 4. Server-Side Configuration

**Update opencode serve command**:

- Add `--host` flag to bind to specific interface
  - Default: `127.0.0.1` (localhost only)
  - Option: `0.0.0.0` (all interfaces, needed for remote access)
  - Option: specific IP address
- Add `--cors-origin` flag for allowed origins
  - Default: `*` for development
  - Production: specific domains/IPs
- Document in server documentation

#### 5. CORS Configuration

**Server must support CORS for remote access**:

- Allow requests from web UI origin
- Support preflight OPTIONS requests
- Proper headers for SSE connections from remote origins
- Configurable allowed origins

#### Implementation Priority

**Phase 5a: Essential (Week 8.1)**

1. ✅ Server host/port already configurable via env vars and URL params
2. Create settings UI for server connection
3. Update server to support `--host 0.0.0.0` flag
4. Ensure CORS headers are properly set
5. Connection status indicator
6. localStorage persistence for server URL

**Phase 5b: Polish (Week 8.2)**

1. Test connection button
2. Recent servers list
3. Auto-reconnect on network change
4. Better error messages for connection issues
5. Loading states during connection

**Phase 5c: Future Enhancement**

1. Server discovery via mDNS
2. QR code for mobile connection
3. Network scanning for servers

### Phase 6: Polish & Security (Week 9)

1. Add authentication layer (optional for self-hosted)
2. Implement security best practices
3. Error handling and loading states
4. Responsive design improvements
5. Performance optimization
6. Accessibility improvements

### Phase 7: Deployment (Week 10)

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
│   │   ├── file/
│   │   │   └── file-tree.tsx          ✅ Recursive tree view with git status
│   │   └── layout/
│   │       ├── header.tsx             ✅ Header with menu toggle and branding
│   │       ├── sidebar.tsx            ✅ Sessions list and file explorer
│   │       └── theme-switcher.tsx     ✅ Theme selector dropdown with 24 themes
│   ├── context/                       ✅ Created (copied from desktop)
│   │   ├── helper.tsx                 ✅
│   │   ├── sdk.tsx                    ✅
│   │   ├── sync.tsx                   ✅
│   │   ├── local.tsx                  ✅
│   │   └── theme.tsx                  ✅ Theme context provider
│   ├── utils/                         ✅ Created (copied from desktop)
│   │   ├── binary.ts                  ✅
│   │   ├── dom.ts                     ✅
│   │   ├── index.ts                   ✅
│   │   ├── path.ts                    ✅
│   │   ├── speech.ts                  ✅
│   │   └── shortcuts.ts               ✅ Keyboard shortcut utilities
│   ├── ui/
│   │   ├── file-icon.tsx              ✅ Emoji icons for 50+ file types
│   │   └── index.ts                   ✅
│   ├── theme/                         ✅ Theme system
│   │   ├── types.ts                   ✅ TypeScript interfaces for themes
│   │   ├── parser.ts                  ✅ Theme JSON parser
│   │   ├── manager.ts                 ✅ Theme management and state
│   │   ├── css-properties.ts          ✅ CSS custom properties mapping
│   │   ├── index.ts                   ✅
│   │   └── themes/                    ✅ 24 theme JSON files
│   ├── pages/
│   │   └── index.tsx                  ✅ Full chat interface with message history
│   ├── index.tsx                      ✅ Created (main entry)
│   └── index.css                      ✅ 59 CSS custom properties for theming
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
- **Phase 3**: Advanced features and layout
  - File explorer with recursive tree view and git status indicators
  - File icon component with 50+ file type mappings
  - Header and sidebar layout components
  - Sessions list in sidebar with change counts
  - Theme switcher with light/dark mode and localStorage persistence
  - Keyboard shortcuts utility (Cmd/Ctrl+P, Cmd/Ctrl+N)
  - Toggle-able file explorer panel
  - Components: file-tree.tsx, header.tsx, sidebar.tsx, theme-switcher.tsx, file-icon.tsx, shortcuts.ts
  - Updated main page layout with integrated navigation
  - Successful production build (804KB main JS bundle)
- **Phase 4**: Theme system (PARTIALLY COMPLETE - visual application broken)
  - ✅ Theme infrastructure with all 24 TUI themes
  - ✅ Theme JSON parser with recursive color reference resolution
  - ✅ Theme manager with localStorage persistence and system theme detection
  - ✅ Theme context provider for app-wide theme state
  - ✅ Theme switcher dropdown with color swatches
  - ❌ **Theme colors NOT applying to UI** - CSS variable mismatch
  - Issue: TUI themes use different CSS variables than @opencode-ai/ui package
  - Fix: Phase 4.5 will map theme colors to UI package's 510 design tokens
- **Phase 4.5**: Theme integration fix (IN PROGRESS)
  - Map TUI theme colors to UI package CSS variables
  - Create intelligent mapping for 510 UI design tokens from 78 theme colors
  - Implement color interpolation for intermediate shades
  - Test all 24 themes for visual correctness
  - Ensure light/dark mode works properly

### 🚧 In Progress

- None currently

### 📋 Next Steps

1. **Immediate (Phase 4.5 - Fix Theme Integration)**
   - ⚠️ **Known Issue**: Theme selection works but colors don't apply visually
   - Create mapping between TUI theme colors and UI package design tokens
   - Map 78 theme colors to 510 UI CSS variables
   - Implement color interpolation for missing shades
   - Test all 24 themes visually
   - See Phase 4.5 section for detailed plan

2. **Phase 5: Remote Access & Server Discovery**
   - Server connection configuration UI
   - Settings panel for host/port configuration
   - Connection status indicator
   - localStorage persistence for server URL
   - Server-side `--host` flag support for binding to all interfaces
   - CORS configuration for remote access
   - Test connection functionality
   - Recent servers list

3. **Phase 6: Polish & Security**
   - Add authentication layer (optional for self-hosted)
   - Implement security best practices
   - Error handling and loading states
   - Responsive design improvements
   - Performance optimization
   - Accessibility improvements

4. **Phase 7: Deployment**
   - Production build optimization
   - Docker containerization
   - Deployment documentation
   - E2E testing
   - User documentation

## References

- Existing desktop app: `packages/desktop/`
- UI component library: `packages/ui/`
- OpenCode SDK: `packages/sdk/js/`
- Server implementation: `packages/opencode/src/server/server.ts`
- API documentation: `packages/web/src/content/docs/server.mdx`
