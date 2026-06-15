import type { PreviewProps } from '@/lib/preview/preview.types'

const TIERS = [
  {
    name: 'License Tier 1',
    price: '$59',
    features: ['All core features', '1 seat / workspace', 'Lifetime updates'],
  },
  {
    name: 'License Tier 2',
    price: '$119',
    features: ['Everything in Tier 1', '5 seats / workspace', 'Priority support'],
  },
  {
    name: 'License Tier 3',
    price: '$249',
    features: ['Everything in Tier 2', 'Unlimited seats', 'API access & integrations'],
  },
] as const

export function AppSumoPreview({ kit, productName }: PreviewProps) {
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
            <h3 className="mt-1.5 truncate font-display text-xl font-bold tracking-tight">{productName}</h3>
            <p className="text-sm text-muted-foreground">{kit.copy.tagline}</p>

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

      {/* Description */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Overview</div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{kit.copy.description}</p>
      </div>

      {/* Gallery (placeholders the user will shoot from the shot list) */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Media</div>
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

      {/* Category tags */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Categories</div>
        <div className="flex flex-wrap gap-2">
          {kit.topics.map((t) => (
            <span key={t} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Select your plan */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Select your plan</div>
        <div className="grid gap-3 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <div key={tier.name} className="flex flex-col rounded-xl border border-border bg-background p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{tier.name}</div>
              <div className="mt-1 font-display text-lg font-bold tracking-tight tabular-nums">{tier.price}</div>
              <ul className="mt-2 flex-1 space-y-1.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-1.5 text-[11px] leading-snug text-muted-foreground">
                    <span className="text-[#ffc233]" aria-hidden>
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-3 rounded-lg bg-[#ffc233] py-1.5 text-xs font-bold text-black"
              >
                Buy now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
