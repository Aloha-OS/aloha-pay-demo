# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Production build
npm run test         # Run tests with Vitest
npm run lint         # Lint with Biome
npm run format       # Format with Biome
npm run check        # Biome check (lint + format)
```

## Adding Shadcn Components

```bash
pnpm dlx shadcn@latest add <component-name>
```

Shadcn is configured with:
- Style: new-york
- Base color: zinc
- Components go in `@/components/ui`
- Uses Lucide icons

## Architecture

**TanStack Start Application** - This is a full-stack React app using TanStack Start with SSR capabilities.

### Key Files
- `src/router.tsx` - Router setup with TanStack Query integration
- `src/routes/__root.tsx` - Root layout with devtools configuration
- `src/routeTree.gen.ts` - Auto-generated route tree (do not edit)
- `src/integrations/tanstack-query/root-provider.tsx` - QueryClient setup

### Routing
File-based routing in `src/routes/`:
- Route files define pages (e.g., `index.tsx` for `/`)
- API routes use `.ts` extension (e.g., `api.names.ts`)
- Nested routes use dot notation (e.g., `start.ssr.full-ssr.tsx` → `/start/ssr/full-ssr`)

### Path Aliases
`@/*` maps to `./src/*` (configured in tsconfig.json and vite.config.ts)

### Code Style
- Biome for linting/formatting
- Tabs for indentation
- Double quotes for strings
- Files prefixed with `demo` are examples and can be deleted
