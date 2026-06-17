import { z } from 'zod'

// The shared, platform-agnostic essence every platform's content is written from.
export const launchCoreSchema = z.object({
  productName: z.string(),
  essence: z.string(),
  audience: z.string(),
  problem: z.string(),
  features: z.array(z.string()),
  differentiators: z.array(z.string()),
})

export type LaunchCoreSchema = z.infer<typeof launchCoreSchema>
