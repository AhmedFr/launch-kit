# Launch Kit — Product Hunt post generator

Point it at a project folder and it produces everything you need for a great
Product Hunt launch: name and tagline options, a description, recommended
topics, the maker's first comment, a gallery shot list, a demo-video
storyboard, and launch-day operations. Media is **guided** — the app tells you
exactly which images and video scenes to create and upload.

Product Hunt–themed UI built with Next.js, shadcn/ui, and Tailwind.

## How it works

A three-step wizard:

1. **Select folder** — paste an absolute path. A Node API route reads the
   `README` and `package.json` into a structured project context.
2. **Review context** — confirm/edit what was found and add launch intent
   (audience, angle, goal, tone) to sharpen the output.
3. **Post Kit** — browse each section, copy any piece, regenerate a single
   section, or export the whole kit to Markdown.

## Getting started

```bash
pnpm install
pnpm dev
```

Open the printed local URL. No API key is needed — the default **mock**
generator produces a full kit so the whole flow is usable out of the box.

## Wiring real AI (OpenRouter)

Generation lives behind a `GenerationProvider` interface
(`lib/generation/`). To use real model output, copy `.env.example` to
`.env.local` and set:

```bash
GENERATION_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-...
```

Model JSON is validated against a zod schema (`lib/generation/schema.ts`)
before it reaches the UI.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm test` — run the vitest suite
- `pnpm typecheck` — `tsc --noEmit`

## Project layout

- `app/` — pages and the `/api/analyze` + `/api/generate` routes
- `lib/analyze/` — folder reading → `ProjectContext`
- `lib/generation/` — provider interface, mock + OpenRouter, schema, prompts
- `lib/export/` — Markdown export
- `lib/wizard/` — wizard state (reducer + provider)
- `components/` — brand, shared, wizard, and Post Kit section components

See `docs/superpowers/specs/` and `docs/superpowers/plans/` for the design and
implementation plan.
