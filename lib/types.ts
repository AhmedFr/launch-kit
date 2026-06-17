export type ProjectContext = {
  name: string
  oneLiner: string
  summary: string
  features: string[]
  techStack: string[]
  audience?: string
  problem?: string
  differentiators: string[]
  links: { label: string; url: string }[]
  readmeExcerpt: string
  warnings: string[]
}

export type Refinements = {
  angle?: string
  audience?: string
  goal?: string
  tone?: string
}

export type ShotSpec = { title: string; purpose: string; caption: string; layoutHint: string }
export type Scene = { timeRange: string; visual: string; onScreenText: string }

// The platform-agnostic essence of a launch. Generated once, never shown raw —
// it is the shared input every platform's content is written from.
export type LaunchCore = {
  productName: string
  essence: string
  audience: string
  problem: string
  features: string[]
  differentiators: string[]
}

// Product Hunt is the richest format: gallery, demo video, maker comment, hunter outreach.
export type ProductHuntContent = {
  copy: {
    nameSuggestions: string[]
    tagline: string
    taglineAlternatives: string[]
    description: string
  }
  topics: string[]
  firstComment: string
  gallery: { shots: ShotSpec[] }
  video: { hook: string; scenes: Scene[]; lengthSec: number; cta: string }
  launch: {
    recommendedDay: string
    recommendedTimePT: string
    prelaunchChecklist: string[]
    launchDayChecklist: string[]
    outreach: { hunter: string; supporters: string }
  }
}

// Back-compat alias: Product Hunt's content is the original "launch kit" shape.
export type LaunchKit = ProductHuntContent

// Hacker News is text-first, technical and humble — no gallery, no video.
export type HackerNewsContent = {
  title: string
  postBody: string
  firstComment: string
  postingTips: { bestTimeET: string; avoid: string[] }
}

// Reddit lives in the right subreddit with a value-first, non-salesy post.
export type RedditContent = {
  subreddits: { name: string; why: string }[]
  title: string
  body: string
  replyEtiquette: string[]
}

// AppSumo is a lifetime-deal marketplace listing.
export type AppSumoContent = {
  dealHeadline: string
  pitch: string
  whatsIncluded: string[]
  bestFor: string[]
  faq: { q: string; a: string }[]
}

// Maps each platform id to its own native content shape.
export type PlatformContentMap = {
  'product-hunt': ProductHuntContent
  appsumo: AppSumoContent
  'hacker-news': HackerNewsContent
  reddit: RedditContent
}

export type PlatformContent = PlatformContentMap[keyof PlatformContentMap]

// The full generation result: a shared core plus whichever platforms succeeded.
export type Generation = {
  core: LaunchCore
  platforms: Partial<PlatformContentMap>
}

export type GenerateInput = { context: ProjectContext; refinements: Refinements }
