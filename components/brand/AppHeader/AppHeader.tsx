import { UpvoteBadge } from '@/components/brand/UpvoteBadge'

export function AppHeader() {
  return (
    <header className="flex items-center gap-3 border-b px-6 py-4">
      <UpvoteBadge count={1} />
      <div>
        <h1 className="text-lg font-bold leading-tight">Launch Kit</h1>
        <p className="text-xs text-muted-foreground">Turn your repo into a great Product Hunt post</p>
      </div>
    </header>
  )
}
