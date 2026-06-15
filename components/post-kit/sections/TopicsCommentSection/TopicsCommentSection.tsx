import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import { RegenerateButton } from '@/components/common/RegenerateButton'
import { Badge } from '@/components/ui/badge'
import type { TopicsCommentSectionProps } from './TopicsCommentSection.types'

export function TopicsCommentSection({ kit, onRegenerate, regenerating }: TopicsCommentSectionProps) {
  return (
    <SectionCard
      title="Topics & first comment"
      action={<RegenerateButton onClick={onRegenerate} regenerating={regenerating} />}
    >
      <div className="flex flex-wrap gap-1">
        {kit.topics.map((t) => <Badge key={t}>{t}</Badge>)}
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">Maker&apos;s first comment</span>
          <CopyButton value={kit.firstComment} />
        </div>
        <p className="whitespace-pre-wrap">{kit.firstComment}</p>
      </div>
    </SectionCard>
  )
}
