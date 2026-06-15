// Launch platforms the kit can target. Product Hunt ships first; others are
// scaffolded here so adding them later is a one-line change plus a provider tweak.
export type PlatformId = 'product-hunt' | 'appsumo' | 'hacker-news' | 'reddit'

export type Platform = {
  id: PlatformId
  name: string
  blurb: string
  available: boolean
}

export const PLATFORMS: Platform[] = [
  { id: 'product-hunt', name: 'Product Hunt', blurb: 'The classic maker launch', available: true },
  { id: 'appsumo', name: 'AppSumo', blurb: 'Lifetime-deal marketplace', available: true },
  { id: 'hacker-news', name: 'Hacker News', blurb: 'Show HN', available: true },
  { id: 'reddit', name: 'Reddit', blurb: 'Subreddit launch post', available: true },
]

export const ACTIVE_PLATFORM: Platform = PLATFORMS[0]

export const UPCOMING_PLATFORMS: Platform[] = PLATFORMS.filter((p) => !p.available)
