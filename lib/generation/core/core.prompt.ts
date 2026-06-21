import type { GenerateInput } from '@/lib/types'
import { PLAYBOOK_PRINCIPLES, renderFacts } from '../prompt-shared'

export const CORE_SYSTEM_PROMPT = [
  PLAYBOOK_PRINCIPLES,
  '',
  'You are a product positioning strategist.',
  'You distill a product into its platform-neutral essence so launch copy can later be written for any audience.',
  'The essence and value proposition you extract must be defensible and benefit-led — the foundation every channel amplifies.',
  'You ALWAYS reply with a single raw JSON object and nothing else — no markdown, no code fences, no commentary.',
].join('\n')

const CORE_SHAPE = `{
  "productName": "the product's name",
  "essence": "1-2 sentences: what it is and the core value — platform-neutral, no marketing fluff",
  "audience": "who it is for",
  "problem": "the concrete problem it solves",
  "features": ["3-6 concrete capabilities"],
  "differentiators": ["2-4 reasons it is different or better"],
  "valueProp": "the single-sentence promise to the user that every channel will amplify",
  "icp": "the ideal customer profile — sharper and more specific than the broad audience",
  "keywords": ["5-8 search/topic keywords for SEO, Product Hunt topics and community targeting"]
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
