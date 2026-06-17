import { CopySection } from '@/components/post-kit/sections/CopySection'
import { TopicsCommentSection } from '@/components/post-kit/sections/TopicsCommentSection'
import { GallerySection } from '@/components/post-kit/sections/GallerySection'
import { VideoSection } from '@/components/post-kit/sections/VideoSection'
import { LaunchOpsSection } from '@/components/post-kit/sections/LaunchOpsSection'
import type { ProductHuntContent } from '@/lib/types'
import type { PlatformSectionsProps } from '../platform-sections.types'

export function ProductHuntSections({ content, loading }: PlatformSectionsProps) {
  const kit = content as ProductHuntContent
  return (
    <div className="space-y-4">
      <CopySection kit={kit} loading={loading} />
      <TopicsCommentSection kit={kit} loading={loading} />
      <GallerySection kit={kit} loading={loading} />
      <VideoSection kit={kit} loading={loading} />
      <LaunchOpsSection kit={kit} loading={loading} />
    </div>
  )
}
