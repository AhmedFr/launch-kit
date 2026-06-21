'use client'
import { useState } from 'react'
import { CalendarRange, Download, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LaunchPlan } from '@/components/launch-plan/LaunchPlan'
import { LaunchOpsSection } from '@/components/post-kit/sections/LaunchOpsSection'
import { PlatformLogo } from '@/components/brand/PlatformLogo'
import { PLATFORMS, type PlatformId } from '@/lib/platforms'
import { PREVIEWS } from '@/lib/preview/registry'
import { PLATFORM_SECTIONS } from '@/components/post-kit/platforms/registry'
import type { ProductHuntContent } from '@/lib/types'
import type { PostKitProps } from './PostKit.types'

// Product Hunt is the only platform with a launch-day ops view; it gets a third tab.
type View = 'edit' | 'launch-ops' | 'preview'
const VIEW_LABELS: Record<View, string> = { edit: 'Edit', 'launch-ops': 'Launch ops', preview: 'Preview' }

export function PostKit({ generation, productName, onExportMarkdown, onCopyPlan, onExportPlan, onStartOver }: PostKitProps) {
  const { core, platforms, plan } = generation
  const firstReady = PLATFORMS.find((p) => platforms[p.id])?.id ?? 'product-hunt'
  const [platform, setPlatform] = useState<PlatformId>(firstReady)
  const [view, setView] = useState<View>('edit')
  const [planMode, setPlanMode] = useState(false)

  const content = platforms[platform]
  const Sections = PLATFORM_SECTIONS[platform]
  const Preview = PREVIEWS[platform]
  const hasLaunchOps = platform === 'product-hunt' && Boolean(content)
  const views: View[] = hasLaunchOps ? ['edit', 'launch-ops', 'preview'] : ['edit', 'preview']
  const activeView: View = view === 'launch-ops' && !hasLaunchOps ? 'edit' : view

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Header: product name + global actions */}
      <div className="reveal reveal-1 mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display truncate text-xl font-bold tracking-tight">{productName}</h2>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onStartOver}>
            <RotateCcw className="size-4" /> Start over
          </Button>
          <Button size="sm" onClick={() => (planMode ? onExportPlan() : onExportMarkdown(platform))}>
            <Download className="size-4" /> Export
          </Button>
        </div>
      </div>

      {/* Toolbar: Plan + platform-logo selector (left), view tabs (right) */}
      <div className="reveal reveal-2 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {plan && (
            <>
              <button
                onClick={() => setPlanMode(true)}
                aria-label="Launch plan"
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm transition-colors ${
                  planMode
                    ? 'border-primary bg-primary/10 font-medium text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <CalendarRange className="size-4" />
                <span>Plan</span>
              </button>
              <span className="mx-1 h-5 w-px bg-border" aria-hidden />
            </>
          )}
          {PLATFORMS.map((p) => {
            const ready = Boolean(platforms[p.id])
            const active = !planMode && platform === p.id
            return (
              <button
                key={p.id}
                disabled={!ready}
                aria-label={p.name}
                title={ready ? p.name : `${p.name} — didn't generate`}
                onClick={() => {
                  if (!ready) return
                  setPlanMode(false)
                  setPlatform(p.id)
                }}
                className={`rounded-lg border p-1.5 transition-colors ${
                  active
                    ? 'border-primary bg-primary/10'
                    : ready
                      ? 'border-border hover:bg-muted'
                      : 'cursor-not-allowed border-dashed border-border opacity-40'
                }`}
              >
                <PlatformLogo id={p.id} className="size-5" />
              </button>
            )
          })}
        </div>

        {!planMode && content && (
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
        )}
      </div>

      <div key={planMode ? 'plan' : `${platform}-${activeView}`} className="reveal reveal-2">
        {planMode && plan ? (
          <LaunchPlan plan={plan} onCopy={onCopyPlan} onExport={onExportPlan} />
        ) : !content ? (
          <p className="text-center text-sm text-muted-foreground">
            This platform didn&apos;t generate. Pick another, or start over to try again.
          </p>
        ) : activeView === 'edit' ? (
          Sections ? <Sections core={core} content={content} /> : null
        ) : activeView === 'launch-ops' ? (
          <LaunchOpsSection kit={content as ProductHuntContent} />
        ) : Preview ? (
          <Preview core={core} content={content} productName={productName} />
        ) : (
          <p className="text-center text-sm text-muted-foreground">No preview for this platform yet.</p>
        )}
      </div>
    </div>
  )
}
