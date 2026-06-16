# Per-Platform Launch Content — Design

**Date:** 2026-06-16
**Status:** Approved (data model + generation flow + UI)

## Problem

Today a single `LaunchKit` is generated once (`/api/generate` → `buildKitPrompt`), hardwired to
Product Hunt via `ACTIVE_PLATFORM`. In the kit view, the platform selector only **restyles that
same kit** — so AppSumo / Hacker News / Reddit previews show Product-Hunt-flavored content verbatim
(PH topics, a "Maker's first comment," a "hunter" DM, "12:01 AM PT Tuesday" timing). The core product
and goal are the same across platforms, but the **audience and native post format differ**, and the
content does not reflect that.

## Decisions

- **Content depth:** Shared core + per-platform overrides. A platform-agnostic core is generated once;
  each platform gets its own **native** content shape on top (PH is the richest; HN/Reddit drop
  gallery/video entirely).
- **Generation strategy:** All upfront, in parallel. Generate the core, then fan out to all four
  platform generations concurrently. Accepted trade-off: ~4–5× cost, latency stays ~30–45s (parallel),
  every platform is instant when switching.

## Data model

Replaces the single `LaunchKit` with a `Generation` (`core` + per-platform content).

```ts
// Generated once. Platform-agnostic essence — never shown raw, feeds every platform's generation.
type LaunchCore = {
  productName: string
  essence: string          // crisp positioning, one or two sentences
  audience: string
  problem: string
  features: string[]
  differentiators: string[]
}

type ProductHuntContent = {        // the richest — basically today's LaunchKit
  tagline: string; taglineAlternatives: string[]; description: string
  topics: string[]
  gallery: { shots: ShotSpec[] }
  video: { hook: string; scenes: Scene[]; lengthSec: number; cta: string }
  firstComment: string             // maker's first comment
  launch: {
    recommendedDay: string; recommendedTimePT: string
    prelaunchChecklist: string[]; launchDayChecklist: string[]
    outreach: { hunter: string; supporters: string }
  }
}
type HackerNewsContent = {         // text-first, technical, humble — NO gallery/video
  title: string                    // "Show HN: <name> – <one-liner>"
  postBody: string
  firstComment: string             // technical context + ask
  postingTips: { bestTimeET: string; avoid: string[] }
}
type RedditContent = {
  subreddits: { name: string; why: string }[]
  title: string; body: string
  replyEtiquette: string[]         // self-promo rules, how to engage comments
}
type AppSumoContent = {
  dealHeadline: string; pitch: string   // lifetime-deal value framing
  whatsIncluded: string[]; bestFor: string[]
  faq: { q: string; a: string }[]
}

type PlatformContentMap = {
  'product-hunt': ProductHuntContent
  'appsumo': AppSumoContent
  'hacker-news': HackerNewsContent
  'reddit': RedditContent
}

type Generation = {
  core: LaunchCore
  platforms: Partial<PlatformContentMap>
}
```

- The **core is internal** — not directly editable. Users view/copy/regenerate per-platform output;
  the core just feeds generation. (Can be made editable later.)
- `ShotSpec` / `Scene` reused as-is.

## Generation flow

```
POST /api/generate
  1. generateCore(input)                      -> LaunchCore                (1 call)
  2. Promise.allSettled([                      -> per-platform content      (4 calls, parallel)
       generatePlatform('product-hunt', core, input),
       generatePlatform('appsumo',      core, input),
       generatePlatform('hacker-news',  core, input),
       generatePlatform('reddit',       core, input),
     ])
  -> { core, platforms }   // a platform that fails is omitted/flagged, others still return
```

Latency ≈ core call + slowest platform call. Single-platform **regeneration** re-calls
`generatePlatform(active, core, input)` reusing the already-generated core.

**Provider interface:**

```ts
interface GenerationProvider {
  generateCore(input: GenerateInput): Promise<LaunchCore>
  generatePlatform(platform: PlatformId, core: LaunchCore, input: GenerateInput): Promise<PlatformContent>
}
```

**File layout** (one module per platform; keeps `prompt.ts` from ballooning, matches
folder-per-responsibility):

```
lib/generation/
  core/         core.prompt.ts, core.schema.ts
  platforms/
    product-hunt/  prompt.ts, schema.ts   (existing kit shape moves here)
    hacker-news/   prompt.ts, schema.ts
    reddit/        prompt.ts, schema.ts
    appsumo/       prompt.ts, schema.ts
    registry.ts   // PlatformId -> { buildPrompt, schema, voice }
```

Each platform prompt carries its own voice: HN humble/technical, no marketing fluff; Reddit value-first,
respect self-promo norms; AppSumo lifetime-deal framing; PH punchy maker energy.

**Mock provider** returns a canned `core` + all four platform contents so local dev (no API key) and
tests work.

## UI & wiring

The "Edit" view is **read-only display cards** (copy + regenerate), not free-text editing.

- **PostKit is platform-first:** platform selector moves to the top toolbar and drives both Edit and
  Preview. Active platform = the one rendered.
- **Per-platform display sections** (Edit view):
  - Product Hunt → today's 5 cards (Name & copy, Topics + comment, Gallery, Video, Launch ops).
  - Hacker News → Post (title + body), First comment, Posting tips.
  - Reddit → Subreddits, Post (title + body), Reply etiquette.
  - AppSumo → Deal (headline + pitch), What's included, Best for, FAQ.
  Each platform has its own section-list constant + section components.
- **Regeneration is per-platform** (one "Regenerate" button per platform → `generatePlatform`). Per-section
  regen is dropped (each platform is one LLM call). Re-addable later.
- **Export / Copy all** act on the active platform via `platformToMarkdown(platform, core, content)`.
- **Preview components** (all four exist) rewired from `{ kit }` to `{ core, content }` per their type.
- **State:** `state.kit` -> `state.generation: Generation | null`; reducer `GENERATED` (whole generation)
  and `REGEN_PLATFORM` (patch one platform). localStorage updated to the new shape; old persisted kits
  are ignored on load (clean break, acceptable pre-launch).

## Out of scope (YAGNI)

- Editable core / free-text editing of generated content.
- Lazy per-platform generation, per-section regen, "export all platforms at once."
- Adding platforms beyond the existing four.
```
