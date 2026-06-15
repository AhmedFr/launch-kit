import type { PreviewProps } from '@/lib/preview/preview.types'

export function ProductHuntPreview({ kit, productName }: PreviewProps) {
  const initial = productName.trim().charAt(0).toUpperCase() || 'P'

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Listing row */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 font-display text-xl font-bold text-primary">
            {initial}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-lg font-bold tracking-tight">{productName}</h3>
            <p className="text-sm text-muted-foreground">{kit.copy.tagline}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {kit.topics.slice(0, 3).map((t) => (
                <span key={t} className="rounded-full bg-muted px-2 py-0.5">{t}</span>
              ))}
              <span aria-hidden>💬 1</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center justify-center rounded-xl border border-primary px-3 py-1.5 text-primary">
            <svg width="13" height="9" viewBox="0 0 12 8" aria-hidden>
              <path d="M6 0l6 8H0z" fill="currentColor" />
            </svg>
            <span className="text-sm font-bold tabular-nums">1</span>
          </div>
        </div>
      </div>

      {/* Gallery (placeholders the user will shoot from the shot list) */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Gallery</div>
        <div className="grid grid-cols-2 gap-3">
          {kit.gallery.shots.slice(0, 4).map((s, i) => (
            <div
              key={i}
              className="flex aspect-video flex-col justify-end rounded-lg border border-dashed border-border bg-muted/40 p-3"
            >
              <div className="text-xs font-medium">{s.title}</div>
              <div className="line-clamp-2 text-[11px] text-muted-foreground">{s.caption}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Dashed tiles mark images you&apos;ll create from the shot list.
        </p>
      </div>

      {/* Maker's first comment */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initial}
          </div>
          <span className="text-sm font-medium">{productName}</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Maker
          </span>
        </div>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{kit.firstComment}</p>
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span aria-hidden>▲ Upvote</span>
          <span aria-hidden>Reply</span>
          <span aria-hidden>Share</span>
        </div>
      </div>
    </div>
  )
}
