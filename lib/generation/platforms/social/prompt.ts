import type { GenerateInput, LaunchCore } from '@/lib/types'
import { PLAYBOOK_PRINCIPLES, renderCore, renderRefinements } from '../../prompt-shared'

export const SOCIAL_SYSTEM = [
  PLAYBOOK_PRINCIPLES,
  '',
  'You are a launch-savvy founder writing for X (Twitter) and running KOL/influencer outreach.',
  'Threads earn attention with a sharp hook, one idea per tweet, and a concrete payoff — not hype or thread-bait.',
  'Outreach DMs are short, specific, and personalized; they lead with why this matters to that creator and their audience, never a generic blast. A good cold DM earns roughly a 10-15% reply rate because it respects the reader.',
  'You ALWAYS reply with a single raw JSON object and nothing else — no markdown, no code fences, no commentary.',
].join('\n')

const SHAPE = `{
  "thread": {
    "tweets": ["5-8 tweets that form one launch thread; tweet 1 is the hook, the last is a clear CTA with the link; one idea per tweet, no hashtag spam"]
  },
  "kolOutreach": {
    "twitter": "a short cold DM for an X creator (use {name}); lead with why it fits their audience",
    "linkedin": "a short cold DM for a LinkedIn creator (use {name}); slightly more professional framing",
    "telegram": "a short cold DM for a Telegram group owner or KOL (use {name}); direct and community-aware"
  },
  "ugcAsk": "a message inviting an early user to make a short post/video about the product (UGC), framed around what's in it for them",
  "postingTips": {
    "bestTimeET": "best day and time to post the thread, in US Eastern Time",
    "hashtags": ["2-4 relevant, non-spammy hashtags"]
  }
}`

export function buildSocialPrompt(core: LaunchCore, input: GenerateInput): string {
  return [
    'Write a social launch kit for this product: an X (Twitter) launch thread, cold-outreach DMs for KOLs, and a UGC ask.',
    '',
    renderCore(core),
    renderRefinements(input),
    '',
    'Return ONLY a JSON object that matches this exact shape (same keys, no extras):',
    SHAPE,
    '',
    'Write 5-8 tweets. Keep each tweet tight enough to stand on its own. Make every DM feel personally written, not mass-sent.',
  ]
    .filter(Boolean)
    .join('\n')
}
