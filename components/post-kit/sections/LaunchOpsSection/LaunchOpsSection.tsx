import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import { Button } from '@/components/ui/button'
import type { LaunchOpsSectionProps } from './LaunchOpsSection.types'

export function LaunchOpsSection({ kit, onRegenerate, regenerating }: LaunchOpsSectionProps) {
  const { launch } = kit
  return (
    <SectionCard
      title="Launch ops"
      action={<Button variant="ghost" size="sm" onClick={onRegenerate} disabled={regenerating}>Regenerate</Button>}
    >
      <p className="font-medium">Best time: {launch.recommendedDay}, {launch.recommendedTimePT}</p>
      <div>
        <div className="text-xs uppercase text-muted-foreground">Pre-launch</div>
        <ul className="list-disc pl-5">{launch.prelaunchChecklist.map((c) => <li key={c}>{c}</li>)}</ul>
      </div>
      <div>
        <div className="text-xs uppercase text-muted-foreground">Launch day</div>
        <ul className="list-disc pl-5">{launch.launchDayChecklist.map((c) => <li key={c}>{c}</li>)}</ul>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">Hunter outreach</span>
          <CopyButton value={launch.outreach.hunter} />
        </div>
        <p className="whitespace-pre-wrap">{launch.outreach.hunter}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">Supporter outreach</span>
          <CopyButton value={launch.outreach.supporters} />
        </div>
        <p className="whitespace-pre-wrap">{launch.outreach.supporters}</p>
      </div>
    </SectionCard>
  )
}
