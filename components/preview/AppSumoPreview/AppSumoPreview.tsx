import type { PreviewProps } from '@/lib/preview/preview.types'
import type { AppSumoContent } from '@/lib/types'

export function AppSumoPreview({ content, productName }: PreviewProps) {
  const deal = content as AppSumoContent
  const initial = productName.trim().charAt(0).toUpperCase() || 'P'

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Deal header */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-black font-display text-2xl font-bold text-[#ffc233]">
            {initial}
          </div>

          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-md bg-[#ffc233] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-black">
              Lifetime Deal
            </span>
            <h3 className="mt-1.5 font-display text-xl font-bold leading-snug tracking-tight">{deal.dealHeadline}</h3>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground" aria-hidden>
                ★★★★★
              </span>
              <span className="font-semibold text-foreground tabular-nums">5.0</span>
              <span aria-hidden>·</span>
              <span>142 reviews</span>
            </div>
          </div>
        </div>

        {/* Price block */}
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl bg-muted/40 px-4 py-3">
          <span className="font-display text-2xl font-bold tracking-tight">$59</span>
          <span className="text-sm font-medium text-muted-foreground">one-time</span>
          <span className="text-sm text-muted-foreground line-through tabular-nums">$468</span>
          <span className="rounded-md bg-[#ffc233] px-2 py-0.5 text-xs font-bold text-black">88% off</span>
        </div>
      </div>

      {/* Pitch */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Overview</div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{deal.pitch}</p>
      </div>

      {/* What's included */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">What&apos;s included</div>
        <ul className="space-y-1.5">
          {deal.whatsIncluded.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-snug">
              <span className="text-[#ffc233]" aria-hidden>
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Best for */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Best for</div>
        <div className="flex flex-wrap gap-2">
          {deal.bestFor.map((b) => (
            <span key={b} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">FAQ</div>
        <dl className="space-y-3">
          {deal.faq.map((f) => (
            <div key={f.q}>
              <dt className="text-sm font-semibold">{f.q}</dt>
              <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
