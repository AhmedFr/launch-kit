import { ACTIVE_PLATFORM, UPCOMING_PLATFORMS } from '@/lib/platforms'

export function PlatformPill() {
  const upcoming = UPCOMING_PLATFORMS.map((p) => p.name).join(', ')
  return (
    <span
      title={upcoming ? `More platforms coming: ${upcoming}` : undefined}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur"
    >
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
      </span>
      <span className="text-muted-foreground">Targeting</span>
      <span className="font-semibold">{ACTIVE_PLATFORM.name}</span>
    </span>
  )
}
