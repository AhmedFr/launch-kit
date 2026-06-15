'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CopySection } from '@/components/post-kit/sections/CopySection'
import { TopicsCommentSection } from '@/components/post-kit/sections/TopicsCommentSection'
import { GallerySection } from '@/components/post-kit/sections/GallerySection'
import { VideoSection } from '@/components/post-kit/sections/VideoSection'
import { LaunchOpsSection } from '@/components/post-kit/sections/LaunchOpsSection'
import { ACTIVE_PLATFORM } from '@/lib/platforms'
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

  const navButton = (s: { key: SectionKey; label: string }) => (
    <button
      key={s.key}
      onClick={() => setActive(s.key)}
      className={[
        'whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition-colors',
        active === s.key
          ? 'bg-primary/10 font-medium text-primary'
          : 'text-muted-foreground hover:bg-muted',
      ].join(' ')}
    >
      {s.label}
    </button>
  )

  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="reveal reveal-1 mb-7 text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">
          Your {ACTIVE_PLATFORM.name} kit is ready
        </span>
        <h2 className="font-display mx-auto mt-2 max-w-2xl text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {kit.copy.tagline}
        </h2>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* mobile section tabs */}
        <nav className="-mx-6 flex gap-1 overflow-x-auto px-6 pb-1 md:hidden">
          {SECTIONS.map(navButton)}
        </nav>

        {/* desktop sidebar */}
        <aside className="reveal reveal-2 sticky top-20 hidden h-fit w-52 shrink-0 flex-col gap-1 rounded-2xl border border-border bg-card p-2 shadow-sm md:flex">
          {SECTIONS.map(navButton)}
          <div className="my-2 h-px bg-border" />
          <Button variant="outline" size="sm" onClick={onCopyAll}>Copy all</Button>
          <Button size="sm" onClick={onExportMarkdown}>Export Markdown</Button>
          <Button variant="ghost" size="sm" onClick={onStartOver}>Start over</Button>
        </aside>

        <div className="min-w-0 flex-1 space-y-4" key={active}>
          {active === 'copy' && <CopySection kit={kit} onRegenerate={() => onRegenerateSection('copy')} regenerating={busy('copy')} />}
          {active === 'topicsComment' && <TopicsCommentSection kit={kit} onRegenerate={() => onRegenerateSection('topicsComment')} regenerating={busy('topicsComment')} />}
          {active === 'gallery' && <GallerySection kit={kit} onRegenerate={() => onRegenerateSection('gallery')} regenerating={busy('gallery')} />}
          {active === 'video' && <VideoSection kit={kit} onRegenerate={() => onRegenerateSection('video')} regenerating={busy('video')} />}
          {active === 'launch' && <LaunchOpsSection kit={kit} onRegenerate={() => onRegenerateSection('launch')} regenerating={busy('launch')} />}

          {/* mobile export actions */}
          <div className="flex flex-wrap gap-2 md:hidden">
            <Button variant="outline" size="sm" onClick={onCopyAll}>Copy all</Button>
            <Button size="sm" onClick={onExportMarkdown}>Export Markdown</Button>
            <Button variant="ghost" size="sm" onClick={onStartOver}>Start over</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
