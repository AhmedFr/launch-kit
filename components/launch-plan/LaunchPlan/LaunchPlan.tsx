import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import type { LaunchPlanProps } from './LaunchPlan.types'

function Checklist({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <div className="text-xs uppercase text-muted-foreground">{title}</div>
      <ul className="mt-1 list-disc pl-5">{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </div>
  )
}

export function LaunchPlan({ plan, onCopy, onExport }: LaunchPlanProps) {
  const actions = (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onCopy}>Copy</Button>
      <Button size="sm" onClick={onExport}>Export</Button>
    </div>
  )

  return (
    <SectionCard title="Launch plan" action={actions}>
      <div>
        <div className="text-xs uppercase text-muted-foreground">Timeline · L-6 weeks → L+4 weeks</div>
        <ol className="mt-2 space-y-3">
          {plan.phases.map((phase) => (
            <li key={phase.window} className="border-l-2 border-primary/40 pl-3">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-medium text-primary">{phase.window}</span>
                <span className="text-muted-foreground">— {phase.goal}</span>
              </div>
              <ul className="mt-1 list-disc pl-5">{phase.tasks.map((t) => <li key={t}>{t}</li>)}</ul>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Checklist title="30-day countdown" items={plan.countdown30} />
        <Checklist title="7-day countdown" items={plan.countdown7} />
        <Checklist title="Final 48 hours" items={plan.countdown48h} />
      </div>

      <Checklist title="SEO / GEO" items={plan.seoGeo} />
      <Checklist title="Post-launch momentum" items={plan.momentum} />
    </SectionCard>
  )
}
