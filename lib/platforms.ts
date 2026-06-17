// Launch platforms the kit can target. Each gets its own native, audience-tuned
// content; adding one is a new entry here plus its generator + preview + sections.
export type PlatformId = 'product-hunt' | 'appsumo' | 'hacker-news' | 'reddit'

export type Platform = {
  id: PlatformId
  name: string
  blurb: string
}

export const PLATFORMS: Platform[] = [
  { id: 'product-hunt', name: 'Product Hunt', blurb: 'The classic maker launch' },
  { id: 'appsumo', name: 'AppSumo', blurb: 'Lifetime-deal marketplace' },
  { id: 'hacker-news', name: 'Hacker News', blurb: 'Show HN' },
  { id: 'reddit', name: 'Reddit', blurb: 'Subreddit launch post' },
]
