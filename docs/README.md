# Mahmoud Bekheet — Portfolio

A personal portfolio website for Mahmoud Bekheet Ibrahim (Senior Front-End Developer & Team Lead), built as a modern full-stack monorepo.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development Setup](#local-development-setup)
  - [Prerequisites](#prerequisites)
  - [Install Dependencies](#install-dependencies)
  - [Run the Portfolio (Frontend)](#run-the-portfolio-frontend)
  - [Run the API Server (Backend)](#run-the-api-server-backend)
  - [Run Everything Together](#run-everything-together)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database](#database)
- [Building for Production](#building-for-production)
- [Code Generation (API Types)](#code-generation-api-types)
- [Key Features](#key-features)
- [Animations](#animations)

---

## Project Overview

This is a **pnpm workspace monorepo** containing:

| Package | Description |
|---|---|
| `artifacts/portfolio` | React + Vite portfolio frontend |
| `artifacts/api-server` | Express 5 API backend (AI chat via Google Gemini) |
| `lib/db` | PostgreSQL database schema via Drizzle ORM |
| `lib/api-spec` | OpenAPI 3.1 spec (single source of truth for API) |
| `lib/api-zod` | Zod schemas generated from the OpenAPI spec |
| `lib/api-client-react` | React Query hooks generated from the OpenAPI spec |

---

## Tech Stack

### Frontend (Portfolio)
- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4** (utility-first styling with CSS custom properties)
- **Framer Motion** (scroll-triggered and enter animations)
- **Lucide React** (icons)
- **React Icons** (brand icons)

### Backend (API Server)
- **Express 5** + **TypeScript**
- **Google Gen AI SDK** (`gemini-2.5-flash` for the AI chat assistant — free tier)
- **Drizzle ORM** (PostgreSQL)
- **Pino** (structured logging)
- **Zod** (request/response validation)
- **esbuild** (fast bundler)

---

## Project Structure

```
workspace/
├── artifacts/
│   ├── portfolio/          # Frontend React app
│   │   ├── src/
│   │   │   ├── App.tsx         # Main app component (with animations)
│   │   │   ├── index.css       # Global styles & animation keyframes
│   │   │   ├── FloatingChat.tsx # AI chat widget
│   │   │   └── pages/
│   │   │       └── home.tsx    # Home page (legacy)
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── api-server/         # Backend Express API
│       ├── src/
│       │   ├── index.ts        # Server entry point
│       │   └── routes/
│       │       ├── chat.ts     # AI chat endpoint (Anthropic)
│       │       └── healthz.ts  # Health check endpoint
│       ├── build.mjs
│       └── package.json
│
├── lib/
│   ├── db/                 # Database layer
│   │   └── src/
│   │       └── schema/         # Drizzle ORM schema definitions
│   │
│   ├── api-spec/           # OpenAPI specification
│   │   └── openapi.yaml        # Source of truth for all API contracts
│   │
│   ├── api-zod/            # Auto-generated Zod schemas
│   └── api-client-react/   # Auto-generated React Query hooks
│
├── docs/                   # Project documentation (this file)
├── pnpm-workspace.yaml
└── package.json
```

---

## Local Development Setup

### Prerequisites

| Tool | Version | Notes |
|---|---|---|
| **Node.js** | 24+ | Required |
| **pnpm** | 10+ | `npm install -g pnpm` |
| **PostgreSQL** | 14+ | Required for the API server (chat history) |

### Install Dependencies

From the project root, install all packages across the monorepo in one command:

```bash
pnpm install
```

This installs dependencies for all packages (`portfolio`, `api-server`, `lib/*`) simultaneously.

---

### Run the Portfolio (Frontend)

The portfolio app requires two environment variables:

| Variable | Value (dev) | Description |
|---|---|---|
| `PORT` | `21113` | Port the Vite dev server listens on |
| `BASE_PATH` | `/` | URL base path prefix |

```bash
PORT=21113 BASE_PATH=/ pnpm --filter @workspace/portfolio run dev
```

The portfolio will be available at: **http://localhost:21113**

> **Note:** The portfolio dev server proxies `/api/*` requests to the API server at `http://localhost:8080` automatically (configured in `vite.config.ts`).

---

### Run the API Server (Backend)

The API server requires the following environment variables:

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port the server listens on (default: `8080`) |
| `GOOGLE_API_KEY` | Yes | Your Google AI Studio key for Gemini (free) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NODE_ENV` | No | `development` or `production` |

**Step 1** — Set environment variables. Create a `.env` file or export them:

```bash
export PORT=8080
export GOOGLE_API_KEY=AIza...
export DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
export NODE_ENV=development
```

**Step 2** — Run the API server in development mode (builds then starts):

```bash
pnpm --filter @workspace/api-server run dev
```

The API server will be available at: **http://localhost:8080**

**Available endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/healthz` | Health check |
| `POST` | `/api/chat` | AI chat (Google Gemini) |

---

### Run Everything Together

To run both the portfolio frontend and the API server simultaneously, open two terminal windows:

**Terminal 1 — API Server:**
```bash
export GOOGLE_API_KEY=AIza...
export DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
pnpm --filter @workspace/api-server run dev
```

**Terminal 2 — Portfolio Frontend:**
```bash
PORT=21113 BASE_PATH=/ pnpm --filter @workspace/portfolio run dev
```

Then open **http://localhost:21113** in your browser.

---

### Run with Docker (Recommended for Quick Local Setup)

The easiest way to run the full project locally is with Docker Compose — no need to install Node.js, pnpm, or PostgreSQL manually.

#### Prerequisites

| Tool | Notes |
|---|---|
| **Docker Desktop** | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) |
| **Google AI Studio API Key** | Get one for **free** from [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

#### Steps

**Step 1** — Copy the example env file:
```bash
cp .env.example .env
```

**Step 2** — Open `.env` and add your Google AI Studio API key:
```env
GOOGLE_API_KEY=AIza...
```

**Step 3** — Build and start all services:
```bash
docker compose up --build
```

Then open **http://localhost:3000** in your browser.

#### What Docker runs

| Service | Port | Description |
|---|---|---|
| `portfolio` | `3000` | React frontend (Vite build served by nginx) |
| `api-server` | `8080` | Express API + Google Gemini AI chat |
| `postgres` | `5432` | PostgreSQL database |

> **Note:** The nginx server inside the portfolio container automatically proxies `/api/*` requests to the API server — no extra configuration needed.

#### Stop all services

```bash
docker compose down
```

To also delete the database volume:
```bash
docker compose down -v
```

#### About the Google API key

On **Replit**, the AI chat uses Replit's built-in Gemini integration (no key needed — auto-provisioned via the AI Integrations proxy).

For **local Docker**, get a **free** API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Google's free tier includes generous quotas for `gemini-2.5-flash` — no credit card required.

---

## Environment Variables

### Portfolio Frontend (`artifacts/portfolio`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | **Yes** | Dev server port (e.g. `21113`) |
| `BASE_PATH` | **Yes** | URL base path (e.g. `/`) |
| `API_SERVER_URL` | No | Override API proxy target (default: `http://localhost:8080`) |

### API Server (`artifacts/api-server`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | **Yes** | Server port (default: `8080`) |
| `GOOGLE_API_KEY` | **Yes** (local) | Google AI Studio key for Gemini. On Replit, this is auto-provided via `AI_INTEGRATIONS_GEMINI_*` |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string |
| `NODE_ENV` | No | `development` \| `production` |

> **Security:** Never commit API keys or secrets to version control. Use environment variables or a secrets manager.

---

## API Reference

### `GET /api/healthz`

Returns server health status.

**Response:**
```json
{ "status": "ok" }
```

---

### `POST /api/chat`

Send a message to the AI chat assistant (powered by Google Gemini 2.5 Flash).

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "What is Mahmoud's experience?" }
  ]
}
```

**Response (streaming):**
Server-Sent Events (SSS) stream with text chunks.

**Response (non-streaming):**
```json
{
  "message": "Mahmoud has 5+ years of experience..."
}
```

---

## Database

The project uses **PostgreSQL** managed via **Drizzle ORM**.

### Schema location
```
lib/db/src/schema/index.ts
```

### Push schema changes (dev only)

```bash
pnpm --filter @workspace/db run push
```

> This applies your schema directly to the database without a migration file. For production, use migrations.

### Type check the database layer

```bash
pnpm --filter @workspace/db run typecheck
```

---

## Building for Production

### Build everything

```bash
pnpm run build
```

This runs `typecheck + build` across all packages in the correct dependency order.

### Build only the portfolio frontend

```bash
pnpm --filter @workspace/portfolio run build
```

Output: `artifacts/portfolio/dist/public/`

### Build only the API server

```bash
pnpm --filter @workspace/api-server run build
```

Output: `artifacts/api-server/dist/index.mjs`

### Run the API server in production

```bash
PORT=8080 NODE_ENV=production node --enable-source-maps artifacts/api-server/dist/index.mjs
```

---

## Code Generation (API Types)

The project uses **OpenAPI → Zod + React Query** code generation via [Orval](https://orval.dev/).

**Source of truth:** `lib/api-spec/openapi.yaml`

When you change the OpenAPI spec, regenerate the client code:

```bash
pnpm --filter @workspace/api-spec run codegen
```

This regenerates:
- `lib/api-zod/` — Zod validation schemas
- `lib/api-client-react/` — React Query hooks

> Do not edit the generated files manually — they are overwritten on each codegen run.

---

## Key Features

- **AI Chat Assistant** — Floating chat widget powered by Anthropic Claude Haiku, pre-trained with Mahmoud's professional context
- **Dark / Light Theme** — CSS-first with `localStorage` persistence and system preference detection (zero flash)
- **Dot Grid Background** — Ambient radial dot pattern using CSS custom properties
- **Scroll-Triggered Animations** — Sections animate in as they enter the viewport using Framer Motion + IntersectionObserver
- **Responsive Design** — Mobile-first layout with Tailwind CSS

---

## Animations

Animations are inspired by the [cv-santiago](https://github.com/MoBekheet/cv-santiago) project.

### BeamPill

The hero badge uses a custom `BeamPill` component that emits floating heal particles (`+`, `·`, `✦`, `0`, `1`) that drift upward and fade out — creating a "live system" feel.

```tsx
<BeamPill>Senior Front-End Developer & Team Lead</BeamPill>
```

CSS keyframe: `heal-float` (defined in `index.css`)

### Typewriter Text

A React-based cycling animation that types and deletes words one character at a time, with a blinking `|` cursor. Cycles through a list of role titles.

```tsx
<TypewriterText />
// cycles: Senior Front-End Developer → Team Lead → Angular Expert → ...
```

Implemented via `useTypingCycle` hook in `App.tsx` using `useState` + `setTimeout`.

### Hero Glow Orbs

Two ambient orbs in the hero background breathe slowly using the `hero-glow` keyframe, creating a cyberpunk ambient lighting effect.

### Shimmer Glow

Cards and interactive elements use the `shimmer-glow` keyframe to pulse with a primary/accent color glow on interaction.

CSS class: `animate-shimmer`

### Other Keyframes

| Keyframe | Class | Usage |
|---|---|---|
| `nav-fade-in-anim` | `animate-nav-fade-in` | Navigation bar entrance |
| `page-fade-in` | `animate-page-fade-in` | Page-level fade in |
| `slide-up-fade` | `animate-slide-up` | Section entry animations |
| `incoming-pulse` | `animate-incoming-pulse` | CTA button attention pulse |
| `pulse-dot` | `animate-pulse-dot` | "Current" job indicator dot |
| `blink` | `.streaming-cursor` | AI chat streaming cursor |
| `hash-highlight` | `.hash-highlight` | Hash anchor highlight flash |
