import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { TopicsCommentSectionProps } from './TopicsCommentSection.types'

export function TopicsCommentSection({ kit, onRegenerate, regenerating }: TopicsCommentSectionProps) {
  return (
    <SectionCard
      title="Topics & first comment"
      action={<Button variant="ghost" size="sm" onClick={onRegenerate} disabled={regenerating}>Regenerate</Button>}
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
