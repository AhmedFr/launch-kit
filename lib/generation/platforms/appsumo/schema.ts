import { z } from 'zod'

// AppSumo: a lifetime-deal marketplace listing — headline, pitch, inclusions, fit, FAQ.
export const appSumoSchema = z.object({
  dealHeadline: z.string(),
  pitch: z.string(),
  whatsIncluded: z.array(z.string()),
  bestFor: z.array(z.string()),
  faq: z.array(z.object({ q: z.string(), a: z.string() })),
})
