import type { GenerateInput } from '@/lib/types'
import { renderFacts } from '../prompt-shared'

export const CORE_SYSTEM_PROMPT = [
  'You are a product positioning strategist.',
  'You distill a product into its platform-neutral essence so launch copy can later be written for any audience.',
  'You ALWAYS reply with a single raw JSON object and nothing else — no markdown, no code fences, no commentary.',
].join(' ')

const CORE_SHAPE = `{
  "productName": "the product's name",
  "essence": "1-2 sentences: what it is and the core value — platform-neutral, no marketing fluff",
  "audience": "who it is for",
  "problem": "the concrete problem it solves",
  "features": ["3-6 concrete capabilities"],
  "differentiators": ["2-4 reasons it is different or better"]
}`

export function buildCorePrompt(input: GenerateInput): string {
  return [
    'Distill this product into a platform-neutral core that launch copy can be written from.',
    '',
    renderFacts(input),
    '',
    'Return ONLY a JSON object that matches this exact shape (same keys, no extras):',
    CORE_SHAPE,
  ].join('\n')
}
