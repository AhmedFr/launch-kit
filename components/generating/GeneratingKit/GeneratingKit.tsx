'use client'
import { useEffect, useState } from 'react'
import { GENERATION_STAGES, STAGE_INTERVAL_MS } from './GeneratingKit.constants'
import type { GeneratingKitProps } from './GeneratingKit.types'

export function GeneratingKit({ productName }: GeneratingKitProps) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => Math.min(s + 1, GENERATION_STAGES.length - 1))
    }, STAGE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const isLast = stage === GENERATION_STAGES.length - 1
  const progress = Math.min(94, ((stage + 1) / GENERATION_STAGES.length) * 100)

  return (
    <div className="mx-auto max-w-md px-6">
      <div className="reveal reveal-1 text-center">
        <span className="relative mx-auto flex size-11 items-center justify-center rounded-2xl bg-gradient-to-b from-primary to-[oklch(0.62_0.2_25)] text-primary-foreground shadow-sm shadow-primary/30">
          <span className="absolute inline-flex size-full animate-ping rounded-2xl bg-primary opacity-20" />
          <svg width="14" height="9" viewBox="0 0 12 8" aria-hidden>
            <path d="M6 0l6 8H0z" fill="currentColor" />
          </svg>
        </span>
        <h2 className="font-display mt-4 text-2xl font-bold tracking-tight">
          Building your launch kit{productName ? <> for <span className="text-primary">{productName}</span></> : null}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Claude is writing real copy — this usually takes 30–45 seconds.
        </p>
      </div>

      <div className="reveal reveal-2 mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="reveal reveal-2 mt-6 space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
        {GENERATION_STAGES.map((label, i) => {
          const status = i < stage ? 'done' : i === stage ? 'active' : 'todo'
          return (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span className="flex size-5 shrink-0 items-center justify-center">
                {status === 'done' && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">✓</span>
                )}
                {status === 'active' && (
                  <span className="size-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                )}
                {status === 'todo' && <span className="size-2 rounded-full bg-border" />}
              </span>
              <span
                className={
                  status === 'active'
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground'
                }
              >
                {label}
                {status === 'active' && isLast ? ' — finalizing…' : ''}
              </span>
            </li>
          )
        })}
      </ol>

      <p className="reveal reveal-3 mt-4 text-center text-xs text-muted-foreground">
        Tip: the more detail in your README, the sharper the copy.
      </p>
    </div>
  )
}
