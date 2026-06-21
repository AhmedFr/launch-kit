import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import { EditableText } from '@/components/common/EditableText'
import { Badge } from '@/components/ui/badge'
import type { TopicsCommentSectionProps } from './TopicsCommentSection.types'

export function TopicsCommentSection({ kit, loading = false, onEdit }: TopicsCommentSectionProps) {
  return (
    <SectionCard title="Topics & first comment" loading={loading}>
      <div className="flex flex-wrap gap-1">
        {kit.topics.map((t) => <Badge key={t}>{t}</Badge>)}
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">Maker&apos;s first comment</span>
          <CopyButton value={kit.firstComment} />
        </div>
        <EditableText
          value={kit.firstComment}
          onCommit={onEdit && ((v) => onEdit(['firstComment'], v))}
          multiline
          ariaLabel="Maker's first comment"
        />
      </div>
    </SectionCard>
  )
}
