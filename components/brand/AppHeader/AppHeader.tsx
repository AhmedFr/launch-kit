import { UpvoteBadge } from '@/components/brand/UpvoteBadge'
import { PlatformPill } from '@/components/brand/PlatformPill'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-3.5">
        <div className="flex items-center gap-3">
          <UpvoteBadge count={1} />
          <div className="leading-tight">
            <h1 className="font-display text-[1.15rem] font-bold tracking-tight">Launch Kit</h1>
            <p className="text-xs text-muted-foreground">Your repo, launch-ready</p>
          </div>
        </div>
        <PlatformPill />
      </div>
    </header>
  )
}
