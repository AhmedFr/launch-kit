# Product Hunt Launch Kit — Design

**Date:** 2026-06-15
**Status:** Approved (ready for implementation planning)

## Summary

A local Next.js app, themed after Product Hunt, that turns a project folder
(README + supporting files) into a complete "launch kit" for a great Product
Hunt post: name and tagline options, description, recommended topics, the
maker's first comment, a gallery shot list, a demo-video storyboard, and
launch-day operations. Media is **guided, not generated** — the app tells the
user exactly which images and video scenes to create and add.

The user picks a project folder by giving a local path; a Next.js server route
reads it. AI generation is abstracted behind a provider interface: a deterministic
**mock provider** ships first (works with no API key), and an **OpenRouter
provider** is wired in later.

## Goals

- Point the app at a project folder and get a full, copy-ready PH launch kit.
- Make output quality high by letting the user review/edit the extracted context
  and add launch intent (angle, audience, goal, tone) before generating.
- Work end-to-end with **no API key** (mock provider) so the UI is fully usable
  from day one.
- Keep media as actionable specs the user produces themselves.

## Non-Goals (v1)

- Generating actual images or video (only shot lists / storyboards).
- Posting to Product Hunt or any API integration with PH.
- Multi-user, auth, or persistence beyond `localStorage`.
- Dark mode (light mode only for v1).

## Stack & Conventions

- **Next.js (App Router) + TypeScript + Tailwind + shadcn/ui**, **pnpm**.
- **Theme:** Product Hunt coral accent (`#FF6154`), upvote-triangle motifs,
  rounded cards, soft shadows, Inter/Geist type. Light mode only for v1.
- **Component convention:** each component lives in its own folder with
  `index.ts`, `Component.tsx`, `Component.types.ts`, and optionally
  `Component.constants.ts` / a test file. Long files are split — layout vs. logic
  vs. utils. Single responsibility per file.
- **State:** wizard state in a `WizardProvider` (React Context + `useReducer`,
  no extra state library). Last successful context + kit cached to `localStorage`.

## User Flow (3-step wizard → Post Kit)

Single route `/`. The wizard advances through three steps; the third is the
rich result view.

1. **Select folder** — input for an absolute path + "Analyze" button.
   Calls `POST /api/analyze`. Shows loading + friendly errors.
2. **Review context** — renders the extracted `ProjectContext` as **editable**
   fields, plus inputs the user fills in: launch **angle**, **audience**,
   **goal**, **tone**. "Generate Post Kit" → `POST /api/generate`.
3. **Post Kit** — left section-nav + main content. Each section has **Copy** and
   **Regenerate** (single-section). Global **Copy all** and **Export Markdown**
   (download `launch-kit.md`).

## API (Node runtime)

### `POST /api/analyze`
- **Input:** `{ path: string }`.
- **Behavior:** validate the path exists and is a directory. Read, with size
  caps and ignoring `node_modules`/`.git`:
  - `README*` (case-insensitive; `.md`/`.markdown`/no-ext)
  - `package.json` (name, description, dependencies → tech stack & framework)
  - a few top-level and `docs/*.md` files
  - detect framework from dependencies/config files
- **Output:** `ProjectContext`. Missing README → succeed with a `warnings[]`
  entry rather than failing.
- **Errors:** non-existent path / not a directory → `400` with a clear message;
  permission error → friendly `400`/`500` message.

### `POST /api/generate`
- **Input:** `{ context: ProjectContext, refinements: Refinements, section?: SectionKey }`.
- **Behavior:** resolve a `GenerationProvider` and produce a `LaunchKit`
  (or, if `section` is given, regenerate just that section and return the patch).
- **Output:** `LaunchKit` (or a partial keyed by `section`).
- **Errors:** provider failure → `502`/`500` with a message; client surfaces a
  toast with retry. Mock provider never fails.

## Generation Abstraction

`lib/generation/`:

- `provider.types.ts` — `GenerationProvider` interface:
  - `generateKit(input: GenerateInput): Promise<LaunchKit>`
  - `generateSection(section: SectionKey, input: GenerateInput): Promise<Partial<LaunchKit>>`
- `mock-provider.ts` — **v1 default.** Deterministically builds the kit from the
  context using templates. No network, no key.
- `openrouter-provider.ts` — **scaffolded, completed later.** Reads
  `OPENROUTER_API_KEY`, builds prompts via `prompt.ts`, calls the model, parses
  JSON, and validates against the zod schema before returning.
- `prompt.ts` — prompt builders per section / full kit.
- `schema.ts` — zod schemas for `LaunchKit` (and sections) used to validate any
  provider output, especially model JSON.
- `index.ts` — `getProvider()` factory selecting via
  `GENERATION_PROVIDER=mock|openrouter` (default `mock`).

## Data Model

```ts
type ProjectContext = {
  name: string
  oneLiner: string
  summary: string
  features: string[]
  techStack: string[]
  audience?: string
  problem?: string
  differentiators: string[]
  links: { label: string; url: string }[]
  readmeExcerpt: string
  warnings?: string[]
}

type Refinements = {
  angle?: string
  audience?: string
  goal?: string
  tone?: string
}

type SectionKey = 'copy' | 'topicsComment' | 'gallery' | 'video' | 'launch'

type ShotSpec = { title: string; purpose: string; caption: string; layoutHint: string }
type Scene = { timeRange: string; visual: string; onScreenText: string }

type LaunchKit = {
  copy: {
    nameSuggestions: string[]
    tagline: string
    taglineAlternatives: string[]
    description: string
  }
  topics: string[]
  firstComment: string
  gallery: { shots: ShotSpec[] }
  video: { hook: string; scenes: Scene[]; lengthSec: number; cta: string }
  launch: {
    recommendedDay: string
    recommendedTimePT: string
    prelaunchChecklist: string[]
    launchDayChecklist: string[]
    outreach: { hunter: string; supporters: string }
  }
}
```

## Components

- `wizard/WizardStepper` — step indicator.
- `folder-select/FolderSelect` — path input + Analyze.
- `context-review/ContextReview` — editable context + refinement inputs.
- `post-kit/PostKit` — result shell with section nav + export actions.
- `post-kit/sections/` — `CopySection`, `TopicsCommentSection`,
  `GallerySection`, `VideoSection`, `LaunchOpsSection`.
- Shared/brand — `common/CopyButton`, `common/SectionCard`,
  `brand/AppHeader`, `brand/UpvoteBadge`; shadcn primitives in `components/ui`.

## Export

`lib/export/to-markdown.ts` — serialize a `LaunchKit` to a single Markdown
document. Powers "Copy all" (clipboard) and "Export Markdown" (download
`launch-kit.md`).

## Errors & UX

- Friendly path/permission messages on analyze; inline validation.
- Provider errors → sonner toast with retry.
- Loading/disabled states on every async action.
- Missing-README path still produces a kit, with a visible warning.

## Testing (vitest)

- `analyze` file-reading util against a temp fixture folder (README present /
  absent, package.json parsing, framework detection).
- `to-markdown` export shape/content.
- Mock provider output validates against the zod `LaunchKit` schema.

## Defaults Chosen

- Light mode only (v1).
- React Context + `useReducer` (no state library).
- `localStorage` caches the last context + kit.
- `GENERATION_PROVIDER` defaults to `mock`.
