'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RegenerateButton } from '@/components/common/RegenerateButton'
import { LaunchPlan } from '@/components/launch-plan/LaunchPlan'
import { LaunchOpsSection } from '@/components/post-kit/sections/LaunchOpsSection'
import { PLATFORMS, type PlatformId } from '@/lib/platforms'
import { PREVIEWS } from '@/lib/preview/registry'
import { PLATFORM_SECTIONS } from '@/components/post-kit/platforms/registry'
import { useRuntimeConfig } from '@/lib/config/RuntimeConfigProvider'
import { canGenerate } from '@/lib/config/runtime-config'
import type { ProductHuntContent } from '@/lib/types'
import type { PostKitProps } from './PostKit.types'

// Product Hunt is the only platform with a launch-day ops view; it gets a third tab.
type View = 'edit' | 'launch-ops' | 'preview'
const VIEW_LABELS: Record<View, string> = { edit: 'Edit', 'launch-ops': 'Launch ops', preview: 'Preview' }

export function PostKit({
  generation,
  productName,
  onRegeneratePlatform,
  regeneratingPlatform,
  onExportMarkdown,
  onCopyAll,
  onCopyPlan,
  onExportPlan,
  onStartOver,
}: PostKitProps) {
  const { core, platforms, plan } = generation
  const firstReady = PLATFORMS.find((p) => platforms[p.id])?.id ?? 'product-hunt'
  const [platform, setPlatform] = useState<PlatformId>(firstReady)
  const [view, setView] = useState<View>('edit')

  const content = platforms[platform]
  const Sections = PLATFORM_SECTIONS[platform]
  const Preview = PREVIEWS[platform]
  const regenerating = regeneratingPlatform === platform
  const config = useRuntimeConfig()
  const canRegenerate = canGenerate(config)

  // Only Product Hunt has launch-day ops; fall back to Edit when its tab can't apply.
  const hasLaunchOps = platform === 'product-hunt' && Boolean(content)
  const views: View[] = hasLaunchOps ? ['edit', 'launch-ops', 'preview'] : ['edit', 'preview']
  const activeView: View = view === 'launch-ops' && !hasLaunchOps ? 'edit' : view

  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="reveal reveal-1 mb-6 text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">Your launch kit is ready</span>
        <h2 className="font-display mx-auto mt-2 max-w-2xl text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {core.essence}
        </h2>
      </div>

      {/* Cross-platform launch plan — spans every channel, shown above the per-platform kits */}
      {plan && (
        <div className="reveal reveal-1 mb-6">
          <LaunchPlan plan={plan} onCopy={onCopyPlan} onExport={onExportPlan} />
        </div>
      )}

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

      {/* Toolbar: Edit | Launch ops (PH only) | Preview + per-platform actions */}
      <div className="reveal reveal-2 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border bg-card p-0.5 shadow-sm">
          {views.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${
                activeView === v ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {VIEW_LABELS[v]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RegenerateButton
            onClick={() => onRegeneratePlatform(platform)}
            regenerating={regenerating}
            disabled={!canRegenerate}
            title={canRegenerate ? undefined : 'Add OPENROUTER_API_KEY to your .env to regenerate'}
          />
          <Button variant="outline" size="sm" onClick={() => onCopyAll(platform)}>Copy all</Button>
          <Button size="sm" onClick={() => onExportMarkdown(platform)}>Export Markdown</Button>
          <Button variant="ghost" size="sm" onClick={onStartOver}>Start over</Button>
        </div>
      </div>

      <div key={`${platform}-${activeView}`} className="reveal reveal-2">
        {!content ? (
          <p className="text-center text-sm text-muted-foreground">
            This platform didn&apos;t generate. Switch to a ready platform, or start over to try again.
          </p>
        ) : activeView === 'edit' ? (
          Sections ? <Sections core={core} content={content} loading={regenerating} /> : null
        ) : activeView === 'launch-ops' ? (
          <LaunchOpsSection kit={content as ProductHuntContent} loading={regenerating} />
        ) : Preview ? (
          <Preview core={core} content={content} productName={productName} />
        ) : (
          <p className="text-center text-sm text-muted-foreground">No preview for this platform yet.</p>
        )}
      </div>
    </div>
  )
}
