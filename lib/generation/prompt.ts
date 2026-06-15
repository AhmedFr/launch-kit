import type { GenerateInput } from '@/lib/types'
import { ACTIVE_PLATFORM } from '@/lib/platforms'

export const SYSTEM_PROMPT = [
  `You are an expert ${ACTIVE_PLATFORM.name} launch strategist and copywriter.`,
  'You write punchy, specific, non-generic launch copy that converts.',
  'You ALWAYS reply with a single raw JSON object and nothing else — no markdown, no code fences, no commentary.',
].join(' ')

// The exact shape the model must return. Keep keys in sync with LaunchKit / launchKitSchema.
const KIT_SHAPE = `{
  "copy": {
    "nameSuggestions": ["3 product name ideas (strings)"],
    "tagline": "the single best tagline, MAX 60 characters",
    "taglineAlternatives": ["2 alternative taglines, each MAX 60 characters"],
    "description": "2-4 short paragraphs; \\n for line breaks"
  },
  "topics": ["3-5 relevant ${ACTIVE_PLATFORM.name} topics/categories"],
  "firstComment": "the maker's first comment: a short story + an ask to commenters",
  "gallery": {
    "shots": [
      { "title": "string", "purpose": "why this image earns the click", "caption": "string", "layoutHint": "concrete art-direction the user can shoot" }
    ]
  },
  "video": {
    "hook": "the first-3-seconds hook line",
    "scenes": [
      { "timeRange": "e.g. 0-3s", "visual": "what to film/record", "onScreenText": "text overlay" }
    ],
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

export function buildKitPrompt({ context, refinements }: GenerateInput): string {
  const facts = [
    `Product name: ${context.name}`,
    context.oneLiner && `One-liner: ${context.oneLiner}`,
    context.summary && `Summary: ${context.summary}`,
    context.features.length && `Features: ${context.features.join('; ')}`,
    context.techStack.length && `Tech stack: ${context.techStack.join(', ')}`,
    refinements.audience && `Target audience: ${refinements.audience}`,
    refinements.angle && `Angle / hook: ${refinements.angle}`,
    refinements.goal && `Launch goal: ${refinements.goal}`,
    refinements.tone && `Tone: ${refinements.tone}`,
    context.readmeExcerpt && `README excerpt:\n${context.readmeExcerpt}`,
  ].filter(Boolean).join('\n')

  return [
    `Create a complete ${ACTIVE_PLATFORM.name} launch kit for this product.`,
    '',
    facts,
    '',
    'Return ONLY a JSON object that matches this exact shape (same keys, no extras):',
    KIT_SHAPE,
    '',
    'Provide 4 gallery shots and 4-5 video scenes. Keep the tagline at or under 60 characters.',
  ].join('\n')
}
