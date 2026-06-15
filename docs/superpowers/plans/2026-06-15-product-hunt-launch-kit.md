# Product Hunt Launch Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Product Hunt-themed Next.js app that turns a local project folder (README + files) into a complete, copy-ready launch kit.

**Architecture:** A 3-step client wizard (Select folder → Review context → Post Kit) backed by two Node API routes: `/api/analyze` reads the folder into a `ProjectContext`, and `/api/generate` turns context + refinements into a `LaunchKit` via a swappable `GenerationProvider` (mock now, OpenRouter later). All AI output is validated with zod. Media is guided (shot lists, storyboards), never generated.

**Tech Stack:** Next.js (App Router) + TypeScript, Tailwind, shadcn/ui, zod, vitest + @testing-library/react, pnpm.

---

## File Structure

```
app/
  layout.tsx                      # root layout, fonts, AppHeader, Toaster
  page.tsx                        # wizard orchestration (client)
  globals.css                     # tailwind + PH theme tokens
  api/
    analyze/route.ts              # POST -> ProjectContext
    generate/route.ts             # POST -> LaunchKit (or section patch)
lib/
  types.ts                        # domain types (ProjectContext, LaunchKit, ...)
  analyze/
    read-folder.ts                # fs reading + ProjectContext assembly
    read-folder.test.ts
    framework-detect.ts           # deps -> framework label
  generation/
    provider.types.ts             # GenerationProvider interface
    schema.ts                     # zod schemas for LaunchKit
    mock-provider.ts              # deterministic templated provider
    mock-provider.test.ts
    openrouter-provider.ts        # scaffold, completed later
    prompt.ts                     # prompt builders
    index.ts                      # getProvider() factory
  export/
    to-markdown.ts                # LaunchKit -> markdown string
    to-markdown.test.ts
  wizard/
    wizard-reducer.ts             # state machine
    wizard-reducer.test.ts
    WizardProvider.tsx            # context + localStorage persistence
    useWizard.ts
  utils.ts                        # cn() helper (from shadcn)
components/
  brand/AppHeader/                # index.ts, AppHeader.tsx, AppHeader.types.ts
  brand/UpvoteBadge/
  common/CopyButton/
  common/SectionCard/
  wizard/WizardStepper/
  folder-select/FolderSelect/
  context-review/ContextReview/
  post-kit/PostKit/
  post-kit/sections/CopySection/
  post-kit/sections/TopicsCommentSection/
  post-kit/sections/GallerySection/
  post-kit/sections/VideoSection/
  post-kit/sections/LaunchOpsSection/
  ui/                             # shadcn primitives
```

---

### Task 1: Scaffold project, theme, and test harness

**Files:**
- Create: whole Next.js app, `vitest.config.ts`, `vitest.setup.ts`, theme tokens in `app/globals.css`

- [ ] **Step 1: Scaffold Next.js (non-interactive)**

Run from the project root (the dir already contains `.git`, `.gitignore`, `docs/`):
```bash
pnpm create next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm --yes
```
If it refuses because the directory is non-empty, move the existing files aside first:
```bash
mkdir -p /tmp/ph-keep && mv .git .gitignore docs /tmp/ph-keep/ \
  && pnpm create next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm --yes \
  && mv /tmp/ph-keep/.git /tmp/ph-keep/.gitignore /tmp/ph-keep/docs . && rmdir /tmp/ph-keep
```
Restore `.gitignore`'s `.superpowers/` line if create-next-app overwrote it (re-add the block from the committed version).

- [ ] **Step 2: Init shadcn/ui and add primitives**

```bash
pnpm dlx shadcn@latest init -d -b neutral
pnpm dlx shadcn@latest add button input textarea label card badge separator scroll-area skeleton sonner -y
```

- [ ] **Step 3: Add runtime + test deps**

```bash
pnpm add zod
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: { alias: { '@': resolve(__dirname, '.') } },
})
```

- [ ] **Step 5: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 6: Add test script to `package.json`**

Add to `"scripts"`: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 7: Add Product Hunt theme tokens**

In `app/globals.css`, under the existing `:root` block, override the primary tokens to PH coral (keep the rest shadcn generated). Add:
```css
:root {
  --primary: #ff6154;
  --primary-foreground: #ffffff;
  --ring: #ff6154;
  --radius: 0.75rem;
}
```
(Match the variable format shadcn generated — if it uses `oklch`, set `--primary: oklch(0.67 0.2 25);` instead. The point: primary = coral.)

- [ ] **Step 8: Verify it builds and tests run**

Run: `pnpm test` → Expected: "No test files found" is fine, exit 0 OR passes. Run: `pnpm build` → Expected: success.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold next.js app with shadcn, vitest, and PH theme"
```

---

### Task 2: Domain types and zod schema

**Files:**
- Create: `lib/types.ts`, `lib/generation/schema.ts`, `lib/generation/schema.test.ts`

- [ ] **Step 1: Write `lib/types.ts`**

```ts
export type ProjectContext = {
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
  warnings: string[]
}

export type Refinements = {
  angle?: string
  audience?: string
  goal?: string
  tone?: string
}

export type SectionKey = 'copy' | 'topicsComment' | 'gallery' | 'video' | 'launch'

export type ShotSpec = { title: string; purpose: string; caption: string; layoutHint: string }
export type Scene = { timeRange: string; visual: string; onScreenText: string }

