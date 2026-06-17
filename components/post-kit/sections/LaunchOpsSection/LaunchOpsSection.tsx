import { SectionCard } from '@/components/common/SectionCard'
import { CopyButton } from '@/components/common/CopyButton'
import type { LaunchOpsSectionProps } from './LaunchOpsSection.types'

export function LaunchOpsSection({ kit, loading = false }: LaunchOpsSectionProps) {
  const { launch } = kit
  return (
    <SectionCard title="Launch ops" loading={loading}>
      <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2">
        <span aria-hidden>📅</span>
        <span><span className="font-medium">Best time:</span> {launch.recommendedDay}, {launch.recommendedTimePT}</span>
      </div>
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
