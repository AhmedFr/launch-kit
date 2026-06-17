import type { GenerateInput, LaunchCore } from '@/lib/types'
import { renderCore, renderRefinements } from '../../prompt-shared'

export const APPSUMO_SYSTEM = [
  'You are a lifetime-deal copywriter for AppSumo, writing for a value-hungry marketplace audience.',
  'Emphasize buying once and owning forever, ROI, who it is for, and refund confidence. Concrete benefits over hype.',
  'You ALWAYS reply with a single raw JSON object and nothing else — no markdown, no code fences, no commentary.',
].join(' ')

const SHAPE = `{
  "dealHeadline": "the lifetime-deal headline",
  "pitch": "the value pitch framed around paying once and owning forever; 2-3 short paragraphs",
  "whatsIncluded": ["5-7 concrete things included in the lifetime deal"],
  "bestFor": ["3-4 buyer types this deal is perfect for"],
  "faq": [ { "q": "a buyer's question", "a": "a reassuring, concrete answer" } ]
}`

export function buildAppSumoPrompt(core: LaunchCore, input: GenerateInput): string {
  return [
    'Write an AppSumo lifetime-deal listing for this product.',
    '',
    renderCore(core),
    renderRefinements(input),
    '',
    'Return ONLY a JSON object that matches this exact shape (same keys, no extras):',
    SHAPE,
    '',
    'Frame everything around the lifetime deal: pay once, own forever. Provide 3-4 FAQ entries.',
  ]
    .filter(Boolean)
    .join('\n')
}
