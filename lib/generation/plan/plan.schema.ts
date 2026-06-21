import { z } from 'zod'

// A cross-platform, product-tailored launch plan: the L-6w→L+4w timeline, the
// 30/7/48h countdowns, an SEO/GEO checklist, and the post-launch momentum cadence.
export const launchPlanSchema = z.object({
  phases: z.array(z.object({ window: z.string(), goal: z.string(), tasks: z.array(z.string()) })),
  countdown30: z.array(z.string()),
  countdown7: z.array(z.string()),
  countdown48h: z.array(z.string()),
  seoGeo: z.array(z.string()),
  momentum: z.array(z.string()),
})
