import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import { EditableText } from '@/components/common/EditableText'
import { Badge } from '@/components/ui/badge'
import type { AppSumoContent } from '@/lib/types'
import type { PlatformSectionsProps } from '../platform-sections.types'

export function AppSumoSections({ content, loading = false, onEdit }: PlatformSectionsProps) {
  const deal = content as AppSumoContent
  return (
    <div className="space-y-4">
      <SectionCard title="Deal headline" loading={loading}>
        <div className="flex items-center justify-between gap-2">
          <EditableText
            value={deal.dealHeadline}
            onCommit={onEdit && ((v) => onEdit(['dealHeadline'], v))}
            ariaLabel="Deal headline"
            className="flex-1 font-medium"
          />
          <CopyButton value={deal.dealHeadline} />
        </div>
      </SectionCard>

      <SectionCard title="Pitch" loading={loading}>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">Overview</span>
          <CopyButton value={deal.pitch} />
        </div>
        <EditableText
          value={deal.pitch}
          onCommit={onEdit && ((v) => onEdit(['pitch'], v))}
          multiline
          ariaLabel="Pitch"
        />
      </SectionCard>

      <SectionCard title="What's included" loading={loading}>
        <ul className="list-disc pl-5">{deal.whatsIncluded.map((i) => <li key={i}>{i}</li>)}</ul>
      </SectionCard>

      <SectionCard title="Best for" loading={loading}>
        <div className="flex flex-wrap gap-1">{deal.bestFor.map((b) => <Badge key={b}>{b}</Badge>)}</div>
      </SectionCard>

      <SectionCard title="FAQ" loading={loading}>
        <dl className="space-y-3">
          {deal.faq.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold">{f.q}</dt>
              <dd className="text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>
    </div>
  )
}
