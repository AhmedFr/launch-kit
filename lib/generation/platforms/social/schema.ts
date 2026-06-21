import { z } from 'zod'

// Social / KOL: an X launch thread, cold-outreach DMs for each network, a UGC ask, and posting tips.
export const socialSchema = z.object({
  thread: z.object({ tweets: z.array(z.string()) }),
  kolOutreach: z.object({ twitter: z.string(), linkedin: z.string(), telegram: z.string() }),
  ugcAsk: z.string(),
  postingTips: z.object({ bestTimeET: z.string(), hashtags: z.array(z.string()) }),
})
