import type { z } from 'zod'
import type { PlatformId } from '@/lib/platforms'
import type { GenerateInput, LaunchCore, PlatformContent } from '@/lib/types'

import { productHuntSchema } from './product-hunt/schema'
import { buildProductHuntPrompt, PRODUCT_HUNT_SYSTEM } from './product-hunt/prompt'
import { hackerNewsSchema } from './hacker-news/schema'
import { buildHackerNewsPrompt, HACKER_NEWS_SYSTEM } from './hacker-news/prompt'
import { redditSchema } from './reddit/schema'
import { buildRedditPrompt, REDDIT_SYSTEM } from './reddit/prompt'
import { appSumoSchema } from './appsumo/schema'
import { buildAppSumoPrompt, APPSUMO_SYSTEM } from './appsumo/prompt'
import { socialSchema } from './social/schema'
import { buildSocialPrompt, SOCIAL_SYSTEM } from './social/prompt'

// Everything needed to generate and validate one platform's content. Adding a
// platform is a single entry here plus its schema.ts + prompt.ts.
export type PlatformGenerator = {
  schema: z.ZodType<PlatformContent>
  system: string
  buildPrompt: (core: LaunchCore, input: GenerateInput) => string
}

export const PLATFORM_GENERATORS: Record<PlatformId, PlatformGenerator> = {
  'product-hunt': { schema: productHuntSchema, system: PRODUCT_HUNT_SYSTEM, buildPrompt: buildProductHuntPrompt },
  appsumo: { schema: appSumoSchema, system: APPSUMO_SYSTEM, buildPrompt: buildAppSumoPrompt },
  'hacker-news': { schema: hackerNewsSchema, system: HACKER_NEWS_SYSTEM, buildPrompt: buildHackerNewsPrompt },
  reddit: { schema: redditSchema, system: REDDIT_SYSTEM, buildPrompt: buildRedditPrompt },
  social: { schema: socialSchema, system: SOCIAL_SYSTEM, buildPrompt: buildSocialPrompt },
}