export type LaunchKit = {
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

export type GenerateInput = { context: ProjectContext; refinements: Refinements }
```

- [ ] **Step 2: Write the failing schema test `lib/generation/schema.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { launchKitSchema } from './schema'

const validKit = {
  copy: { nameSuggestions: ['Acme'], tagline: 'Do X fast', taglineAlternatives: ['Alt'], description: 'A tool.' },
  topics: ['Developer Tools'],
  firstComment: 'Hey hunters!',
  gallery: { shots: [{ title: 'Hero', purpose: 'wow', caption: 'cap', layoutHint: 'full-bleed' }] },
  video: { hook: 'Tired of X?', scenes: [{ timeRange: '0-3s', visual: 'logo', onScreenText: 'Acme' }], lengthSec: 30, cta: 'Try it' },
  launch: { recommendedDay: 'Tuesday', recommendedTimePT: '12:01 AM', prelaunchChecklist: ['a'], launchDayChecklist: ['b'], outreach: { hunter: 'hi', supporters: 'yo' } },
}

describe('launchKitSchema', () => {
  it('accepts a valid kit', () => {
    expect(launchKitSchema.parse(validKit)).toEqual(validKit)
  })
  it('rejects a kit missing tagline', () => {
    const bad = { ...validKit, copy: { ...validKit.copy, tagline: undefined } }
    expect(() => launchKitSchema.parse(bad)).toThrow()
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

Run: `pnpm vitest run lib/generation/schema.test.ts`
Expected: FAIL — cannot import `./schema`.

- [ ] **Step 4: Write `lib/generation/schema.ts`**

```ts
import { z } from 'zod'

const shotSchema = z.object({ title: z.string(), purpose: z.string(), caption: z.string(), layoutHint: z.string() })
const sceneSchema = z.object({ timeRange: z.string(), visual: z.string(), onScreenText: z.string() })

export const launchKitSchema = z.object({
  copy: z.object({
    nameSuggestions: z.array(z.string()),
    tagline: z.string(),
    taglineAlternatives: z.array(z.string()),
    description: z.string(),
  }),
  topics: z.array(z.string()),
  firstComment: z.string(),
  gallery: z.object({ shots: z.array(shotSchema) }),
  video: z.object({ hook: z.string(), scenes: z.array(sceneSchema), lengthSec: z.number(), cta: z.string() }),
  launch: z.object({
    recommendedDay: z.string(),
    recommendedTimePT: z.string(),
    prelaunchChecklist: z.array(z.string()),
    launchDayChecklist: z.array(z.string()),
    outreach: z.object({ hunter: z.string(), supporters: z.string() }),
  }),
})

export type LaunchKitSchema = z.infer<typeof launchKitSchema>
```

- [ ] **Step 5: Run test, verify it passes**

Run: `pnpm vitest run lib/generation/schema.test.ts` → Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts lib/generation/schema.ts lib/generation/schema.test.ts
git commit -m "feat: add domain types and LaunchKit zod schema"
```

---

### Task 3: Folder analysis utilities

**Files:**
- Create: `lib/analyze/framework-detect.ts`, `lib/analyze/read-folder.ts`, `lib/analyze/read-folder.test.ts`

- [ ] **Step 1: Write `lib/analyze/framework-detect.ts`**

```ts
const FRAMEWORKS: { dep: string; label: string }[] = [
  { dep: 'next', label: 'Next.js' },
  { dep: 'react', label: 'React' },
  { dep: 'vue', label: 'Vue' },
  { dep: 'svelte', label: 'Svelte' },
  { dep: 'express', label: 'Express' },
  { dep: 'fastify', label: 'Fastify' },
  { dep: '@nestjs/core', label: 'NestJS' },
  { dep: 'astro', label: 'Astro' },
]

export function detectTechStack(deps: Record<string, string>): string[] {
  const keys = Object.keys(deps ?? {})
  const labels = FRAMEWORKS.filter((f) => keys.includes(f.dep)).map((f) => f.label)
  if (keys.includes('typescript')) labels.push('TypeScript')
  return [...new Set(labels)]
}
```

- [ ] **Step 2: Write the failing test `lib/analyze/read-folder.test.ts`**

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, writeFile, rm, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readFolder } from './read-folder'

let dir: string
beforeEach(async () => { dir = await mkdtemp(join(tmpdir(), 'ph-')) })
afterEach(async () => { await rm(dir, { recursive: true, force: true }) })

describe('readFolder', () => {
  it('builds a ProjectContext from README + package.json', async () => {
    await writeFile(join(dir, 'package.json'), JSON.stringify({ name: 'acme', description: 'Ship faster', dependencies: { next: '14' } }))
    await writeFile(join(dir, 'README.md'), '# Acme\n\nAcme helps teams ship faster.\n\n- Feature one\n- Feature two\n')
    const ctx = await readFolder(dir)
    expect(ctx.name).toBe('acme')
    expect(ctx.techStack).toContain('Next.js')
    expect(ctx.features.length).toBeGreaterThan(0)
    expect(ctx.readmeExcerpt).toContain('Acme')
    expect(ctx.warnings).toHaveLength(0)
  })

  it('warns when README is missing but still returns context', async () => {
    await writeFile(join(dir, 'package.json'), JSON.stringify({ name: 'noreadme' }))
    const ctx = await readFolder(dir)
    expect(ctx.name).toBe('noreadme')
    expect(ctx.warnings.join(' ')).toMatch(/README/i)
  })

  it('throws a clear error when the path is not a directory', async () => {
    await expect(readFolder(join(dir, 'does-not-exist'))).rejects.toThrow(/not a directory|does not exist/i)
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

Run: `pnpm vitest run lib/analyze/read-folder.test.ts` → Expected: FAIL — cannot import `./read-folder`.

- [ ] **Step 4: Write `lib/analyze/read-folder.ts`**

```ts
import { readFile, stat, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import type { ProjectContext } from '@/lib/types'
import { detectTechStack } from './framework-detect'

const README_MAX = 8000

async function findReadme(dir: string): Promise<string | null> {
  const entries = await readdir(dir)
  const match = entries.find((e) => /^readme(\.md|\.markdown)?$/i.test(e))
  return match ? join(dir, match) : null
}

function extractFeatures(readme: string): string[] {
  return readme
    .split('\n')
    .map((l) => l.match(/^\s*[-*]\s+(.*)/)?.[1]?.trim())
    .filter((l): l is string => Boolean(l && l.length > 3))
    .slice(0, 8)
}

function firstParagraph(readme: string): string {
  const body = readme.replace(/^#.*$/m, '').trim()
  return body.split(/\n\s*\n/)[0]?.replace(/\n/g, ' ').trim() ?? ''
}

export async function readFolder(path: string): Promise<ProjectContext> {
  let st
  try {
    st = await stat(path)
  } catch {
    throw new Error(`Path does not exist: ${path}`)
  }
  if (!st.isDirectory()) throw new Error(`Path is not a directory: ${path}`)

  const warnings: string[] = []

  let pkg: { name?: string; description?: string; dependencies?: Record<string, string>; devDependencies?: Record<string, string> } = {}
  try {
    pkg = JSON.parse(await readFile(join(path, 'package.json'), 'utf8'))
  } catch {
    warnings.push('No package.json found — tech stack could not be detected.')
  }

  let readme = ''
  const readmePath = await findReadme(path)
  if (readmePath) {
    readme = (await readFile(readmePath, 'utf8')).slice(0, README_MAX)
  } else {
    warnings.push('No README found — generated content will be sparse. Add a README for better results.')
  }

  const name = pkg.name ?? readme.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? 'Your Product'
  const summary = firstParagraph(readme) || pkg.description || ''

  return {
    name,
    oneLiner: pkg.description ?? summary.slice(0, 80),
    summary,
    features: extractFeatures(readme),
    techStack: detectTechStack({ ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }),
    differentiators: [],
    links: [],
    readmeExcerpt: readme.slice(0, 2000),
    warnings,
  }
}
```

- [ ] **Step 5: Run test, verify it passes**

Run: `pnpm vitest run lib/analyze/read-folder.test.ts` → Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add lib/analyze
git commit -m "feat: add folder analysis to build ProjectContext"
```

---

### Task 4: `/api/analyze` route

**Files:**
- Create: `app/api/analyze/route.ts`

- [ ] **Step 1: Write `app/api/analyze/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { readFolder } from '@/lib/analyze/read-folder'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: { path?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }
  const path = body.path?.trim()
  if (!path) return NextResponse.json({ error: 'A folder path is required.' }, { status: 400 })

  try {
    const context = await readFolder(path)
    return NextResponse.json({ context })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to read folder.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
```

- [ ] **Step 2: Manually verify the route**

Run: `pnpm dev` in one shell. In another:
```bash
curl -s -X POST http://localhost:3000/api/analyze -H 'content-type: application/json' -d "{\"path\":\"$(pwd)\"}" | head -c 400
```
Expected: JSON with a `context` object whose `name` is `product-hunt-assistant` (or your package name). Stop `pnpm dev`.

- [ ] **Step 3: Commit**

```bash
git add app/api/analyze/route.ts
git commit -m "feat: add /api/analyze route"
```

---

### Task 5: Generation provider interface + mock provider + factory

**Files:**
- Create: `lib/generation/provider.types.ts`, `lib/generation/prompt.ts`, `lib/generation/mock-provider.ts`, `lib/generation/mock-provider.test.ts`, `lib/generation/openrouter-provider.ts`, `lib/generation/index.ts`

- [ ] **Step 1: Write `lib/generation/provider.types.ts`**

```ts
import type { GenerateInput, LaunchKit, SectionKey } from '@/lib/types'

export interface GenerationProvider {
  generateKit(input: GenerateInput): Promise<LaunchKit>
  generateSection(section: SectionKey, input: GenerateInput): Promise<Partial<LaunchKit>>
}
```

- [ ] **Step 2: Write the failing test `lib/generation/mock-provider.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { MockProvider } from './mock-provider'
import { launchKitSchema } from './schema'
import type { GenerateInput } from '@/lib/types'

const input: GenerateInput = {
  context: {
    name: 'Acme', oneLiner: 'Ship faster', summary: 'Acme helps teams ship faster.',
    features: ['Fast builds', 'Great DX'], techStack: ['Next.js'], differentiators: [],
    links: [], readmeExcerpt: 'Acme helps teams ship faster.', warnings: [],
  },
  refinements: { tone: 'bold', audience: 'developers' },
}

describe('MockProvider', () => {
  it('produces a schema-valid kit that references the product name', async () => {
    const kit = await new MockProvider().generateKit(input)
    expect(() => launchKitSchema.parse(kit)).not.toThrow()
    expect(kit.copy.tagline.length).toBeLessThanOrEqual(60)
    expect(JSON.stringify(kit)).toContain('Acme')
    expect(kit.gallery.shots.length).toBeGreaterThanOrEqual(3)
    expect(kit.video.scenes.length).toBeGreaterThanOrEqual(3)
  })

  it('regenerates a single section', async () => {
    const patch = await new MockProvider().generateSection('copy', input)
    expect(patch.copy).toBeDefined()
    expect(patch.topics).toBeUndefined()
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

Run: `pnpm vitest run lib/generation/mock-provider.test.ts` → Expected: FAIL — cannot import `./mock-provider`.

- [ ] **Step 4: Write `lib/generation/prompt.ts`** (used by OpenRouter later; keep pure)

```ts
import type { GenerateInput } from '@/lib/types'

export function buildKitPrompt({ context, refinements }: GenerateInput): string {
  return [
    'You are an expert Product Hunt launch strategist.',
    'Return ONLY JSON matching the LaunchKit schema. No prose.',
    `Product: ${context.name}`,
    `Summary: ${context.summary}`,
    `Features: ${context.features.join('; ')}`,
    `Tech stack: ${context.techStack.join(', ')}`,
    refinements.angle ? `Angle: ${refinements.angle}` : '',
    refinements.audience ? `Audience: ${refinements.audience}` : '',
    refinements.goal ? `Goal: ${refinements.goal}` : '',
    refinements.tone ? `Tone: ${refinements.tone}` : '',
    `README excerpt:\n${context.readmeExcerpt}`,
  ].filter(Boolean).join('\n')
}
```

- [ ] **Step 5: Write `lib/generation/mock-provider.ts`**

```ts
import type { GenerateInput, LaunchKit, SectionKey } from '@/lib/types'
import type { GenerationProvider } from './provider.types'

function clamp(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '…'
}

function buildKit({ context, refinements }: GenerateInput): LaunchKit {
  const name = context.name
  const audience = refinements.audience || context.audience || 'builders'
  const benefit = context.oneLiner || context.summary || 'gets the job done'
  const feat = context.features.length ? context.features : ['Does the core job well', 'Simple to start', 'Built for speed']

  return {
    copy: {
      nameSuggestions: [name, `${name} — for ${audience}`, `Get ${name}`],
      tagline: clamp(`${name}: ${benefit}`, 60),
      taglineAlternatives: [
        clamp(`The fastest way to ${benefit}`, 60),
        clamp(`${benefit}, built for ${audience}`, 60),
      ],
      description: `${context.summary || `${name} helps ${audience}.`}\n\nWhy it matters:\n` +
        feat.slice(0, 4).map((f) => `• ${f}`).join('\n') +
        `\n\nBuilt with ${context.techStack.join(', ') || 'modern tooling'}.`,
    },
    topics: ['Developer Tools', 'Productivity', 'SaaS'].slice(0, context.techStack.length ? 3 : 2),
    firstComment:
      `Hey Product Hunt! 👋 I built ${name} because ${audience} deserve a better way to ${benefit}.\n\n` +
      `Top things to try:\n${feat.slice(0, 3).map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n` +
      `I'd love your feedback — what should we build next?`,
    gallery: {
      shots: [
        { title: 'Hero / cover', purpose: 'Stop the scroll', caption: `${name} — ${benefit}`, layoutHint: 'Full-bleed product shot with the tagline overlaid' },
        { title: 'Core feature', purpose: 'Show the main value', caption: feat[0], layoutHint: 'Annotated screenshot, callout arrows on the key UI' },
        { title: 'Before / after', purpose: 'Make the benefit concrete', caption: 'From manual to instant', layoutHint: 'Split image, left = old way, right = with ' + name },
        { title: 'Social proof / stack', purpose: 'Build trust', caption: `Built with ${context.techStack.join(', ') || 'modern tools'}`, layoutHint: 'Logos or a short quote on brand-colored background' },
      ],
    },
    video: {
      hook: `Tired of the old way to ${benefit}?`,
      lengthSec: 45,
      cta: `Try ${name} free today`,
      scenes: [
        { timeRange: '0-3s', visual: 'Logo animates in on coral background', onScreenText: name },
        { timeRange: '3-12s', visual: 'Screen-record the core flow end to end', onScreenText: feat[0] ?? 'The core flow' },
        { timeRange: '12-30s', visual: 'Show 2-3 key features quickly', onScreenText: feat.slice(1, 3).join(' · ') || 'Key features' },
        { timeRange: '30-45s', visual: 'End card with URL and upvote nudge', onScreenText: `Try ${name} free today` },
      ],
    },
    launch: {
      recommendedDay: 'Tuesday',
      recommendedTimePT: '12:01 AM PT',
      prelaunchChecklist: [
        'Line up a credible hunter (or self-hunt) 1 week ahead',
        'Prepare gallery images and the demo video',
        'Draft the first comment and pin it at launch',
        'Warm up your network the day before',
      ],
      launchDayChecklist: [
        'Post at 12:01 AM PT and pin your first comment',
        'Reply to every comment within the first 2 hours',
        'Share to your channels (X, LinkedIn, Slack/Discord)',
        'Post a mid-day update with traction',
      ],
      outreach: {
        hunter: `Hi {name}, I'm launching ${name} (${benefit}) on Product Hunt and admire your eye for ${audience} tools. Would you be open to hunting it? Assets ready to go.`,
        supporters: `Hey! ${name} is live on Product Hunt today 🚀 If it looks useful, an upvote and an honest comment would mean a lot: {link}`,
      },
    },
  }
}

export class MockProvider implements GenerationProvider {
  async generateKit(input: GenerateInput): Promise<LaunchKit> {
    return buildKit(input)
  }
  // topicsComment maps to two fields (topics + firstComment); the rest map 1:1.
  async generateSection(section: SectionKey, input: GenerateInput): Promise<Partial<LaunchKit>> {
    const full = buildKit(input)
    if (section === 'topicsComment') return { topics: full.topics, firstComment: full.firstComment }
    if (section === 'copy') return { copy: full.copy }
    if (section === 'gallery') return { gallery: full.gallery }
    if (section === 'video') return { video: full.video }
    return { launch: full.launch }
  }
}
```

- [ ] **Step 6: Run test, verify it passes**

Run: `pnpm vitest run lib/generation/mock-provider.test.ts` → Expected: PASS (2 tests).

- [ ] **Step 7: Write `lib/generation/openrouter-provider.ts` (scaffold for later)**

```ts
import type { GenerateInput, LaunchKit, SectionKey } from '@/lib/types'
import type { GenerationProvider } from './provider.types'
import { launchKitSchema } from './schema'
import { buildKitPrompt } from './prompt'

// Wired in later. Requires OPENROUTER_API_KEY and GENERATION_PROVIDER=openrouter.
export class OpenRouterProvider implements GenerationProvider {
  constructor(
    private apiKey = process.env.OPENROUTER_API_KEY ?? '',
    private model = process.env.OPENROUTER_MODEL ?? 'anthropic/claude-3.5-sonnet',
  ) {}

  async generateKit(input: GenerateInput): Promise<LaunchKit> {
    if (!this.apiKey) throw new Error('OPENROUTER_API_KEY is not set.')
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: buildKitPrompt(input) }],
      }),
    })
    if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`)
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content ?? '{}'
    return launchKitSchema.parse(JSON.parse(content))
  }

  async generateSection(_section: SectionKey, input: GenerateInput): Promise<Partial<LaunchKit>> {
    // For now, regenerate the whole kit and let the caller pick the section.
    return this.generateKit(input)
  }
}
```

- [ ] **Step 8: Write `lib/generation/index.ts`**

```ts
import type { GenerationProvider } from './provider.types'
import { MockProvider } from './mock-provider'
import { OpenRouterProvider } from './openrouter-provider'

export function getProvider(): GenerationProvider {
  if (process.env.GENERATION_PROVIDER === 'openrouter') return new OpenRouterProvider()
  return new MockProvider()
}

export type { GenerationProvider }
```

- [ ] **Step 9: Run full test suite + typecheck**

Run: `pnpm vitest run` → Expected: all pass. Run: `pnpm exec tsc --noEmit` → Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add lib/generation
git commit -m "feat: add generation provider interface, mock + openrouter scaffold"
```

---

### Task 6: `/api/generate` route

**Files:**
- Create: `app/api/generate/route.ts`

- [ ] **Step 1: Write `app/api/generate/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { getProvider } from '@/lib/generation'
import type { GenerateInput, SectionKey } from '@/lib/types'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: GenerateInput & { section?: SectionKey }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }
  if (!body?.context?.name) {
    return NextResponse.json({ error: 'A project context is required.' }, { status: 400 })
  }

  const provider = getProvider()
  const input: GenerateInput = { context: body.context, refinements: body.refinements ?? {} }
  try {
    if (body.section) {
      const patch = await provider.generateSection(body.section, input)
      return NextResponse.json({ patch })
    }
    const kit = await provider.generateKit(input)
    return NextResponse.json({ kit })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
```

- [ ] **Step 2: Manually verify**

Run `pnpm dev`, then:
```bash
curl -s -X POST http://localhost:3000/api/generate -H 'content-type: application/json' \
  -d '{"context":{"name":"Acme","oneLiner":"Ship faster","summary":"Acme helps teams ship faster.","features":["Fast"],"techStack":["Next.js"],"differentiators":[],"links":[],"readmeExcerpt":"","warnings":[]},"refinements":{}}' | head -c 300
```
Expected: JSON with a `kit` object. Stop `pnpm dev`.

- [ ] **Step 3: Commit**

```bash
git add app/api/generate/route.ts
git commit -m "feat: add /api/generate route"
```

---

### Task 7: Markdown export

**Files:**
- Create: `lib/export/to-markdown.ts`, `lib/export/to-markdown.test.ts`

- [ ] **Step 1: Write the failing test `lib/export/to-markdown.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { kitToMarkdown } from './to-markdown'
import type { LaunchKit } from '@/lib/types'

const kit: LaunchKit = {
  copy: { nameSuggestions: ['Acme'], tagline: 'Ship faster', taglineAlternatives: ['Go fast'], description: 'A tool.' },
  topics: ['Developer Tools'],
  firstComment: 'Hey hunters!',
  gallery: { shots: [{ title: 'Hero', purpose: 'wow', caption: 'cap', layoutHint: 'full-bleed' }] },
  video: { hook: 'Tired?', scenes: [{ timeRange: '0-3s', visual: 'logo', onScreenText: 'Acme' }], lengthSec: 30, cta: 'Try it' },
  launch: { recommendedDay: 'Tuesday', recommendedTimePT: '12:01 AM PT', prelaunchChecklist: ['a'], launchDayChecklist: ['b'], outreach: { hunter: 'hi', supporters: 'yo' } },
}

describe('kitToMarkdown', () => {
  it('renders all sections as markdown', () => {
    const md = kitToMarkdown(kit)
    expect(md).toContain('# Product Hunt Launch Kit')
    expect(md).toContain('Ship faster')
    expect(md).toContain('## Gallery')
    expect(md).toContain('## Demo Video')
    expect(md).toContain('Tuesday')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm vitest run lib/export/to-markdown.test.ts` → Expected: FAIL — cannot import.

- [ ] **Step 3: Write `lib/export/to-markdown.ts`**

```ts
import type { LaunchKit } from '@/lib/types'

const bullets = (items: string[]) => items.map((i) => `- ${i}`).join('\n')

export function kitToMarkdown(kit: LaunchKit): string {
  const { copy, topics, firstComment, gallery, video, launch } = kit
  return `# Product Hunt Launch Kit

## Name & Tagline
**Tagline:** ${copy.tagline}

Name ideas: ${copy.nameSuggestions.join(', ')}
Tagline alternatives:
${bullets(copy.taglineAlternatives)}

## Description
${copy.description}

## Topics
${bullets(topics)}

## First Comment
${firstComment}

## Gallery
${gallery.shots.map((s, i) => `${i + 1}. **${s.title}** — ${s.purpose}\n   - Caption: ${s.caption}\n   - Layout: ${s.layoutHint}`).join('\n')}

## Demo Video
**Hook:** ${video.hook}  ·  **Length:** ${video.lengthSec}s  ·  **CTA:** ${video.cta}

${video.scenes.map((s) => `- \`${s.timeRange}\` — ${s.visual} _(on-screen: ${s.onScreenText})_`).join('\n')}

## Launch Ops
**Best time:** ${launch.recommendedDay}, ${launch.recommendedTimePT}

### Pre-launch
${bullets(launch.prelaunchChecklist)}

### Launch day
${bullets(launch.launchDayChecklist)}

### Outreach — Hunter
${launch.outreach.hunter}

### Outreach — Supporters
${launch.outreach.supporters}
`
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `pnpm vitest run lib/export/to-markdown.test.ts` → Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/export
git commit -m "feat: add LaunchKit markdown export"
```

---

### Task 8: Wizard state (reducer + provider)

**Files:**
- Create: `lib/wizard/wizard-reducer.ts`, `lib/wizard/wizard-reducer.test.ts`, `lib/wizard/WizardProvider.tsx`, `lib/wizard/useWizard.ts`

- [ ] **Step 1: Write the failing test `lib/wizard/wizard-reducer.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { wizardReducer, initialState } from './wizard-reducer'
import type { ProjectContext, LaunchKit } from '@/lib/types'

const ctx = { name: 'Acme', oneLiner: '', summary: '', features: [], techStack: [], differentiators: [], links: [], readmeExcerpt: '', warnings: [] } as ProjectContext

describe('wizardReducer', () => {
  it('advances to review on ANALYZED', () => {
    const s = wizardReducer(initialState, { type: 'ANALYZED', context: ctx })
    expect(s.step).toBe('review')
    expect(s.context?.name).toBe('Acme')
  })
  it('advances to kit on GENERATED', () => {
    const mid = wizardReducer(initialState, { type: 'ANALYZED', context: ctx })
    const s = wizardReducer(mid, { type: 'GENERATED', kit: {} as LaunchKit })
    expect(s.step).toBe('kit')
  })
  it('RESET returns to folder step', () => {
    const mid = wizardReducer(initialState, { type: 'ANALYZED', context: ctx })
    expect(wizardReducer(mid, { type: 'RESET' }).step).toBe('folder')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm vitest run lib/wizard/wizard-reducer.test.ts` → Expected: FAIL.

- [ ] **Step 3: Write `lib/wizard/wizard-reducer.ts`**

```ts
import type { ProjectContext, Refinements, LaunchKit } from '@/lib/types'

export type WizardStep = 'folder' | 'review' | 'kit'

export type WizardState = {
  step: WizardStep
  path: string
  context: ProjectContext | null
  refinements: Refinements
  kit: LaunchKit | null
}

export type WizardAction =
  | { type: 'SET_PATH'; path: string }
  | { type: 'ANALYZED'; context: ProjectContext }
  | { type: 'EDIT_CONTEXT'; context: ProjectContext }
  | { type: 'EDIT_REFINEMENTS'; refinements: Refinements }
  | { type: 'GENERATED'; kit: LaunchKit }
  | { type: 'PATCH_KIT'; patch: Partial<LaunchKit> }
  | { type: 'GO'; step: WizardStep }
  | { type: 'RESET' }

export const initialState: WizardState = {
  step: 'folder', path: '', context: null, refinements: {}, kit: null,
}

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_PATH': return { ...state, path: action.path }
    case 'ANALYZED': return { ...state, context: action.context, step: 'review' }
    case 'EDIT_CONTEXT': return { ...state, context: action.context }
    case 'EDIT_REFINEMENTS': return { ...state, refinements: action.refinements }
    case 'GENERATED': return { ...state, kit: action.kit, step: 'kit' }
    case 'PATCH_KIT': return state.kit ? { ...state, kit: { ...state.kit, ...action.patch } } : state
    case 'GO': return { ...state, step: action.step }
    case 'RESET': return initialState
    default: return state
  }
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `pnpm vitest run lib/wizard/wizard-reducer.test.ts` → Expected: PASS (3 tests).

- [ ] **Step 5: Write `lib/wizard/WizardProvider.tsx`** (with localStorage persistence)

```tsx
'use client'
import { createContext, useEffect, useReducer, type ReactNode } from 'react'
import { wizardReducer, initialState, type WizardState, type WizardAction } from './wizard-reducer'

const KEY = 'ph-launch-kit'

export const WizardContext = createContext<{ state: WizardState; dispatch: React.Dispatch<WizardAction> } | null>(null)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState, (init) => {
    if (typeof window === 'undefined') return init
    try {
      const saved = window.localStorage.getItem(KEY)
      return saved ? { ...init, ...JSON.parse(saved) } : init
    } catch {
      return init
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ context: state.context, refinements: state.refinements, kit: state.kit, step: state.step }))
    } catch {
      // ignore quota / serialization errors
    }
  }, [state.context, state.refinements, state.kit, state.step])

  return <WizardContext.Provider value={{ state, dispatch }}>{children}</WizardContext.Provider>
}
```

- [ ] **Step 6: Write `lib/wizard/useWizard.ts`**

```ts
'use client'
import { useContext } from 'react'
import { WizardContext } from './WizardProvider'

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used within WizardProvider')
  return ctx
}
```

- [ ] **Step 7: Run suite + typecheck, then commit**

Run: `pnpm vitest run` and `pnpm exec tsc --noEmit` → Expected: pass.
```bash
git add lib/wizard
git commit -m "feat: add wizard state reducer and provider with localStorage"
```

---

### Task 9: Brand & shared components

**Files (each is a folder with `index.ts`, `*.tsx`, `*.types.ts`):**
- Create: `components/brand/AppHeader/`, `components/brand/UpvoteBadge/`, `components/common/CopyButton/`, `components/common/SectionCard/`

- [ ] **Step 1: `components/brand/UpvoteBadge/UpvoteBadge.tsx`**

```tsx
export function UpvoteBadge({ count = 0 }: { count?: number }) {
  return (
    <span className="inline-flex flex-col items-center justify-center rounded-md border border-primary px-2 py-1 text-primary">
      <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden><path d="M6 0l6 8H0z" fill="currentColor" /></svg>
      <span className="text-xs font-semibold tabular-nums">{count}</span>
    </span>
  )
}
```
`components/brand/UpvoteBadge/UpvoteBadge.types.ts`:
```ts
export type UpvoteBadgeProps = { count?: number }
```
`components/brand/UpvoteBadge/index.ts`:
```ts
export { UpvoteBadge } from './UpvoteBadge'
```

- [ ] **Step 2: `components/brand/AppHeader/AppHeader.tsx`**

```tsx
import { UpvoteBadge } from '@/components/brand/UpvoteBadge'

