# Solid.js Starter Kit

A comprehensive starter kit for Solid.js applications with a feature-based architecture and modern tooling.

## Architecture Overview

This starter kit provides a solid foundation for building modern web applications with Solid.js, featuring:

### Core Components

#### 1. Feature-based Structure (`src/features/`)

Organizes code by domain features:

- Authentication (`auth/`)
- Home and landing pages (`home/`)
- Each feature contains its own pages, components, and hooks

#### 2. Shared Components (`src/components/`)

Reusable UI elements:

- Toast notifications
- Form elements
- Layout components

#### 3. Layouts (`src/layouts/`)

Page layout templates:

- Public layout for unauthenticated pages
- Auth layout for login/signup forms

#### 4. State Management (`src/stores/`)

Global state management:

- Toast notifications store
- Theme preferences

#### 5. Utility Hooks (`src/hooks/`)

Custom hooks for common patterns:

- Query hooks for data fetching
- Action hooks for mutations
- Standardized hook patterns

### Styling System

The application uses a modern CSS approach:

```css
/* Theme configuration */
@theme {
  --color-telegram: oklch(67% 0.136 236.45);
  --color-telegram-content: oklch(100% 0 0);
}

/* Base styles */
@layer base {
  html {
    scroll-behavior: smooth;
  }
}
```

### Theme Support

Built-in light and dark mode:

- Theme detection based on system preferences
- Manual theme toggle
- Theme persistence in localStorage

### Key Features

- **Modern Build System**: RSBuild for fast development and optimized production builds
- **Type Safety**: Full TypeScript support throughout the application
- **Styling**: TailwindCSS and DaisyUI for rapid UI development
- **Data Fetching**: TanStack Query for efficient data management
- **Forms**: Modular Forms for form state management
- **Code Quality**: Biome for linting and formatting

## Getting Started

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev
# or
bun dev
```

### Production

```bash
# Build for production
npm run build
# or
bun build

# Preview production build
npm run preview
# or
bun preview
```

### Code Quality

```bash
# Type checking
npm run typecheck
# or
bun typecheck

# Linting
npm run lint
# or
bun lint

# Formatting
npm run format
# or
bun format
```
