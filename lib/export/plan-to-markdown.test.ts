import { describe, it, expect } from 'vitest'
import { planToMarkdown } from './plan-to-markdown'
import type { LaunchCore, LaunchPlan } from '@/lib/types'

const core: LaunchCore = {
  productName: 'Acme', essence: 'Ship faster', audience: 'developers', problem: 'Shipping is slow', features: ['Fast builds'], differentiators: ['Zero config'],
}

const plan: LaunchPlan = {
  phases: [{ window: 'L-6 weeks', goal: 'Lock strategy', tasks: ['Define ICP'] }],
  countdown30: ['Build the landing page'],
  countdown7: ['Confirm the hunter'],
  countdown48h: ['Final QA'],
  seoGeo: ['Configure IndexNow'],
  momentum: ['Post a recap'],
}

describe('planToMarkdown', () => {
  it('renders the timeline, countdowns, SEO/GEO and momentum', () => {
    const md = planToMarkdown(core, plan)
    expect(md).toContain('# Acme — Launch Plan')
    expect(md).toContain('### L-6 weeks — Lock strategy')
    expect(md).toContain('## 30-Day Countdown')
    expect(md).toContain('## 7-Day Countdown')
    expect(md).toContain('## Final 48 Hours')
    expect(md).toContain('## SEO / GEO')
    expect(md).toContain('## Post-Launch Momentum')
  })
})