export function AppHeader() {
  return (
    <header className="flex items-center gap-3 border-b px-6 py-4">
      <UpvoteBadge count={1} />
      <div>
        <h1 className="text-lg font-bold leading-tight">Launch Kit</h1>
        <p className="text-xs text-muted-foreground">Turn your repo into a great Product Hunt post</p>
      </div>
    </header>
  )
}
```
`AppHeader.types.ts`: `export type AppHeaderProps = Record<string, never>`
`index.ts`: `export { AppHeader } from './AppHeader'`

- [ ] **Step 3: `components/common/CopyButton/CopyButton.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { CopyButtonProps } from './CopyButton.types'

export function CopyButton({ value, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Could not copy')
    }
  }
  return <Button variant="outline" size="sm" onClick={copy}>{copied ? 'Copied!' : label}</Button>
}
```
`CopyButton.types.ts`:
```ts
export type CopyButtonProps = { value: string; label?: string }
```
`index.ts`: `export { CopyButton } from './CopyButton'`

- [ ] **Step 4: `components/common/SectionCard/SectionCard.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SectionCardProps } from './SectionCard.types'

export function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="space-y-3 text-sm">{children}</CardContent>
    </Card>
  )
}
```
`SectionCard.types.ts`:
```ts
import type { ReactNode } from 'react'
export type SectionCardProps = { title: string; action?: ReactNode; children: ReactNode }
```
`index.ts`: `export { SectionCard } from './SectionCard'`

- [ ] **Step 5: Typecheck + commit**

Run: `pnpm exec tsc --noEmit` → Expected: pass.
```bash
git add components/brand components/common
git commit -m "feat: add brand and shared components"
```

---

### Task 10: FolderSelect (step 1)

**Files:**
- Create: `components/folder-select/FolderSelect/` (`index.ts`, `FolderSelect.tsx`, `FolderSelect.types.ts`)

- [ ] **Step 1: `FolderSelect.types.ts`**

```ts
import type { ProjectContext } from '@/lib/types'
export type FolderSelectProps = {
  path: string
  onPathChange: (path: string) => void
  onAnalyzed: (context: ProjectContext) => void
}
```

- [ ] **Step 2: `FolderSelect.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { FolderSelectProps } from './FolderSelect.types'

