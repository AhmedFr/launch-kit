import { PLATFORMS } from '@/lib/platforms'
import type { Run } from './runs.types'

// Display title for a run: product name, else the folder's basename, else a fallback.
export function runTitle(run: Run): string {
  if (run.context?.name) return run.context.name
  const base = run.path.split('/').filter(Boolean).pop()
  return base || 'Untitled run'
}

export type RunStatusTone = 'draft' | 'review' | 'ready'

export function runStatus(run: Run): { label: string; tone: RunStatusTone } {
  if (run.generation) return { label: 'Kit ready', tone: 'ready' }
  if (run.context) return { label: 'Context ready', tone: 'review' }
  return { label: 'Draft', tone: 'draft' }
}

// Compact a long path to its last two segments so the meaningful folder stays
// visible (the full path is shown on hover via the title attribute).
export function shortPath(path: string): string {
  const segments = path.split('/').filter(Boolean)
  if (segments.length <= 2) return path
  return `…/${segments.slice(-2).join('/')}`
}

// Names of the platforms this run has generated content for.
export function runPlatforms(run: Run): string[] {
  return Object.keys(run.generation?.platforms ?? {}).map(
    (id) => PLATFORMS.find((p) => p.id === id)?.name ?? id,
  )
}

export function formatRelative(ts: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - ts)
  const min = 60_000
  const hour = 60 * min
  const day = 24 * hour
  if (diff < min) return 'just now'
  if (diff < hour) return `${Math.floor(diff / min)}m ago`
  if (diff < day) return `${Math.floor(diff / hour)}h ago`
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
