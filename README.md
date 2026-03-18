# Time Track It

### The hassle-free, offline time tracker.

**[Get Started!](https://timetrackit.amissaglia.dev.br/)**

![Time Track It screenshot](src/assets/home.png)
![Reports screenshot](src/assets/report.png)

## Features

- **One-click timer** — describe what you're working on and hit Start
- **Project tagging** — use `#project` inline to tag entries automatically
- **Import / Export JSON** — back up or move your data anytime
- **100% offline** — all data stored locally in your browser via IndexedDB, no account needed
- **Reports** - visualize your time across projects and periods.

## Tech Stack

- [Vue 3](https://vuejs.org/)
- [Vite](https://vite.dev/)
- [Dexie.js](https://dexie.org/) (IndexedDB)
- [Chart.js](https://www.chartjs.org/) (Reports)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Output goes to `docs/` and can be served as a static site (e.g. GitHub Pages).
