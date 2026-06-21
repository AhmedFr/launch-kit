import { z } from 'zod'

// Reddit: which subreddits to post in, the post itself, and how to behave in the comments.
export const redditSchema = z.object({
  // rulesNote is optional for back-compat with content persisted before it existed.
  subreddits: z.array(z.object({ name: z.string(), why: z.string(), rulesNote: z.string().optional() })),
  title: z.string(),
  body: z.string(),
  replyEtiquette: z.array(z.string()),
  postingTiming: z.string().optional(),
})
