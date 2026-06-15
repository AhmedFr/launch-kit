// Simulated stages shown while the (single-shot) generation runs. The API has
// no streaming progress, so we pace these to roughly match a ~30-45s response.
export const GENERATION_STAGES = [
  'Studying your README & stack',
  'Writing names & taglines',
  'Choosing topics & the first comment',
  'Art-directing the gallery shots',
  'Storyboarding the demo video',
  'Planning launch day & outreach',
] as const

export const STAGE_INTERVAL_MS = 5000
