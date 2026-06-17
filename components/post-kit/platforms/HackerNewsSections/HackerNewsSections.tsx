import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import type { HackerNewsContent } from '@/lib/types'
import type { PlatformSectionsProps } from '../platform-sections.types'

export function HackerNewsSections({ content, loading = false }: PlatformSectionsProps) {
  const hn = content as HackerNewsContent
  return (
    <div className="space-y-4">
      <SectionCard title="Show HN title" loading={loading}>
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium">{hn.title}</p>
          <CopyButton value={hn.title} />
        </div>
      </SectionCard>

      <SectionCard title="Text post" loading={loading}>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">Body</span>
          <CopyButton value={hn.postBody} />
        </div>
        <p className="whitespace-pre-wrap">{hn.postBody}</p>
      </SectionCard>

      <SectionCard title="First comment" loading={loading}>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">Comment</span>
          <CopyButton value={hn.firstComment} />
        </div>
        <p className="whitespace-pre-wrap">{hn.firstComment}</p>
      </SectionCard>

      <SectionCard title="Posting tips" loading={loading}>
        <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2">
          <span aria-hidden>🕐</span>
          <span><span className="font-medium">Best time:</span> {hn.postingTips.bestTimeET}</span>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground">Avoid</div>
          <ul className="list-disc pl-5">{hn.postingTips.avoid.map((a) => <li key={a}>{a}</li>)}</ul>
        </div>
      </SectionCard>
    </div>
  )
}
