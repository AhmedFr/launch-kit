import type { UpvoteBadgeProps } from './UpvoteBadge.types'

export function UpvoteBadge({ count = 0 }: UpvoteBadgeProps) {
  return (
    <span className="inline-flex flex-col items-center justify-center rounded-md border border-primary px-2 py-1 text-primary">
      <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden>
        <path d="M6 0l6 8H0z" fill="currentColor" />
      </svg>
      <span className="text-xs font-semibold tabular-nums">{count}</span>
    </span>
  )
}
