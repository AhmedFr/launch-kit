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
      {launch.hourByHour && launch.hourByHour.length > 0 && (
        <div>
          <div className="text-xs uppercase text-muted-foreground">Hour-by-hour (PT)</div>
          <ol className="mt-1 space-y-1">
            {launch.hourByHour.map((step) => (
              <li key={step.timePT + step.action} className="flex gap-3">
                <span className="shrink-0 font-mono text-xs text-primary">{step.timePT}</span>
                <span>{step.action}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {launch.momentumTactics && launch.momentumTactics.length > 0 && (
        <div>
          <div className="text-xs uppercase text-muted-foreground">Upvote momentum</div>
          <ul className="list-disc pl-5">{launch.momentumTactics.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      )}
      {launch.commentModeration && launch.commentModeration.length > 0 && (
        <div>
          <div className="text-xs uppercase text-muted-foreground">Comment moderation</div>
          <ul className="list-disc pl-5">{launch.commentModeration.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      )}
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
