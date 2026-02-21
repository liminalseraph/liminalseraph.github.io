# CLAUDE.md

This file documents the codebase structure, development conventions, and workflows for AI assistants working on this project.

## Project Overview

A minimalist personal portfolio site built as a single-page application (SPA). The defining UI metaphor is a **folder stack**: white-outlined folders stacked diagonally on a pure black background. Clicking a folder launches it upward off-screen and transitions into a page view. The design spec lives in `SPEC.md`.

**Live site:** Deployed to GitHub Pages at `liminalseraph.github.io`.

## Tech Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.1 |
| UI | React | 19.2.3 |
| Styling | Tailwind CSS | v4 |
| Language | TypeScript | ^5 |
| Linting | ESLint (flat config) | ^9 |
| Package manager | Yarn | (yarn.lock present) |
| Deployment | GitHub Pages via GitHub Actions | — |

## Directory Structure

```
/
├── app/
│   ├── data/
│   │   └── items.ts        # Static content arrays (projects, research, blog)
│   ├── favicon.ico
│   ├── globals.css         # All styles: CSS variables, BEM classes, animations, media queries
│   ├── layout.tsx          # Root layout: Space Grotesk font, metadata, html/body shell
│   └── page.tsx            # Entire SPA: HomeView + PageView + PageDetails component
├── public/                 # Static assets (SVGs)
├── .github/
│   └── workflows/
│       └── nextjs.yml      # CI/CD: build → deploy to GitHub Pages on push to main
├── SPEC.md                 # Design specification (source of truth for UI decisions)
├── next.config.ts          # Next.js config (currently default)
├── tsconfig.json           # TypeScript config (strict, path alias @/* → ./*)
├── eslint.config.mjs       # ESLint flat config (extends next/core-web-vitals)
└── postcss.config.mjs      # PostCSS config (Tailwind v4 plugin)
```

## Development Commands

```bash
yarn dev      # Start dev server at localhost:3000 with hot reload
yarn build    # Production build (outputs static files to ./out/)
yarn start    # Serve production build locally
yarn lint     # Run ESLint
```

Always use **Yarn** (not npm). The project uses `yarn.lock`.

## Architecture

### Single-file SPA

All application logic lives in `app/page.tsx`. This is intentional — the site is small. Do not split into separate route segments or page files unless the content grows substantially.

**Components in `page.tsx`:**
- `Home` (default export) — root component managing all state and rendering both views
- `PageDetails` — renders the split list/detail layout for Projects, Research, and Blog

### State model

```ts
activePage: string | null   // Which page is open (null = home)
launching: string | null    // Which folder is mid-launch animation
pageVisible: boolean        // Controls page-view opacity/pointer-events
selectedId: string | null   // Which list item is selected in detail view
```

Animation is CSS-driven via class toggles (`.is-launching`, `.is-dimmed`, `.is-visible`). JavaScript only sets state; CSS handles all transitions.

### Data layer

Content is defined as static TypeScript arrays in `app/data/items.ts`. There is no backend, API, or CMS.

```ts
export type DetailItem = {
  id: string;       // kebab-case unique identifier
  title: string;
  year: number;
  logoText: string; // 2-char abbreviation for the logo box
  summary: string;
  imageLabel: string;
};

export const projects: DetailItem[] = [...];
export const research: DetailItem[] = [...];
export const blog: DetailItem[] = [...];
```

To add content: append items to the relevant array in `items.ts`. Items are sorted descending by `year` at render time via `sortByYear()`.

## CSS Conventions

### CSS variables (defined in `:root` in `globals.css`)

| Variable | Value | Purpose |
|---|---|---|
| `--background` | `#000` | Page and folder fill |
| `--foreground` | `#fff` | Text and stroke color |
| `--page-overlay` | `rgba(0,0,0,0.82)` | Semi-transparent page view background |
| `--stroke-width` | `2px` | Folder SVG stroke |
| `--stack-offset-x` | `28px` | Per-folder horizontal stack offset |
| `--stack-offset-y` | `36px` | Per-folder vertical stack offset |
| `--lift-y` | `-18px` | Folder hover lift distance |
| `--launch-duration` | `560ms` | Folder launch + page fade timing |
| `--launch-ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | Easing for launches |
| `--fade-duration` | `280ms` | Shorter UI fades |

Folder position offsets are set as **inline CSS custom properties** per element:

```tsx
style={{
  "--offset-x": `${index * 28}px`,
  "--offset-y": `${index * 36}px`,
  "--stack-index": `${index + 1}`,
} as React.CSSProperties}
```

### Class naming

Classes follow a **BEM-adjacent** pattern. Use semantic, component-scoped names — not Tailwind utilities for component layout (Tailwind is imported but scarcely used in current markup).

| Pattern | Examples |
|---|---|
| Block | `.folder`, `.page-view`, `.split-layout` |
| Element | `.folder__body`, `.folder__label`, `.folder__svg` |
| State modifier | `.is-launching`, `.is-dimmed`, `.is-visible`, `.is-active` |

### Animation approach

All motion is handled entirely in CSS. JavaScript toggles class names; CSS transitions/transforms do the work.

- `will-change: transform` is set on `.folder__body` for GPU compositing
- `prefers-reduced-motion: reduce` overrides all transition durations to `1ms` and suppresses the launch translate
- Never use `setTimeout`-based animation orchestration for visual effects — only use timers to sequence state changes after CSS transitions complete

## TypeScript Conventions

- Strict mode is enabled (`"strict": true` in tsconfig)
- Use the `@/*` path alias for imports from the project root
- Inline style objects with custom properties require `as React.CSSProperties`
- All exported data types live in `app/data/items.ts`
- The `"use client"` directive is required on `page.tsx` (uses hooks and browser APIs)

## Accessibility Requirements

These must be maintained when making changes:

- `aria-hidden` toggles on `.home-view` / `.page-view` to reflect which view is active
- `pointer-events: none` on hidden views (not just `display: none`)
- `.sr-only` utility class for screen-reader-only text (e.g. "Back" label on the back button)
- `focus-visible` outlines on all interactive elements
- Keyboard: **Escape** key closes the page view and returns to home
- SVG folders include `role="img"` and `aria-label`
- `prefers-reduced-motion` media query must be respected for any new animations

## Deployment

The site is a **static export** deployed to GitHub Pages.

- **Trigger:** Any push to `main` branch
- **Output directory:** `./out/`
- **GitHub Actions workflow:** `.github/workflows/nextjs.yml`
  - Detects Yarn automatically
  - Node.js 20
  - Caches Next.js build artifacts
  - Deploys via `actions/deploy-pages`

Do not add server-side features (API routes, server components with data fetching, etc.) without also updating the deployment pipeline to support them. The current config assumes a fully static output.

## Key Design Decisions

- **All styles in one file (`globals.css`)** — the site is small enough that splitting is premature
- **All app logic in one file (`page.tsx`)** — same rationale
- **No routing** — Next.js App Router is used for its build system and layout conventions, but there is only one route (`/`)
- **CSS-driven animation** — state machines in JS, visuals entirely in CSS
- **Static data** — no CMS or API; content lives in `items.ts` and is committed directly
- **Space Grotesk** — loaded via `next/font/google`, referenced via `--font-space-grotesk` CSS variable

## Adding a New Section

To add a new folder/page (e.g. "Notes"):

1. Add the label string to the `folders` array in `page.tsx`
2. If it needs list/detail content, add a corresponding `DetailItem[]` array in `items.ts` and export it
3. Handle the new page name in the `activePage` conditional inside `<main>` in `page.tsx`
4. No CSS changes needed for the folder itself — offsets and z-index are computed from the array index
