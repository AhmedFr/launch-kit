import type { ComponentType } from 'react'
import type { PlatformId } from '@/lib/platforms'
import type { PreviewProps } from './preview.types'
import { ProductHuntPreview } from '@/components/preview/ProductHuntPreview'
import { AppSumoPreview } from '@/components/preview/AppSumoPreview'
import { HackerNewsPreview } from '@/components/preview/HackerNewsPreview'
import { RedditPreview } from '@/components/preview/RedditPreview'

// Maps a platform to its preview renderer. Each platform's preview lives in its
// own component folder; adding one here is the only integration step.
export const PREVIEWS: Partial<Record<PlatformId, ComponentType<PreviewProps>>> = {
  'product-hunt': ProductHuntPreview,
  appsumo: AppSumoPreview,
  'hacker-news': HackerNewsPreview,
  reddit: RedditPreview,
}

export function hasPreview(id: PlatformId): boolean {
  return Boolean(PREVIEWS[id])
}
