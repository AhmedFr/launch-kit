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
  it('HYDRATE replaces state wholesale', () => {
    const saved = { ...initialState, step: 'kit' as const, context: ctx }
    expect(wizardReducer(initialState, { type: 'HYDRATE', state: saved })).toEqual(saved)
  })
  it('GO navigates without dropping context or kit', () => {
    const atKit = { ...initialState, step: 'kit' as const, context: ctx, kit: {} as LaunchKit }
    const back = wizardReducer(atKit, { type: 'GO', step: 'review' })
    expect(back.step).toBe('review')
    expect(back.context).toBe(ctx)
    expect(back.kit).not.toBeNull()
  })
  it('ANALYZED clears a stale kit from a previous run', () => {
    const withKit = { ...initialState, step: 'kit' as const, context: ctx, kit: {} as LaunchKit }
    const re = wizardReducer(withKit, { type: 'ANALYZED', context: { ...ctx, name: 'New' } })
    expect(re.kit).toBeNull()
    expect(re.step).toBe('review')
  })
})
