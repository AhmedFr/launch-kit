import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { CopySectionProps } from './CopySection.types'

export function CopySection({ kit, onRegenerate, regenerating }: CopySectionProps) {
  const { copy } = kit
  return (
    <SectionCard
      title="Name & copy"
      action={<Button variant="ghost" size="sm" onClick={onRegenerate} disabled={regenerating}>Regenerate</Button>}
    >
      <div className="space-y-1">
        <div className="text-xs uppercase text-muted-foreground">Tagline ({copy.tagline.length}/60)</div>
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium">{copy.tagline}</p>
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
        <p className="whitespace-pre-wrap">{copy.description}</p>
      </div>
    </SectionCard>
  )
}
