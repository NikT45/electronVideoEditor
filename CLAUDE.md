# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (runs both main and renderer processes)
- `npm run build` - Build for production (builds both main and renderer)
- `npm run start` - Start the built application
- `npm run package` - Create distributable packages
- `npm run test` - Run tests with Vitest
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## Architecture Overview

This is an Electron application with a dual-process architecture:

### Main Process (`src/main/`)
- **main.ts**: Entry point, creates BrowserWindow, handles app lifecycle
- **preload.ts**: Secure bridge between main and renderer processes via contextBridge
- Compiled with TypeScript directly to `dist/` directory
- Uses CommonJS modules (target: ES2020, module: commonjs)

### Renderer Process (`src/renderer/`)
- **App.tsx**: Main React component
- **index.tsx**: React application entry point
- **index.css**: Tailwind CSS imports
- Built with Vite to `dist/renderer/` directory
- Uses modern React 18 with TypeScript and JSX

## Key Configuration

### Build System
- **Main Process**: Direct TypeScript compilation
- **Renderer Process**: Vite with React plugin
- **Development**: Concurrent processes with hot reload on port 5173
- **Production**: Static file serving from dist/renderer/

### Security Model
- Context isolation enabled
- Node integration disabled
- Remote module disabled
- Secure IPC communication via preload script

### Styling
- Tailwind CSS configured for renderer files
- Use zinc color palette for consistent theming
- Content scanning: `./index.html`, `./src/renderer/**/*.{js,ts,jsx,tsx}`

## Project Structure

```
src/
├── main/           # Electron main process
│   ├── main.ts     # App lifecycle, window management, menus
│   └── preload.ts  # Secure IPC bridge with electronAPI
└── renderer/       # React renderer process
    ├── App.tsx     # Main UI component
    ├── index.tsx   # React root setup
    └── index.css   # Tailwind imports
```

## Development Notes

- Main process loads renderer from localhost:5173 in development
- Production builds serve static files from dist/renderer/
- IPC communication happens through electronAPI exposed in preload
- ESLint configured for React, TypeScript, and Electron environments
- Tests run with Vitest
- Application menu includes File and View menus with standard Electron roles