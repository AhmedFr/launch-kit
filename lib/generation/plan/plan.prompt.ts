import type { GenerateInput, LaunchCore } from '@/lib/types'
import { PLAYBOOK_PRINCIPLES, renderCore, renderRefinements } from '../prompt-shared'

export const PLAN_SYSTEM = [
  PLAYBOOK_PRINCIPLES,
  '',
  'You are a launch operator who plans multi-channel product launches end to end.',
  'You sequence a launch over ~10 weeks (L-6 weeks to L+4 weeks) so channels amplify each other instead of cannibalizing: strategy, then assets, then partnerships, then content, then launch week, then momentum.',
  'Every task must be concrete and specific to THIS product, its audience, and its keywords — no generic filler.',
  'You ALWAYS reply with a single raw JSON object and nothing else — no markdown, no code fences, no commentary.',
].join('\n')

const SHAPE = `{
  "phases": [
    { "window": "e.g. L-6 weeks", "goal": "the milestone for this window", "tasks": ["2-4 concrete tasks for this product"] }
  ],
  "countdown30": ["4-6 tasks for the 30-day pre-launch countdown"],
  "countdown7": ["4-6 tasks for the 7-day countdown"],
  "countdown48h": ["4-6 tasks for the final 48 hours"],
  "seoGeo": ["4-6 SEO/GEO tasks using this product's keywords: IndexNow, schema markup, a launch blog post, backlink capture, and optimizing to be cited by AI search"],
  "momentum": ["4-6 post-launch tasks across the 7-day and 30-day follow-up cadence"]
}`

export function buildPlanPrompt(core: LaunchCore, input: GenerateInput): string {
  return [
    'Write a complete, product-specific launch plan covering the full timeline and the pre-launch countdowns.',
    '',
    renderCore(core),
    renderRefinements(input),
    '',
    'Return ONLY a JSON object that matches this exact shape (same keys, no extras):',
    SHAPE,
    '',
    'Cover the phases from L-6 weeks through L+4 weeks. Make SEO/GEO tasks reference the keywords above. Keep every task actionable.',
  ]
    .filter(Boolean)
    .join('\n')
}
