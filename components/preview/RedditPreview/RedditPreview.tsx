import type { PreviewProps } from '@/lib/preview/preview.types'
import type { RedditContent } from '@/lib/types'

export function RedditPreview({ content, productName }: PreviewProps) {
  const reddit = content as RedditContent
  const handle = `u/${productName.trim().toLowerCase().replace(/\s+/g, '_') || 'maker'}`
  const subreddit = reddit.subreddits[0]?.name ?? 'r/SideProject'

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="size-6 shrink-0 rounded-full bg-[#ff4500]/80" aria-hidden />
          <span className="font-bold text-foreground">{subreddit}</span>
          <span>· Posted by {handle} · 4h</span>
        </div>

        {/* Flair */}
        <div className="mt-2">
          <span className="inline-block rounded-full bg-[#ff4500]/10 px-2 py-0.5 text-[11px] font-semibold text-[#ff4500]">
            Show &amp; Tell
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight">{reddit.title}</h3>

        {/* Body */}
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{reddit.body}</p>

        {/* Action bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
            <span className="text-[#ff4500]" aria-hidden>
              ▲
            </span>
            <span className="tabular-nums text-foreground">342</span>
            <span aria-hidden>▼</span>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-1">💬 48 Comments</span>
          <span className="rounded-full bg-muted px-2.5 py-1">Share</span>
          <span className="rounded-full bg-muted px-2.5 py-1">Save</span>
        </div>
      </div>

      {/* Other subreddits to cross-post */}
      {reddit.subreddits.length > 1 && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Also consider
          </div>
          <div className="flex flex-wrap gap-2">
            {reddit.subreddits.slice(1).map((s) => (
              <span key={s.name} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
