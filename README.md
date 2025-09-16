# Video Editor App

A clean, modern video editor built with Electron, React, TypeScript, and Tailwind CSS.

## Features

- **Modern Stack**: Built with React 18, TypeScript, and Tailwind CSS
- **Cross-Platform**: Runs on Windows, macOS, and Linux
- **Developer Experience**: Hot reload, ESLint, and Vite for fast development

## Design Guidelines

- **Color Palette**: Use Tailwind's zinc color palette for consistent UI theming

## Prerequisites

- Node.js (version 16 or higher)
- npm

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

This will start both the Electron main process and the React renderer with hot reload.

## Building

Build the application for production:

```bash
npm run build
```

## Packaging

Create distributable packages:

```bash
npm run package
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start the built application
- `npm run package` - Create distributable packages
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm test` - Run tests

## Project Structure

```
src/
├── main/           # Electron main process
│   ├── main.ts     # Main process entry point
│   └── preload.ts  # Preload script
└── renderer/       # React renderer process
    ├── App.tsx     # Main React component
    ├── index.tsx   # Renderer entry point
    └── index.css   # Tailwind CSS imports
```

