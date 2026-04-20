# Workspace

## Portfolio

`artifacts/portfolio` — Personal portfolio site for **Mahmoud Bekheet Ibrahim** (Senior Front-End Developer & Team Lead).

- Design inspired by cv-santiago: dot grid background, cyan/purple cyber theme, Space Grotesk + DM Sans fonts
- Sections: Hero, Experience timeline, Projects, Tech Stack, Education & Certifications, Contact
- Theme: Tailwind CSS v4 with CSS custom properties (dark/light toggle, persists to localStorage)
- Animations: Framer Motion scroll-triggered entrance animations
- No router needed — single-page portfolio
- Key files: `src/App.tsx`, `src/index.css`, `index.html`

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
