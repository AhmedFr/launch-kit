import type { PreviewProps } from '@/lib/preview/preview.types'
import type { SocialContent } from '@/lib/types'

export function SocialPreview({ content, productName }: PreviewProps) {
  const social = content as SocialContent
  const handle = productName.trim().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) || 'maker'

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {social.thread.tweets.map((tweet, i) => (
          <div key={tweet} className="flex gap-3 border-b border-border px-4 py-3 last:border-b-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
              {handle.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-sm">
                <span className="font-bold text-foreground">{productName}</span>
                <span className="text-muted-foreground">@{handle}</span>
                {i === 0 && <span className="ml-1 rounded bg-muted px-1 text-[10px] uppercase text-muted-foreground">thread</span>}
              </div>
              <p className="mt-0.5 whitespace-pre-wrap text-[15px] leading-snug text-foreground">{tweet}</p>
              <div className="mt-2 flex gap-6 text-xs text-muted-foreground" aria-hidden>
                <span>💬</span><span>🔁</span><span>♥</span><span>↗</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {social.postingTips.hashtags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {social.postingTips.hashtags.map((h) => (
            <span key={h} className="text-xs text-primary">{h}</span>
          ))}
        </div>
      )}
    </div>
  )
}
