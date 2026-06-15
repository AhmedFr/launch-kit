import type { ComponentType } from 'react'
import type { PlatformId } from '@/lib/platforms'
import type { PreviewProps } from './preview.types'
import { ProductHuntPreview } from '@/components/preview/ProductHuntPreview'

// Maps a platform to its preview renderer. Each platform's preview lives in its
// own component folder; adding one here is the only integration step.
export const PREVIEWS: Partial<Record<PlatformId, ComponentType<PreviewProps>>> = {
  'product-hunt': ProductHuntPreview,
}

export function hasPreview(id: PlatformId): boolean {
  return Boolean(PREVIEWS[id])
}
