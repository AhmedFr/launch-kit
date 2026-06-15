'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CopySection } from '@/components/post-kit/sections/CopySection'
import { TopicsCommentSection } from '@/components/post-kit/sections/TopicsCommentSection'
import { GallerySection } from '@/components/post-kit/sections/GallerySection'
import { VideoSection } from '@/components/post-kit/sections/VideoSection'
import { LaunchOpsSection } from '@/components/post-kit/sections/LaunchOpsSection'
import { PLATFORMS, type PlatformId } from '@/lib/platforms'
import { PREVIEWS } from '@/lib/preview/registry'
import { SECTIONS } from './PostKit.constants'
import type { PostKitProps } from './PostKit.types'
import type { SectionKey } from '@/lib/types'

export function PostKit({
  kit,
  productName,
  onRegenerateSection,
  regeneratingSection,
  onExportMarkdown,
  onCopyAll,
  onStartOver,
}: PostKitProps) {
  const [view, setView] = useState<'edit' | 'preview'>('edit')
  const [active, setActive] = useState<SectionKey>('copy')
  const [platform, setPlatform] = useState<PlatformId>('product-hunt')
  const busy = (k: SectionKey) => regeneratingSection === k
  const Preview = PREVIEWS[platform]

  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="reveal reveal-1 mb-6 text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">Your launch kit is ready</span>
        <h2 className="font-display mx-auto mt-2 max-w-2xl text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {kit.copy.tagline}
        </h2>
      </div>

      {/* Toolbar: Edit | Preview + global actions */}
      <div className="reveal reveal-2 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border bg-card p-0.5 shadow-sm">
          {(['edit', 'preview'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 text-sm capitalize transition-colors ${
                view === v ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCopyAll}>Copy all</Button>
          <Button size="sm" onClick={onExportMarkdown}>Export Markdown</Button>
          <Button variant="ghost" size="sm" onClick={onStartOver}>Start over</Button>
        </div>
      </div>

      {view === 'edit' ? (
        <div className="flex flex-col gap-6 md:flex-row">
          <nav className="-mx-6 flex gap-1 overflow-x-auto px-6 pb-1 md:hidden">
            {SECTIONS.map((s) => (
              <SectionTab key={s.key} label={s.label} active={active === s.key} onClick={() => setActive(s.key)} />
            ))}
          </nav>

          <aside className="reveal reveal-2 sticky top-20 hidden h-fit w-52 shrink-0 flex-col gap-1 rounded-2xl border border-border bg-card p-2 shadow-sm md:flex">
            {SECTIONS.map((s) => (
              <SectionTab key={s.key} label={s.label} active={active === s.key} onClick={() => setActive(s.key)} />
            ))}
          </aside>

          <div className="min-w-0 flex-1 space-y-4" key={active}>
            {active === 'copy' && <CopySection kit={kit} onRegenerate={() => onRegenerateSection('copy')} regenerating={busy('copy')} />}
            {active === 'topicsComment' && <TopicsCommentSection kit={kit} onRegenerate={() => onRegenerateSection('topicsComment')} regenerating={busy('topicsComment')} />}
            {active === 'gallery' && <GallerySection kit={kit} onRegenerate={() => onRegenerateSection('gallery')} regenerating={busy('gallery')} />}
            {active === 'video' && <VideoSection kit={kit} onRegenerate={() => onRegenerateSection('video')} regenerating={busy('video')} />}
            {active === 'launch' && <LaunchOpsSection kit={kit} onRegenerate={() => onRegenerateSection('launch')} regenerating={busy('launch')} />}
          </div>
        </div>
      ) : (
        <div className="reveal reveal-2 space-y-5">
          <div className="flex flex-wrap justify-center gap-2">
            {PLATFORMS.map((p) => {
              const ready = Boolean(PREVIEWS[p.id])
              return (
                <button
                  key={p.id}
                  disabled={!ready}
                  onClick={() => ready && setPlatform(p.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    platform === p.id && ready
                      ? 'border-primary bg-primary/10 font-medium text-primary'
                      : ready
                        ? 'border-border text-muted-foreground hover:bg-muted'
                        : 'cursor-not-allowed border-dashed border-border text-muted-foreground/60'
                  }`}
                >
                  {p.name}
                  {!ready && <span className="ml-1 text-[10px] uppercase">soon</span>}
                </button>
              )
            })}
          </div>

          <div key={platform}>
            {Preview ? (
              <Preview kit={kit} productName={productName} />
            ) : (
              <p className="text-center text-sm text-muted-foreground">No preview for this platform yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SectionTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        active ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted'
      }`}
    >
      {label}
    </button>
  )
}
