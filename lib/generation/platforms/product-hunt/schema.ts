import { z } from 'zod'

const shotSchema = z.object({ title: z.string(), purpose: z.string(), caption: z.string(), layoutHint: z.string() })
const sceneSchema = z.object({ timeRange: z.string(), visual: z.string(), onScreenText: z.string() })

// Product Hunt: the richest format — copy, topics, maker comment, gallery, video, launch ops.
export const productHuntSchema = z.object({
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
    // Playbook additions — optional for back-compat with kits persisted before they existed.
    hourByHour: z.array(z.object({ timePT: z.string(), action: z.string() })).optional(),
    momentumTactics: z.array(z.string()).optional(),
    commentModeration: z.array(z.string()).optional(),
    outreach: z.object({ hunter: z.string(), supporters: z.string() }),
  }),
})
