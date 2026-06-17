import Link from 'next/link'
import { UpvoteBadge } from '@/components/brand/UpvoteBadge'
import { PlatformPill } from '@/components/brand/PlatformPill'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-3 rounded-lg transition-opacity hover:opacity-80">
          <UpvoteBadge count={1} />
          <div className="leading-tight">
            <span className="block font-display text-[1.15rem] font-bold tracking-tight">Launch Kit</span>
            <span className="hidden text-xs text-muted-foreground sm:block">Your repo, launch-ready</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/runs"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Your runs
          </Link>
          <div className="hidden sm:block">
            <PlatformPill />
          </div>
        </div>
      </div>
    </header>
  )
}
