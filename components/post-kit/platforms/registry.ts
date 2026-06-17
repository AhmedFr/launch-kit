import type { ComponentType } from 'react'
import type { PlatformId } from '@/lib/platforms'
import type { PlatformSectionsProps } from './platform-sections.types'
import { ProductHuntSections } from './ProductHuntSections'
import { HackerNewsSections } from './HackerNewsSections'
import { RedditSections } from './RedditSections'
import { AppSumoSections } from './AppSumoSections'

// Maps a platform to its edit-view section group. Adding a platform's editor is
// a single entry here plus its <Platform>Sections component folder.
export const PLATFORM_SECTIONS: Partial<Record<PlatformId, ComponentType<PlatformSectionsProps>>> = {
  'product-hunt': ProductHuntSections,
  appsumo: AppSumoSections,
  'hacker-news': HackerNewsSections,
  reddit: RedditSections,
}
