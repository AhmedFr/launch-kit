import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import { EditableText } from '@/components/common/EditableText'
import { Badge } from '@/components/ui/badge'
import type { CopySectionProps } from './CopySection.types'

export function CopySection({ kit, loading = false, onEdit }: CopySectionProps) {
  const { copy } = kit
  return (
    <SectionCard title="Name & copy" loading={loading}>
      <div className="space-y-1">
        <div className="text-xs uppercase text-muted-foreground">Tagline ({copy.tagline.length}/60)</div>
        <div className="flex items-center justify-between gap-2">
          <EditableText
            value={copy.tagline}
            onCommit={onEdit && ((v) => onEdit(['copy', 'tagline'], v))}
            ariaLabel="Tagline"
            className="flex-1 font-medium"
          />
          <CopyButton value={copy.tagline} />
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          {copy.taglineAlternatives.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-xs uppercase text-muted-foreground">Name ideas</div>
        <p>{copy.nameSuggestions.join(' · ')}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">Description</span>
          <CopyButton value={copy.description} />
        </div>
        <EditableText
          value={copy.description}
          onCommit={onEdit && ((v) => onEdit(['copy', 'description'], v))}
          multiline
          ariaLabel="Description"
        />
      </div>
    </SectionCard>
  )
}
