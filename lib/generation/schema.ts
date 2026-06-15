import { z } from 'zod'

const shotSchema = z.object({ title: z.string(), purpose: z.string(), caption: z.string(), layoutHint: z.string() })
const sceneSchema = z.object({ timeRange: z.string(), visual: z.string(), onScreenText: z.string() })

export const launchKitSchema = z.object({
  copy: z.object({
    nameSuggestions: z.array(z.string()),
    tagline: z.string(),
    taglineAlternatives: z.array(z.string()),
    description: z.string(),
  }),
  topics: z.array(z.string()),
  firstComment: z.string(),
  gallery: z.object({ shots: z.array(shotSchema) }),
  video: z.object({ hook: z.string(), scenes: z.array(sceneSchema), lengthSec: z.number(), cta: z.string() }),
  launch: z.object({
    recommendedDay: z.string(),
    recommendedTimePT: z.string(),
    prelaunchChecklist: z.array(z.string()),
    launchDayChecklist: z.array(z.string()),
    outreach: z.object({ hunter: z.string(), supporters: z.string() }),
  }),
})

export type LaunchKitSchema = z.infer<typeof launchKitSchema>
