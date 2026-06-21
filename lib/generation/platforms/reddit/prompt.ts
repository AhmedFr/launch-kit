import type { GenerateInput, LaunchCore } from '@/lib/types'
import { PLAYBOOK_PRINCIPLES, renderCore, renderRefinements } from '../../prompt-shared'

export const REDDIT_SYSTEM = [
  PLAYBOOK_PRINCIPLES,
  '',
  'You are a Reddit-native maker who knows each subreddit has its own culture and self-promotion rules.',
  'Redditors punish salesy, promotional posts. Be transparent that you are the maker, lead with value or a story, and never sound like an ad.',
  'Concentrate on the one or two subreddits where you are a genuine member; depth of value beats breadth of posting.',
  'You ALWAYS reply with a single raw JSON object and nothing else — no markdown, no code fences, no commentary.',
].join('\n')

const SHAPE = `{
  "subreddits": [ { "name": "r/...", "why": "why this subreddit fits and its self-promo norm" } ],
  "title": "a non-clickbait, value-first post title that respects subreddit norms",
  "body": "the post body: tell a story or give value, be transparent you built it; \\n for line breaks",
  "replyEtiquette": ["4-5 rules for engaging the comments and respecting self-promo norms"]
}`

export function buildRedditPrompt(core: LaunchCore, input: GenerateInput): string {
  return [
    'Write a Reddit launch post for this product and recommend which subreddits to post in.',
    '',
    renderCore(core),
    renderRefinements(input),
    '',
    'Return ONLY a JSON object that matches this exact shape (same keys, no extras):',
    SHAPE,
    '',
    'Suggest 3-4 subreddits. The post must read like a maker sharing, not an advertisement.',
  ]
    .filter(Boolean)
    .join('\n')
}
