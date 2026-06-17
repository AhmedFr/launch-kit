'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { runTitle, runStatus, runPlatforms, formatRelative, shortPath, type RunStatusTone } from '@/lib/runs/run-summary'
import type { RunCardProps } from './RunCard.types'

const TONE: Record<RunStatusTone, string> = {
  ready: 'bg-primary/10 text-primary',
  review: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  draft: 'bg-muted text-muted-foreground',
}

export function RunCard({ run, onDelete }: RunCardProps) {
  const [confirming, setConfirming] = useState(false)
  const status = runStatus(run)
  const platforms = runPlatforms(run)

  return (
    <div className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/runs/${run.id}`} className="block">
        <div className="flex items-start justify-between gap-3 pr-8">
          <h3 className="font-display text-lg font-bold tracking-tight">{runTitle(run)}</h3>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${TONE[status.tone]}`}>
            {status.label}
          </span>
        </div>
        {run.path && (
          <p title={run.path} className="mt-1 truncate font-mono text-xs text-muted-foreground">
            {shortPath(run.path)}
          </p>
        )}
        <div className="mt-3 flex min-h-6 flex-wrap items-center gap-1.5">
          {platforms.length > 0 ? (
            platforms.map((p) => <Badge key={p} variant="outline" className="text-[11px]">{p}</Badge>)
          ) : (
            <span className="text-xs text-muted-foreground">No kit generated yet</span>
          )}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Updated {formatRelative(run.updatedAt)}</p>
      </Link>

      {confirming ? (
        <div className="absolute right-3 top-3 flex items-center gap-1">
          <button
            onClick={() => onDelete(run.id)}
            className="rounded-md bg-destructive px-2 py-1 text-[11px] font-semibold text-white hover:bg-destructive/90"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          aria-label="Delete run"
          className="absolute right-3 top-3 rounded-md p-1.5 text-sm leading-none text-muted-foreground opacity-60 transition-opacity hover:bg-muted hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:opacity-0 sm:group-hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  )
}
