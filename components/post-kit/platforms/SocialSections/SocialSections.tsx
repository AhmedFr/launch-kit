import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import { EditableText } from '@/components/common/EditableText'
import type { SocialContent } from '@/lib/types'
import type { PlatformSectionsProps } from '../platform-sections.types'

export function SocialSections({ content, loading = false, onEdit }: PlatformSectionsProps) {
  const social = content as SocialContent
  const fullThread = social.thread.tweets.join('\n\n')
  const channels: { label: string; value: string }[] = [
    { label: 'X / Twitter', value: social.kolOutreach.twitter },
    { label: 'LinkedIn', value: social.kolOutreach.linkedin },
    { label: 'Telegram', value: social.kolOutreach.telegram },
  ]

  return (
    <div className="space-y-4">
      <SectionCard title="Launch thread" loading={loading}>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">{social.thread.tweets.length} tweets</span>
          <CopyButton value={fullThread} />
        </div>
        <ol className="space-y-2">
          {social.thread.tweets.map((tweet, i) => (
            <li key={i} className="rounded-xl border border-border px-3 py-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{i + 1}/{social.thread.tweets.length}</span>
                <CopyButton value={tweet} />
              </div>
              <EditableText
                value={tweet}
                onCommit={onEdit && ((v) => onEdit(['thread', 'tweets', i], v))}
                multiline
                ariaLabel={`Tweet ${i + 1}`}
              />
            </li>
          ))}
        </ol>
      </SectionCard>

      <SectionCard title="KOL outreach" loading={loading}>
        {channels.map((c) => (
          <div key={c.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase text-muted-foreground">{c.label}</span>
              <CopyButton value={c.value} />
            </div>
            <p className="whitespace-pre-wrap">{c.value}</p>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="UGC ask" loading={loading}>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">Invite an early user to create</span>
          <CopyButton value={social.ugcAsk} />
        </div>
        <p className="whitespace-pre-wrap">{social.ugcAsk}</p>
      </SectionCard>

      <SectionCard title="Posting tips" loading={loading}>
        <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2">
          <span aria-hidden>🕐</span>
          <span><span className="font-medium">Best time:</span> {social.postingTips.bestTimeET}</span>
        </div>
        {social.postingTips.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {social.postingTips.hashtags.map((h) => (
              <span key={h} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{h}</span>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
