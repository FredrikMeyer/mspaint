# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn install` - Install dependencies
- `yarn start` - Start development server with host binding
- `yarn build` - Type check and build for production
- `yarn typecheck` - Run TypeScript type checking
- `yarn lint` - Run ESLint on TypeScript/JavaScript files
- `yarn stylelint` - Run Stylelint on CSS/SCSS files
- `yarn prettier` - Check code formatting

## Architecture

This is a React-based MS Paint clone that recreates the classic Windows Paint interface. The application is built with TypeScript and uses Vite as the build tool.

### Core Components Structure
- **App.tsx** - Main application container managing global state (colors, tools, canvas dimensions)
- **Canvas.tsx** - Primary drawing canvas component
- **Toolbar.tsx** - Left sidebar with drawing tools (pencil, brush, fill, etc.)
- **ColorPicker.tsx** - Color selection interface
- **Menu.tsx** - Top menu bar with File/About/etc options
- **TopBar.tsx** - Window title bar

### Key Technical Details

**Canvas Management:**
- Uses HTML5 Canvas API with device pixel ratio scaling for crisp rendering on high-DPI displays
- Canvas dimensions are dynamically calculated using ResizeObserver
- Drawing operations handle both foreground drawing canvas and background reference canvas

**Styling:**
- SCSS with CSS Modules for component-scoped styling
- PostCSS pipeline with nesting, autoprefixer, and CSS Modules values
- Shared variables in `_common.scss`

**State Management:**
- React hooks for local state management
- Custom hooks for canvas dimensions (`useCanvasDimension`) and keyboard shortcuts (`useClearCanvasByKey`)
- Canvas scaling handled by `useScaleByDevicePixelRatio` hook in `canvasUtils.ts`

**Drawing Tools:**
- Tool types defined in `types.ts`
- Flood fill algorithm implemented in `floodFill.ts`
- Canvas utilities for pixel manipulation and scaling

The application mimics Windows 3.1 Paint aesthetics and functionality, including the classic toolbar icons and color palette.