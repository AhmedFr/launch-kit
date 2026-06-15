import { describe, it, expect } from 'vitest'
import { wizardReducer, initialState } from './wizard-reducer'
import type { ProjectContext, LaunchKit } from '@/lib/types'

const ctx = { name: 'Acme', oneLiner: '', summary: '', features: [], techStack: [], differentiators: [], links: [], readmeExcerpt: '', warnings: [] } as ProjectContext

describe('wizardReducer', () => {
  it('advances to review on ANALYZED', () => {
    const s = wizardReducer(initialState, { type: 'ANALYZED', context: ctx })
    expect(s.step).toBe('review')
    expect(s.context?.name).toBe('Acme')
  })
  it('advances to kit on GENERATED', () => {
    const mid = wizardReducer(initialState, { type: 'ANALYZED', context: ctx })
    const s = wizardReducer(mid, { type: 'GENERATED', kit: {} as LaunchKit })
    expect(s.step).toBe('kit')
  })
  it('RESET returns to folder step', () => {
    const mid = wizardReducer(initialState, { type: 'ANALYZED', context: ctx })
    expect(wizardReducer(mid, { type: 'RESET' }).step).toBe('folder')
  })
})
