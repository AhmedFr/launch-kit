import { z } from 'zod'

// The shared, platform-agnostic essence every platform's content is written from.
// keywords/icp/valueProp are optional so cores persisted before this field existed
// still validate; new generations always populate them.
export const launchCoreSchema = z.object({
  productName: z.string(),
  essence: z.string(),
  audience: z.string(),
  problem: z.string(),
  features: z.array(z.string()),
  differentiators: z.array(z.string()),
  keywords: z.array(z.string()).optional(),
  icp: z.string().optional(),
  valueProp: z.string().optional(),
})

export type LaunchCoreSchema = z.infer<typeof launchCoreSchema>
