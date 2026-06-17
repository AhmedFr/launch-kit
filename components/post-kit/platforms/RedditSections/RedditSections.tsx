import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import type { RedditContent } from '@/lib/types'
import type { PlatformSectionsProps } from '../platform-sections.types'

export function RedditSections({ content, loading = false }: PlatformSectionsProps) {
  const reddit = content as RedditContent
  return (
    <div className="space-y-4">
      <SectionCard title="Where to post" loading={loading}>
        <ul className="space-y-2">
          {reddit.subreddits.map((s) => (
            <li key={s.name} className="flex flex-wrap gap-x-2">
              <span className="font-medium text-foreground">{s.name}</span>
              <span className="text-muted-foreground">— {s.why}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Post" loading={loading}>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-muted-foreground">Title</span>
            <CopyButton value={reddit.title} />
          </div>
          <p className="font-medium">{reddit.title}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-muted-foreground">Body</span>
            <CopyButton value={reddit.body} />
          </div>
          <p className="whitespace-pre-wrap">{reddit.body}</p>
        </div>
      </SectionCard>

      <SectionCard title="Reply etiquette" loading={loading}>
        <ul className="list-disc pl-5">{reddit.replyEtiquette.map((r) => <li key={r}>{r}</li>)}</ul>
      </SectionCard>
    </div>
  )
}
