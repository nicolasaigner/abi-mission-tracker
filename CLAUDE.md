# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mission tracker for Arena Breakout: Infinite (ABI), written in PT-BR. Two seasons co-exist in this repo and are deployed together to GitHub Pages under `nicolasaigner.github.io/abi-mission-tracker/`:

| Directory | Stack | URL path |
|---|---|---|
| `temporada-4/` | Vanilla HTML/CSS/JS | `/temporada-4/` |
| `temporada-5/` | Angular 21 | `/temporada-5/` |

The root `README.md` is a Markdown mission log (Season 4), not a developer guide.

## Commands

All Angular commands must be run from inside `temporada-5/`:

```bash
cd temporada-5
npm start          # dev server at localhost:4200
npm run build      # production build → dist/temporada-5-app/browser/
npm test           # Vitest unit tests
```

Single-component scaffold:
```bash
ng generate component components/my-component
```

## Architecture — Temporada 5 (Angular)

**Entry point:** `src/main.ts` bootstraps `App` with `appConfig`.

**Data flow:**
1. `MissionService` fetches `public/missoes.json` via `HttpClient` on app init.
2. All state lives as Angular signals on `MissionService` (singleton, `providedIn: 'root'`).
3. Components are purely presentational — they inject `MissionService` and react to signals.

**Key signals in `MissionService`:**
- `data` — raw `MissionData` from JSON
- `completedIds` — `Set<string>` persisted to `localStorage` (key: `abi-tracker-s5`)
- `objectiveProgress` — per-objective counters, persisted separately (key: `abi-tracker-s5-obj`)
- `filter` — current `FilterState` (status/map/search/teamOnly)
- Computed: `allMissions`, `totalCount`, `doneCount`, `progressPercent`, `mapLocations`

**Mission ID format:** `p{part}-l{lane}-c{col}` (0-indexed). Deep-link via URL hash `#p1-l1-m1` (1-indexed) also supported.

**Component tree:**
```
App
├── Header          — progress stats, export/reset buttons
├── Controls        — filter bar
├── QuickNav        — jump to part/lane
├── MissionBoard    — renders Parts
│   └── MissionLane → MissionCard (per mission)
├── ExtrasSection   — items-to-keep and distorted valley info
├── MissionModal    — objective detail overlay
└── Toast           — transient notifications
```

**Data model** (`src/app/models/mission.model.ts`):
- `MissionData` — top-level JSON shape (`partes[]` → `Trilha[]` → `Mission[]`)
- `Mission.id` — unique key, used as HTML element id for scroll/highlight
- `parseQuantity(text)` — extracts numeric target from objective text (strip currency/time/item codes before matching)
- `ObjectiveProgress` — `{ checked, current, target }` per objective

## Architecture — Temporada 4 (Vanilla JS)

Static site in `temporada-4/docs/`. Mission data is embedded in `js/missions-data.js` (not fetched) to avoid CORS issues with `file://`. Modules: `db.js` (localStorage), `app.js` (orchestration), `ui.js` (DOM), `utils.js` (helpers).

## Angular Conventions (from project rules)

- **Standalone components only** — do NOT set `standalone: true` in decorators (it's the default in v20+)
- **Signals** for all state — use `update()`/`set()`, never `mutate()`
- **`ChangeDetectionStrategy.OnPush`** on every component
- **`inject()`** instead of constructor injection
- **`input()` / `output()`** functions instead of `@Input` / `@Output` decorators
- **Native control flow** — `@if`, `@for`, `@switch` instead of `*ngIf`/`*ngFor`
- **`class` bindings** instead of `ngClass`; **`style` bindings** instead of `ngStyle`
- **`NgOptimizedImage`** for static images (does not work with inline base64)
- Reactive forms preferred over template-driven
- `host` object inside `@Component`/`@Directive` instead of `@HostBinding`/`@HostListener`
- All WCAG AA accessibility requirements must pass AXE checks
