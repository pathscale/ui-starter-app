# Solid.js Starter Kit

A comprehensive starter kit for Solid.js applications with common structure and utilities from pays.online and honey.id.

## Features

- 🚀 Built with [Solid.js](https://www.solidjs.com/)
- 🧰 [RSBuild](https://rsbuild.dev/) for fast builds and development
- 🎨 [TailwindCSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/) for styling
- 🔄 [TanStack Query](https://tanstack.com/query/latest) for data fetching
- 📝 [Modular Forms](https://modularforms.dev/) for form handling
- 🌙 Light/Dark mode with theme persistence
- 🔔 Toast notifications system
- 🧩 Common components and layouts
- 🪝 Reusable hooks for data fetching and mutations
- 🔧 [Biome](https://biomejs.dev/) for linting and formatting

## Directory Structure

```
src/
├── assets/        # Static assets like images, fonts, etc.
├── components/    # Reusable UI components
│   └── forms/     # Form-related components
├── hooks/         # Custom hooks
├── layouts/       # Page layouts
├── lib/           # Utility libraries
├── models/        # Data models and types
├── services/      # Service layer for API interactions
├── stores/        # Global state management
├── styles/        # Global styles and theme definitions
│   └── themes/    # Theme-specific styles
└── utils/         # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/solid-starter-kit.git
cd solid-starter-kit

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start the development server
npm run dev
# or
bun dev
```

### Building for Production

```bash
# Build the app for production
npm run build
# or
bun build
```

### Preview Production Build

```bash
# Preview the production build
npm run preview
# or
bun preview
```

## License

MIT
