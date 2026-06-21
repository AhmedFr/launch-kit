import { describe, it, expect } from 'vitest'
import { launchPlanSchema } from './plan.schema'

const plan = {
  phases: [{ window: 'L-6 weeks', goal: 'Lock strategy', tasks: ['Define ICP'] }],
  countdown30: ['Build the landing page'],
  countdown7: ['Confirm the hunter'],
  countdown48h: ['Final QA'],
  seoGeo: ['Configure IndexNow'],
  momentum: ['Post a recap'],
}

describe('launchPlanSchema', () => {
  it('accepts a valid plan', () => {
    expect(launchPlanSchema.parse(plan)).toEqual(plan)
  })
  it('rejects a plan missing phases', () => {
    expect(() => launchPlanSchema.parse({ ...plan, phases: undefined })).toThrow()
  })
  it('rejects a phase missing its tasks', () => {
    expect(() => launchPlanSchema.parse({ ...plan, phases: [{ window: 'L-6 weeks', goal: 'x' }] })).toThrow()
  })
})
