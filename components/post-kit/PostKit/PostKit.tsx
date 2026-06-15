'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CopySection } from '@/components/post-kit/sections/CopySection'
import { TopicsCommentSection } from '@/components/post-kit/sections/TopicsCommentSection'
import { GallerySection } from '@/components/post-kit/sections/GallerySection'
import { VideoSection } from '@/components/post-kit/sections/VideoSection'
import { LaunchOpsSection } from '@/components/post-kit/sections/LaunchOpsSection'
import { SECTIONS } from './PostKit.constants'
import type { PostKitProps } from './PostKit.types'
import type { SectionKey } from '@/lib/types'

export function PostKit({
  kit,
  onRegenerateSection,
  regeneratingSection,
  onExportMarkdown,
  onCopyAll,
  onStartOver,
}: PostKitProps) {
  const [active, setActive] = useState<SectionKey>('copy')
  const busy = (k: SectionKey) => regeneratingSection === k

  return (
    <div className="mx-auto flex max-w-5xl gap-6 px-4">
      <nav className="sticky top-4 hidden h-fit w-48 shrink-0 flex-col gap-1 md:flex">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`rounded-md px-3 py-2 text-left text-sm ${active === s.key ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted'}`}
          >
            {s.label}
          </button>
        ))}
        <div className="mt-3 flex flex-col gap-2">
          <Button variant="outline" size="sm" onClick={onCopyAll}>Copy all</Button>
          <Button size="sm" onClick={onExportMarkdown}>Export Markdown</Button>
          <Button variant="ghost" size="sm" onClick={onStartOver}>Start over</Button>
        </div>
      </nav>

      <div className="min-w-0 flex-1 space-y-4">
        {active === 'copy' && <CopySection kit={kit} onRegenerate={() => onRegenerateSection('copy')} regenerating={busy('copy')} />}
        {active === 'topicsComment' && <TopicsCommentSection kit={kit} onRegenerate={() => onRegenerateSection('topicsComment')} regenerating={busy('topicsComment')} />}
        {active === 'gallery' && <GallerySection kit={kit} onRegenerate={() => onRegenerateSection('gallery')} regenerating={busy('gallery')} />}
        {active === 'video' && <VideoSection kit={kit} onRegenerate={() => onRegenerateSection('video')} regenerating={busy('video')} />}
        {active === 'launch' && <LaunchOpsSection kit={kit} onRegenerate={() => onRegenerateSection('launch')} regenerating={busy('launch')} />}
      </div>
    </div>
  )
}
