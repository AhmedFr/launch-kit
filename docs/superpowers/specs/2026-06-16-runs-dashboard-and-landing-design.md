# Landing Page + Runs Dashboard — Design

**Date:** 2026-06-16
**Status:** Approved

## Goal

Add a marketing **landing page** and a **runs dashboard** that lists previously-analyzed
project folders and lets you start a new one. No backend, no database — everything persists
in `localStorage`.

## Decisions

- **Routing:** real Next App Router routes. `/` = landing, `/runs` = dashboard, `/runs/[id]` = wizard.
- **Run identity:** one run per folder path. Re-analyzing a known folder reopens its existing run.
  Each run still carries a short id for its `/runs/[id]` URL.
- **Landing scope:** full marketing page (hero, how-it-works, platforms, closing CTA). Primary CTA → `/runs`.

## Routes & layout

```
app/
  layout.tsx            root: fonts + Toaster only (AppHeader removed from here)
  page.tsx              LANDING
  runs/
    layout.tsx          app chrome: AppHeader (logo → /, link to /runs)
    page.tsx            DASHBOARD: "New run" + one card per past folder
    new/page.tsx        NEW RUN: folder-select; on analyze → resolve/create run → /runs/[id]
    [id]/page.tsx       WIZARD: review → kit (today's page.tsx logic), hydrated by id
```

- The global `WizardProvider` is removed from the root layout; state is per-run, loaded by `[id]`.
  The wizard child components (`FolderSelect`, `ContextReview`, `PostKit`) already take props, so the lift is clean.
- Landing has its own in-page marketing nav; `/runs/*` share `AppHeader`.

## Data model & state (localStorage)

Store key `launch-kit:runs` = `Record<id, Run>`:

```ts
type Run = {
  id: string                 // crypto.randomUUID → used in /runs/[id]
  path: string               // folder path = identity (one run per folder)
  step: WizardStep
  context: ProjectContext | null
  refinements: Refinements
  generation: Generation | null
  createdAt: number
  updatedAt: number
}
```

- **`lib/runs/store.ts`** — localStorage CRUD: `listRuns()` (sorted by `updatedAt` desc), `getRun(id)`,
  `findByPath(path)`, `upsertRun(run)`, `deleteRun(id)`, `createRun(path, context)`. Unit-tested against jsdom localStorage (TDD).
- **One-per-folder enforcement:** analyzing a folder calls `findByPath(path)`. Match → navigate to the existing
  run (no duplicate). No match → create a new run. Applies to the New-run flow and to re-pointing an existing run.
- **Legacy migration:** on first store read, if the old `ph-launch-kit` key holds a run with a path, fold it in as a
  `Run`, then delete the old key. The user's current in-progress kit then appears in `/runs`.
- **Hooks:** `useRun(id)` hydrates a run into the existing `wizardReducer` and persists changes back (bumping
  `updatedAt`); `useRunsList()` returns the dashboard list. Reducer logic is reused unchanged, scoped to a run.

## Pages & UX

- **Landing (`/`):** hero (headline + subhead + `Open your runs →`), how-it-works 3-step strip
  (Point at a folder → Review context → Per-platform kits), 4 platform badges, closing CTA.
- **Dashboard (`/runs`):** a prominent **New run** card first, then a card per folder showing product name,
  folder path, relative "updated" time, status (`Draft` / `Context ready` / `Kit ready`), and badges for which
  platforms generated. Card → `/runs/[id]`; each has a delete (with confirm). Empty state = friendly nudge + New run.
- **New run (`/runs/new`):** the existing `FolderSelect`; on analyze, resolve-or-create the run, push to `/runs/[id]`.
- **Wizard (`/runs/[id]`):** today's folder → review → kit experience, now reading/writing one run.
  "Start over" returns to `/runs` instead of resetting in place.

## Testing

- TDD `lib/runs/store.ts`: CRUD, `findByPath` dedupe, sort order, legacy migration.
- Existing `wizardReducer` tests stay green.
- Pages/landing follow the repo's no-component-test convention; verified via typecheck + build + browser smoke test.

## Out of scope (YAGNI)

- Renaming runs, tags/search, run duplication, export of the run list.
- Server/DB persistence, auth, multi-device sync.
- Multiple runs per folder (explicitly chosen against).
