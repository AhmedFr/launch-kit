import type { UpvoteBadgeProps } from './UpvoteBadge.types'

export function UpvoteBadge({ count = 0 }: UpvoteBadgeProps) {
  return (
    <span className="inline-flex size-9 flex-col items-center justify-center gap-0.5 rounded-xl bg-gradient-to-b from-primary to-[oklch(0.62_0.2_25)] text-primary-foreground shadow-sm shadow-primary/30">
      <svg width="11" height="7" viewBox="0 0 12 8" aria-hidden>
        <path d="M6 0l6 8H0z" fill="currentColor" />
      </svg>
      <span className="text-[10px] font-bold leading-none tabular-nums">{count}</span>
    </span>
  )
}
