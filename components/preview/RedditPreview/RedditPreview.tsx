import type { PreviewProps } from '@/lib/preview/preview.types'

export function RedditPreview({ kit, productName }: PreviewProps) {
  const handle = `u/${productName.trim().toLowerCase().replace(/\s+/g, '_') || 'maker'}`
  const opFraming = kit.firstComment.trim().split(/(?<=[.!?])\s+/)[0]?.trim()

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="size-6 shrink-0 rounded-full bg-[#ff4500]/80" aria-hidden />
          <span className="font-bold text-foreground">r/SideProject</span>
          <span>· Posted by {handle} · 4h</span>
        </div>

        {/* Flair */}
        <div className="mt-2">
          <span className="inline-block rounded-full bg-[#ff4500]/10 px-2 py-0.5 text-[11px] font-semibold text-[#ff4500]">
            Show &amp; Tell
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight">
          {productName}: {kit.copy.tagline}
        </h3>

        {/* Body */}
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {kit.copy.description}
        </p>
        {opFraming && (
          <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground">{opFraming}</p>
        )}

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
    </div>
  )
}
