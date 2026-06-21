import { z } from 'zod'

// Hacker News: a Show HN title, a text post, the maker's first comment, and posting etiquette.
export const hackerNewsSchema = z.object({
  title: z.string(),
  postBody: z.string(),
  firstComment: z.string(),
  postingTips: z.object({
    bestTimeET: z.string(),
    avoid: z.array(z.string()),
    // Optional for back-compat with content persisted before this field existed.
    etiquette: z.array(z.string()).optional(),
  }),
})
