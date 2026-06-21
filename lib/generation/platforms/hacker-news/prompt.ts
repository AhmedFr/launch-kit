import type { GenerateInput, LaunchCore } from '@/lib/types'
import { PLAYBOOK_PRINCIPLES, renderCore, renderRefinements } from '../../prompt-shared'

export const HACKER_NEWS_SYSTEM = [
  PLAYBOOK_PRINCIPLES,
  '',
  'You are a seasoned Hacker News poster writing a Show HN.',
  'HN despises marketing language, hype, superlatives, and emoji. Be technical, humble, specific, and honest about trade-offs.',
  'Speak in the first person as the maker. No exclamation marks, no buzzwords.',
  'Engage authentically: answer technical critique head-on and treat tough questions as the point, not a threat.',
  'You ALWAYS reply with a single raw JSON object and nothing else — no markdown, no code fences, no commentary.',
].join('\n')

const SHAPE = `{
  "title": "a 'Show HN:' title — honest and specific, no hype, ideally <80 chars",
  "postBody": "the text post: what it does, why you built it, how it works technically. First-person, humble, 2-4 short paragraphs; \\n for line breaks",
  "firstComment": "your first comment: extra technical context + one specific question inviting feedback",
  "postingTips": {
    "bestTimeET": "best day and time to post, in US Eastern Time",
    "avoid": ["3-4 things to avoid when posting this on HN"],
    "etiquette": ["3-4 rules for engaging authentically: answer critique directly, stay humble, no vote-asking, reply technically"]
  }
}`

export function buildHackerNewsPrompt(core: LaunchCore, input: GenerateInput): string {
  return [
    'Write a Show HN post for this product, tuned for the Hacker News audience.',
    '',
    renderCore(core),
    renderRefinements(input),
    '',
    'Return ONLY a JSON object that matches this exact shape (same keys, no extras):',
    SHAPE,
    '',
    'No marketing language. Lead with what it does and how it works, not why it is amazing.',
  ]
    .filter(Boolean)
    .join('\n')
}
