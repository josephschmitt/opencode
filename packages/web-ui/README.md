# OpenCode Web UI

Web-based interface for OpenCode that provides full functionality parity with the terminal UI.

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build for production
bun run build

# Preview production build
bun run serve
```

## Connecting to OpenCode Server

The web UI connects to an OpenCode server instance. By default, it connects to `http://127.0.0.1:4096`.

You can override this by:

1. Using environment variables:

   ```bash
   VITE_OPENCODE_SERVER_HOST=localhost VITE_OPENCODE_SERVER_PORT=8080 bun dev
   ```

2. Using URL parameter:
   ```
   http://localhost:3001/?url=http://your-server:port
   ```

## Features

- Session management (list, create, delete, switch)
- Chat interface with streaming responses
- Rich message rendering (text, code, diffs)
- Syntax highlighting
- File attachment support
- Context management
- Real-time updates via SSE

## Architecture

Built with:

- SolidJS
- TypeScript
- Vite
- Tailwind CSS
- @opencode-ai/sdk
- @opencode-ai/ui
