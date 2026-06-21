import type { LaunchCore, LaunchPlan } from '@/lib/types'

const bullets = (items: string[]) => items.map((i) => `- ${i}`).join('\n')

// Renders the cross-platform launch plan as Markdown for copy/export.
export function planToMarkdown(core: LaunchCore, plan: LaunchPlan): string {
  return `# ${core.productName} — Launch Plan

## Timeline (L-6 weeks → L+4 weeks)
${plan.phases
  .map((p) => `### ${p.window} — ${p.goal}\n${bullets(p.tasks)}`)
  .join('\n\n')}

## 30-Day Countdown
${bullets(plan.countdown30)}

## 7-Day Countdown
${bullets(plan.countdown7)}

## Final 48 Hours
${bullets(plan.countdown48h)}

## SEO / GEO
${bullets(plan.seoGeo)}

## Post-Launch Momentum
${bullets(plan.momentum)}
`
}
