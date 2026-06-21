import { CopySection } from '@/components/post-kit/sections/CopySection'
import { TopicsCommentSection } from '@/components/post-kit/sections/TopicsCommentSection'
import { GallerySection } from '@/components/post-kit/sections/GallerySection'
import { VideoSection } from '@/components/post-kit/sections/VideoSection'
import type { ProductHuntContent } from '@/lib/types'
import type { PlatformSectionsProps } from '../platform-sections.types'

// Launch-day ops live in their own "Launch ops" tab in PostKit, not in this edit view.
export function ProductHuntSections({ content, loading, onEdit }: PlatformSectionsProps) {
  const kit = content as ProductHuntContent
  return (
    <div className="space-y-4">
      <CopySection kit={kit} loading={loading} onEdit={onEdit} />
      <TopicsCommentSection kit={kit} loading={loading} onEdit={onEdit} />
      <GallerySection kit={kit} loading={loading} />
      <VideoSection kit={kit} loading={loading} />
    </div>
  )
}
