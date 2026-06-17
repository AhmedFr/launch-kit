import { z } from 'zod'

// Reddit: which subreddits to post in, the post itself, and how to behave in the comments.
export const redditSchema = z.object({
  subreddits: z.array(z.object({ name: z.string(), why: z.string() })),
  title: z.string(),
  body: z.string(),
  replyEtiquette: z.array(z.string()),
})
