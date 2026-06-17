'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RegenerateButton } from '@/components/common/RegenerateButton'
import { PLATFORMS, type PlatformId } from '@/lib/platforms'
import { PREVIEWS } from '@/lib/preview/registry'
import { PLATFORM_SECTIONS } from '@/components/post-kit/platforms/registry'
import type { PostKitProps } from './PostKit.types'

export function PostKit({
  generation,
  productName,
  onRegeneratePlatform,
  regeneratingPlatform,
  onExportMarkdown,
  onCopyAll,
  onStartOver,
}: PostKitProps) {
  const { core, platforms } = generation
  const firstReady = PLATFORMS.find((p) => platforms[p.id])?.id ?? 'product-hunt'
  const [platform, setPlatform] = useState<PlatformId>(firstReady)
  const [view, setView] = useState<'edit' | 'preview'>('edit')

  const content = platforms[platform]
  const Sections = PLATFORM_SECTIONS[platform]
  const Preview = PREVIEWS[platform]
  const regenerating = regeneratingPlatform === platform

  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="reveal reveal-1 mb-6 text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">Your launch kit is ready</span>
        <h2 className="font-display mx-auto mt-2 max-w-2xl text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {core.essence}
        </h2>
      </div>

      {/* Platform selector — drives both edit and preview */}
      <div className="reveal reveal-2 mb-4 flex flex-wrap justify-center gap-2">
        {PLATFORMS.map((p) => {
          const ready = Boolean(platforms[p.id])
          const isActive = platform === p.id
          return (
            <button
              key={p.id}
              disabled={!ready}
              onClick={() => ready && setPlatform(p.id)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                isActive && ready
                  ? 'border-primary bg-primary/10 font-medium text-primary'
                  : ready
                    ? 'border-border text-muted-foreground hover:bg-muted'
                    : 'cursor-not-allowed border-dashed border-border text-muted-foreground/60'
              }`}
            >
              {p.name}
              {!ready && <span className="ml-1 text-[10px] uppercase">failed</span>}
            </button>
          )
        })}
      </div>

      {/* Toolbar: Edit | Preview + per-platform actions */}
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
        <div className="flex flex-wrap items-center gap-2">
          <RegenerateButton onClick={() => onRegeneratePlatform(platform)} regenerating={regenerating} />
          <Button variant="outline" size="sm" onClick={() => onCopyAll(platform)}>Copy all</Button>
          <Button size="sm" onClick={() => onExportMarkdown(platform)}>Export Markdown</Button>
          <Button variant="ghost" size="sm" onClick={onStartOver}>Start over</Button>
        </div>
      </div>

      <div key={`${platform}-${view}`} className="reveal reveal-2">
        {!content ? (
          <p className="text-center text-sm text-muted-foreground">
            This platform didn&apos;t generate. Switch to a ready platform, or start over to try again.
          </p>
        ) : view === 'edit' ? (
          Sections ? <Sections core={core} content={content} loading={regenerating} /> : null
        ) : Preview ? (
          <Preview core={core} content={content} productName={productName} />
        ) : (
          <p className="text-center text-sm text-muted-foreground">No preview for this platform yet.</p>
        )}
      </div>
    </div>
  )
}
