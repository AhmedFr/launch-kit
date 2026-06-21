import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import { EditableText } from '@/components/common/EditableText'
import type { HackerNewsContent } from '@/lib/types'
import type { PlatformSectionsProps } from '../platform-sections.types'

export function HackerNewsSections({ content, loading = false, onEdit }: PlatformSectionsProps) {
  const hn = content as HackerNewsContent
  return (
    <div className="space-y-4">
      <SectionCard title="Show HN title" loading={loading}>
        <div className="flex items-center justify-between gap-2">
          <EditableText
            value={hn.title}
            onCommit={onEdit && ((v) => onEdit(['title'], v))}
            ariaLabel="Show HN title"
            className="flex-1 font-medium"
          />
          <CopyButton value={hn.title} />
        </div>
      </SectionCard>

      <SectionCard title="Text post" loading={loading}>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">Body</span>
          <CopyButton value={hn.postBody} />
        </div>
        <EditableText
          value={hn.postBody}
          onCommit={onEdit && ((v) => onEdit(['postBody'], v))}
          multiline
          ariaLabel="Post body"
        />
      </SectionCard>

      <SectionCard title="First comment" loading={loading}>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">Comment</span>
          <CopyButton value={hn.firstComment} />
        </div>
        <EditableText
          value={hn.firstComment}
          onCommit={onEdit && ((v) => onEdit(['firstComment'], v))}
          multiline
          ariaLabel="First comment"
        />
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
        {hn.postingTips.etiquette && hn.postingTips.etiquette.length > 0 && (
          <div>
            <div className="text-xs uppercase text-muted-foreground">Etiquette</div>
            <ul className="list-disc pl-5">{hn.postingTips.etiquette.map((e) => <li key={e}>{e}</li>)}</ul>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