export function FolderSelect({ path, onPathChange, onAnalyzed }: FolderSelectProps) {
  const [loading, setLoading] = useState(false)

  async function analyze() {
    if (!path.trim()) return toast.error('Enter a folder path first')
    setLoading(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to analyze folder')
      onAnalyzed(data.context)
      if (data.context.warnings?.length) toast.warning(data.context.warnings[0])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to analyze folder')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="path">Project folder (absolute path)</Label>
        <Input id="path" value={path} placeholder="/Users/you/code/your-project"
          onChange={(e) => onPathChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && analyze()} />
        <p className="text-xs text-muted-foreground">We read the README and package.json — nothing leaves your machine.</p>
      </div>
      <Button onClick={analyze} disabled={loading} className="w-full">
        {loading ? 'Analyzing…' : 'Analyze folder'}
      </Button>
    </div>
  )
}
```
`index.ts`: `export { FolderSelect } from './FolderSelect'`

- [ ] **Step 3: Typecheck + commit**

Run: `pnpm exec tsc --noEmit` → Expected: pass.
```bash
git add components/folder-select
git commit -m "feat: add FolderSelect step"
```

---

### Task 11: ContextReview (step 2)

**Files:**
- Create: `components/context-review/ContextReview/` (`index.ts`, `ContextReview.tsx`, `ContextReview.types.ts`)

- [ ] **Step 1: `ContextReview.types.ts`**

```ts
import type { ProjectContext, Refinements } from '@/lib/types'
export type ContextReviewProps = {
  context: ProjectContext
  refinements: Refinements
  onContextChange: (context: ProjectContext) => void
  onRefinementsChange: (refinements: Refinements) => void
  onGenerate: () => void
  generating: boolean
}
```

- [ ] **Step 2: `ContextReview.tsx`**

```tsx
'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { ContextReviewProps } from './ContextReview.types'

export function ContextReview({ context, refinements, onContextChange, onRefinementsChange, onGenerate, generating }: ContextReviewProps) {
  const set = (patch: Partial<typeof context>) => onContextChange({ ...context, ...patch })
  const setRef = (patch: Partial<typeof refinements>) => onRefinementsChange({ ...refinements, ...patch })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {context.warnings.map((w) => (
        <p key={w} className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{w}</p>
      ))}

      <section className="space-y-3">
        <h2 className="font-semibold">What we found</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Product name</Label>
          <Input id="name" value={context.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea id="summary" rows={3} value={context.summary} onChange={(e) => set({ summary: e.target.value })} />
        </div>
        <div className="flex flex-wrap gap-2">
          {context.techStack.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Launch intent <span className="font-normal text-muted-foreground">(sharpens the output)</span></h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="audience">Audience</Label><Input id="audience" value={refinements.audience ?? ''} placeholder="e.g. indie developers" onChange={(e) => setRef({ audience: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="angle">Angle</Label><Input id="angle" value={refinements.angle ?? ''} placeholder="the one big hook" onChange={(e) => setRef({ angle: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="goal">Goal</Label><Input id="goal" value={refinements.goal ?? ''} placeholder="signups / feedback / stars" onChange={(e) => setRef({ goal: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="tone">Tone</Label><Input id="tone" value={refinements.tone ?? ''} placeholder="bold, friendly, technical…" onChange={(e) => setRef({ tone: e.target.value })} /></div>
        </div>
      </section>

      <Button onClick={onGenerate} disabled={generating} className="w-full">
        {generating ? 'Generating your kit…' : 'Generate Post Kit'}
      </Button>
    </div>
  )
}
```
`index.ts`: `export { ContextReview } from './ContextReview'`

- [ ] **Step 3: Typecheck + commit**

Run: `pnpm exec tsc --noEmit` → Expected: pass.
```bash
git add components/context-review
git commit -m "feat: add ContextReview step"
```

---

### Task 12: Section components (the 5 Post Kit sections)

**Files:** five folders under `components/post-kit/sections/`, each with `index.ts`, `*.tsx`, `*.types.ts`. All share this props shape:
```ts
// reused per file with the matching component name
import type { LaunchKit } from '@/lib/types'
export type <Name>Props = { kit: LaunchKit; onRegenerate: () => void; regenerating: boolean }
```

- [ ] **Step 1: `CopySection/CopySection.tsx`**

```tsx
import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { CopySectionProps } from './CopySection.types'

export function CopySection({ kit, onRegenerate, regenerating }: CopySectionProps) {
  const { copy } = kit
  return (
    <SectionCard title="Name & copy" action={<Button variant="ghost" size="sm" onClick={onRegenerate} disabled={regenerating}>Regenerate</Button>}>
      <div className="space-y-1">
        <div className="text-xs uppercase text-muted-foreground">Tagline ({copy.tagline.length}/60)</div>
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium">{copy.tagline}</p>
          <CopyButton value={copy.tagline} />
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          {copy.taglineAlternatives.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-xs uppercase text-muted-foreground">Name ideas</div>
        <p>{copy.nameSuggestions.join(' · ')}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between"><span className="text-xs uppercase text-muted-foreground">Description</span><CopyButton value={copy.description} /></div>
        <p className="whitespace-pre-wrap">{copy.description}</p>
      </div>
    </SectionCard>
  )
}
```
`CopySection.types.ts`:
```ts
import type { LaunchKit } from '@/lib/types'
export type CopySectionProps = { kit: LaunchKit; onRegenerate: () => void; regenerating: boolean }
```
`index.ts`: `export { CopySection } from './CopySection'`

- [ ] **Step 2: `TopicsCommentSection/TopicsCommentSection.tsx`**

```tsx
import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { TopicsCommentSectionProps } from './TopicsCommentSection.types'

export function TopicsCommentSection({ kit, onRegenerate, regenerating }: TopicsCommentSectionProps) {
  return (
    <SectionCard title="Topics & first comment" action={<Button variant="ghost" size="sm" onClick={onRegenerate} disabled={regenerating}>Regenerate</Button>}>
      <div className="flex flex-wrap gap-1">{kit.topics.map((t) => <Badge key={t}>{t}</Badge>)}</div>
      <div className="space-y-1">
        <div className="flex items-center justify-between"><span className="text-xs uppercase text-muted-foreground">Maker's first comment</span><CopyButton value={kit.firstComment} /></div>
        <p className="whitespace-pre-wrap">{kit.firstComment}</p>
      </div>
    </SectionCard>
  )
}
```
`TopicsCommentSection.types.ts`:
```ts
import type { LaunchKit } from '@/lib/types'
export type TopicsCommentSectionProps = { kit: LaunchKit; onRegenerate: () => void; regenerating: boolean }
```
`index.ts`: `export { TopicsCommentSection } from './TopicsCommentSection'`

- [ ] **Step 3: `GallerySection/GallerySection.tsx`**

```tsx
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import type { GallerySectionProps } from './GallerySection.types'

export function GallerySection({ kit, onRegenerate, regenerating }: GallerySectionProps) {
  return (
    <SectionCard title="Gallery shot list" action={<Button variant="ghost" size="sm" onClick={onRegenerate} disabled={regenerating}>Regenerate</Button>}>
      <ol className="space-y-3">
        {kit.gallery.shots.map((s, i) => (
          <li key={i} className="rounded-md border p-3">
            <div className="font-medium">{i + 1}. {s.title} <span className="font-normal text-muted-foreground">— {s.purpose}</span></div>
            <div className="text-muted-foreground">Caption: {s.caption}</div>
            <div className="text-muted-foreground">Layout: {s.layoutHint}</div>
          </li>
        ))}
      </ol>
    </SectionCard>
  )
}
```
`GallerySection.types.ts`:
```ts
import type { LaunchKit } from '@/lib/types'
export type GallerySectionProps = { kit: LaunchKit; onRegenerate: () => void; regenerating: boolean }
```
`index.ts`: `export { GallerySection } from './GallerySection'`

- [ ] **Step 4: `VideoSection/VideoSection.tsx`**

```tsx
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import type { VideoSectionProps } from './VideoSection.types'

export function VideoSection({ kit, onRegenerate, regenerating }: VideoSectionProps) {
  const { video } = kit
  return (
    <SectionCard title="Demo video storyboard" action={<Button variant="ghost" size="sm" onClick={onRegenerate} disabled={regenerating}>Regenerate</Button>}>
      <p><span className="font-medium">Hook:</span> {video.hook}</p>
      <p className="text-muted-foreground">Length ~{video.lengthSec}s · CTA: {video.cta}</p>
      <ol className="space-y-2">
        {video.scenes.map((s, i) => (
          <li key={i} className="rounded-md border p-2">
            <span className="font-mono text-xs text-primary">{s.timeRange}</span> — {s.visual}
            <div className="text-muted-foreground">On-screen: {s.onScreenText}</div>
          </li>
        ))}
      </ol>
    </SectionCard>
  )
}
```
`VideoSection.types.ts`:
```ts
import type { LaunchKit } from '@/lib/types'
export type VideoSectionProps = { kit: LaunchKit; onRegenerate: () => void; regenerating: boolean }
```
`index.ts`: `export { VideoSection } from './VideoSection'`

- [ ] **Step 5: `LaunchOpsSection/LaunchOpsSection.tsx`**

```tsx
import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import { Button } from '@/components/ui/button'
import type { LaunchOpsSectionProps } from './LaunchOpsSection.types'

export function LaunchOpsSection({ kit, onRegenerate, regenerating }: LaunchOpsSectionProps) {
  const { launch } = kit
  return (
    <SectionCard title="Launch ops" action={<Button variant="ghost" size="sm" onClick={onRegenerate} disabled={regenerating}>Regenerate</Button>}>
      <p className="font-medium">Best time: {launch.recommendedDay}, {launch.recommendedTimePT}</p>
      <div>
        <div className="text-xs uppercase text-muted-foreground">Pre-launch</div>
        <ul className="list-disc pl-5">{launch.prelaunchChecklist.map((c) => <li key={c}>{c}</li>)}</ul>
      </div>
      <div>
        <div className="text-xs uppercase text-muted-foreground">Launch day</div>
        <ul className="list-disc pl-5">{launch.launchDayChecklist.map((c) => <li key={c}>{c}</li>)}</ul>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between"><span className="text-xs uppercase text-muted-foreground">Hunter outreach</span><CopyButton value={launch.outreach.hunter} /></div>
        <p className="whitespace-pre-wrap">{launch.outreach.hunter}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between"><span className="text-xs uppercase text-muted-foreground">Supporter outreach</span><CopyButton value={launch.outreach.supporters} /></div>
        <p className="whitespace-pre-wrap">{launch.outreach.supporters}</p>
      </div>
    </SectionCard>
  )
}
```
`LaunchOpsSection.types.ts`:
```ts
import type { LaunchKit } from '@/lib/types'
export type LaunchOpsSectionProps = { kit: LaunchKit; onRegenerate: () => void; regenerating: boolean }
```
`index.ts`: `export { LaunchOpsSection } from './LaunchOpsSection'`

- [ ] **Step 6: Typecheck + commit**

Run: `pnpm exec tsc --noEmit` → Expected: pass.
```bash
git add components/post-kit/sections
git commit -m "feat: add the five Post Kit section components"
```

---

### Task 13: PostKit shell + WizardStepper

**Files:**
- Create: `components/wizard/WizardStepper/` and `components/post-kit/PostKit/`

- [ ] **Step 1: `components/wizard/WizardStepper/WizardStepper.tsx`**

```tsx
import type { WizardStepperProps } from './WizardStepper.types'

const STEPS = [{ key: 'folder', label: 'Folder' }, { key: 'review', label: 'Review context' }, { key: 'kit', label: 'Post Kit' }] as const

export function WizardStepper({ current }: WizardStepperProps) {
  return (
    <ol className="mx-auto flex max-w-md items-center justify-center gap-2 py-4 text-sm">
      {STEPS.map((s, i) => {
        const active = s.key === current
        return (
          <li key={s.key} className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
            <span className={active ? 'font-medium' : 'text-muted-foreground'}>{s.label}</span>
            {i < STEPS.length - 1 && <span className="text-muted-foreground">·</span>}
          </li>
        )
      })}
    </ol>
  )
}
```
`WizardStepper.types.ts`:
```ts
import type { WizardStep } from '@/lib/wizard/wizard-reducer'
export type WizardStepperProps = { current: WizardStep }
```
`index.ts`: `export { WizardStepper } from './WizardStepper'`

- [ ] **Step 2: `components/post-kit/PostKit/PostKit.constants.ts`**

```ts
import type { SectionKey } from '@/lib/types'
export const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'copy', label: 'Name & copy' },
  { key: 'topicsComment', label: 'Topics + comment' },
  { key: 'gallery', label: 'Gallery shots' },
  { key: 'video', label: 'Video script' },
  { key: 'launch', label: 'Launch ops' },
]
```

- [ ] **Step 3: `components/post-kit/PostKit/PostKit.types.ts`**

```ts
import type { LaunchKit, SectionKey } from '@/lib/types'
export type PostKitProps = {
  kit: LaunchKit
  onRegenerateSection: (section: SectionKey) => void
  regeneratingSection: SectionKey | null
  onExportMarkdown: () => void
  onCopyAll: () => void
  onStartOver: () => void
}
```

- [ ] **Step 4: `components/post-kit/PostKit/PostKit.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CopySection } from '@/components/post-kit/sections/CopySection'
import { TopicsCommentSection } from '@/components/post-kit/sections/TopicsCommentSection'
import { GallerySection } from '@/components/post-kit/sections/GallerySection'
import { VideoSection } from '@/components/post-kit/sections/VideoSection'
import { LaunchOpsSection } from '@/components/post-kit/sections/LaunchOpsSection'
import { SECTIONS } from './PostKit.constants'
import type { PostKitProps } from './PostKit.types'
import type { SectionKey } from '@/lib/types'

export function PostKit({ kit, onRegenerateSection, regeneratingSection, onExportMarkdown, onCopyAll, onStartOver }: PostKitProps) {
  const [active, setActive] = useState<SectionKey>('copy')
  const busy = (k: SectionKey) => regeneratingSection === k

  return (
    <div className="mx-auto flex max-w-5xl gap-6 px-4">
      <nav className="sticky top-4 hidden h-fit w-48 shrink-0 flex-col gap-1 md:flex">
        {SECTIONS.map((s) => (
          <button key={s.key} onClick={() => setActive(s.key)}
            className={`rounded-md px-3 py-2 text-left text-sm ${active === s.key ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            {s.label}
          </button>
        ))}
        <div className="mt-3 flex flex-col gap-2">
          <Button variant="outline" size="sm" onClick={onCopyAll}>Copy all</Button>
          <Button size="sm" onClick={onExportMarkdown}>Export Markdown</Button>
          <Button variant="ghost" size="sm" onClick={onStartOver}>Start over</Button>
        </div>
      </nav>

      <div className="min-w-0 flex-1 space-y-4">
        {active === 'copy' && <CopySection kit={kit} onRegenerate={() => onRegenerateSection('copy')} regenerating={busy('copy')} />}
        {active === 'topicsComment' && <TopicsCommentSection kit={kit} onRegenerate={() => onRegenerateSection('topicsComment')} regenerating={busy('topicsComment')} />}
        {active === 'gallery' && <GallerySection kit={kit} onRegenerate={() => onRegenerateSection('gallery')} regenerating={busy('gallery')} />}
        {active === 'video' && <VideoSection kit={kit} onRegenerate={() => onRegenerateSection('video')} regenerating={busy('video')} />}
        {active === 'launch' && <LaunchOpsSection kit={kit} onRegenerate={() => onRegenerateSection('launch')} regenerating={busy('launch')} />}
      </div>
    </div>
  )
}
```
`index.ts`: `export { PostKit } from './PostKit'`

- [ ] **Step 5: Typecheck + commit**

Run: `pnpm exec tsc --noEmit` → Expected: pass.
```bash
git add components/wizard components/post-kit/PostKit
git commit -m "feat: add WizardStepper and PostKit shell"
```

---

### Task 14: Page wiring + layout

**Files:**
- Modify: `app/layout.tsx` (add AppHeader + Toaster + WizardProvider)
- Replace: `app/page.tsx`

- [ ] **Step 1: Update `app/layout.tsx`**

Keep the generated font setup; ensure the `<body>` wraps children like this:
```tsx
import { WizardProvider } from '@/lib/wizard/WizardProvider'
import { AppHeader } from '@/components/brand/AppHeader'
import { Toaster } from '@/components/ui/sonner'

// inside <body className=...>
<WizardProvider>
  <AppHeader />
  <main className="py-8">{children}</main>
</WizardProvider>
<Toaster richColors position="top-center" />
```

- [ ] **Step 2: Replace `app/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { useWizard } from '@/lib/wizard/useWizard'
import { WizardStepper } from '@/components/wizard/WizardStepper'
import { FolderSelect } from '@/components/folder-select/FolderSelect'
import { ContextReview } from '@/components/context-review/ContextReview'
import { PostKit } from '@/components/post-kit/PostKit'
import { kitToMarkdown } from '@/lib/export/to-markdown'
import type { GenerateInput, SectionKey } from '@/lib/types'

export default function Home() {
  const { state, dispatch } = useWizard()
  const [generating, setGenerating] = useState(false)
  const [regenSection, setRegenSection] = useState<SectionKey | null>(null)

  async function generate(section?: SectionKey) {
    if (!state.context) return
    const input: GenerateInput & { section?: SectionKey } = { context: state.context, refinements: state.refinements, section }
    section ? setRegenSection(section) : setGenerating(true)
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      if (section) dispatch({ type: 'PATCH_KIT', patch: data.patch })
      else dispatch({ type: 'GENERATED', kit: data.kit })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      section ? setRegenSection(null) : setGenerating(false)
    }
  }

  function exportMarkdown() {
    if (!state.kit) return
    const blob = new Blob([kitToMarkdown(state.kit)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'launch-kit.md'; a.click()
    URL.revokeObjectURL(url)
  }

  async function copyAll() {
    if (!state.kit) return
    await navigator.clipboard.writeText(kitToMarkdown(state.kit))
    toast.success('Full kit copied')
  }

  return (
    <div className="space-y-6">
      <WizardStepper current={state.step} />
      {state.step === 'folder' && (
        <FolderSelect path={state.path}
          onPathChange={(path) => dispatch({ type: 'SET_PATH', path })}
          onAnalyzed={(context) => dispatch({ type: 'ANALYZED', context })} />
      )}
      {state.step === 'review' && state.context && (
        <ContextReview context={state.context} refinements={state.refinements}
          onContextChange={(context) => dispatch({ type: 'EDIT_CONTEXT', context })}
          onRefinementsChange={(refinements) => dispatch({ type: 'EDIT_REFINEMENTS', refinements })}
          onGenerate={() => generate()} generating={generating} />
      )}
      {state.step === 'kit' && state.kit && (
        <PostKit kit={state.kit}
          onRegenerateSection={(s) => generate(s)} regeneratingSection={regenSection}
          onExportMarkdown={exportMarkdown} onCopyAll={copyAll}
          onStartOver={() => dispatch({ type: 'RESET' })} />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Typecheck + build**

Run: `pnpm exec tsc --noEmit` and `pnpm build` → Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: wire wizard flow into the home page"
```

---

### Task 15: Full verification (manual end-to-end)

- [ ] **Step 1: Run the whole test suite**

Run: `pnpm vitest run` → Expected: all tests pass.

- [ ] **Step 2: Manual happy path**

Run `pnpm dev`. In the browser at `http://localhost:3000`:
1. Paste this project's own absolute path → "Analyze folder". Expect step 2 with the detected name/summary/tech badges.
2. Add audience "indie developers", tone "bold" → "Generate Post Kit".
3. In the Post Kit, click through all five sections. Verify: tagline ≤ 60 chars, copy buttons toast, "Regenerate" on a section updates content, "Export Markdown" downloads `launch-kit.md`, "Copy all" toasts.
4. Refresh the page → state persists (still on the kit). "Start over" → returns to step 1.

- [ ] **Step 3: Manual error path**

Enter a bogus path like `/no/such/dir` → "Analyze folder". Expect a red toast with a clear message, no crash.

- [ ] **Step 4: Commit any fixes, then final commit**

```bash
git add -A
git commit -m "test: verify end-to-end launch kit flow" --allow-empty
```

---

## Self-Review Notes

- **Spec coverage:** folder access (Task 3-4), guided media/storyboard (mock provider + Gallery/Video sections, Tasks 5/12), all four section buckets (Task 12), mock-now/OpenRouter-later abstraction (Task 5), 3-step wizard + Post Kit (Tasks 8/10/11/13/14), Markdown export (Task 7/14), localStorage (Task 8), zod validation (Task 2/5), PH theme (Task 1/9), vitest tests (Tasks 2,3,5,7,8). All covered.
- **Type consistency:** `SectionKey` values (`copy`,`topicsComment`,`gallery`,`video`,`launch`) match across `types.ts`, `PostKit.constants.ts`, mock provider, and route. `PATCH_KIT` uses `Partial<LaunchKit>` consistent with `generateSection`'s return.
