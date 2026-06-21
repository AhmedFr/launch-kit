import type { GenerateInput, LaunchCore } from '@/lib/types'
import { PLAYBOOK_PRINCIPLES, renderCore, renderRefinements } from '../../prompt-shared'

export const PRODUCT_HUNT_SYSTEM = [
  PLAYBOOK_PRINCIPLES,
  '',
  'You are an expert Product Hunt launch strategist and copywriter.',
  'Product Hunt rewards punchy, specific, maker-energy copy with a strong visual story.',
  'A top-5 finish comes from concentrated, genuine supporters posting at 12:01 AM PT and from comments that keep momentum — not from spread-thin, generic asks.',
  'You ALWAYS reply with a single raw JSON object and nothing else — no markdown, no code fences, no commentary.',
].join('\n')

const SHAPE = `{
  "copy": {
    "nameSuggestions": ["3 product name ideas (strings)"],
    "tagline": "the single best tagline, MAX 60 characters",
    "taglineAlternatives": ["2 alternative taglines, each MAX 60 characters"],
    "description": "2-4 short paragraphs; \\n for line breaks"
  },
  "topics": ["3-5 relevant Product Hunt topics/categories"],
  "firstComment": "the maker's first comment: a short story + an ask to commenters",
  "gallery": {
    "shots": [
      { "title": "string", "purpose": "why this image earns the click", "caption": "string", "layoutHint": "concrete art-direction the user can shoot" }
    ]
  },
  "video": {
    "hook": "the first-3-seconds hook line",
    "scenes": [ { "timeRange": "e.g. 0-3s", "visual": "what to film/record", "onScreenText": "text overlay" } ],
    "lengthSec": 45,
    "cta": "closing call to action"
  },
  "launch": {
    "recommendedDay": "e.g. Tuesday",
    "recommendedTimePT": "e.g. 12:01 AM PT",
    "prelaunchChecklist": ["4-5 concrete pre-launch tasks"],
    "launchDayChecklist": ["4-5 concrete launch-day tasks"],
    "outreach": {
      "hunter": "a DM asking someone to hunt the product (use {name})",
      "supporters": "a message rallying supporters (use {link})"
    }
  }
}`

export function buildProductHuntPrompt(core: LaunchCore, input: GenerateInput): string {
  return [
    'Write a complete Product Hunt launch kit for this product.',
    '',
    renderCore(core),
    renderRefinements(input),
    '',
    'Return ONLY a JSON object that matches this exact shape (same keys, no extras):',
    SHAPE,
    '',
    'Provide 4 gallery shots and 4-5 video scenes. Keep the tagline at or under 60 characters.',
  ]
    .filter(Boolean)
    .join('\n')
}
