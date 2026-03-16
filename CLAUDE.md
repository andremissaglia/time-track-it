# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Build to docs/ (for GitHub Pages)
npm run preview  # Preview production build
```

## Architecture

**Time Track It** is a 100% offline, browser-based time tracker. No backend — all data lives in IndexedDB via Dexie.js.

### Stack
- **Vue 3** (Composition API, `<script setup>`) + **Vite**
- **Dexie.js** for IndexedDB: two tables — `timeEntries` and `activeTimer`
- Build output goes to `docs/` (GitHub Pages deployment)

### State Management
Three composables in `src/composables/` handle all state — no Vuex/Pinia:
- `useTimer` — active timer lifecycle, persists to `activeTimer` table, ticks every second
- `useTimeEntries` — CRUD for `timeEntries`, groups by date for display
- `useProjects` — computed aggregation of time per project, used for autocomplete and summary

`App.vue` owns all composable instances and passes data/handlers down to components as props/events.

### Key Behaviors
- **Project tagging**: regex `/^#(\w+)/` on description — first hashtag becomes the project name
- **Delete confirmation**: 3-second cancellable timeout before actual deletion
- **Color assignment**: `src/utils/colors.js` uses a string hash for deterministic, consistent project colors
- **Export format**: JSON array; `id` is stripped on import so Dexie assigns new IDs
