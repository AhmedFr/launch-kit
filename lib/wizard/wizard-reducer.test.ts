import { describe, it, expect } from 'vitest'
import { wizardReducer, initialState } from './wizard-reducer'
import type { ProjectContext, Generation, PlatformContent } from '@/lib/types'

const ctx = { name: 'Acme', oneLiner: '', summary: '', features: [], techStack: [], differentiators: [], links: [], readmeExcerpt: '', warnings: [] } as ProjectContext

const gen = {
  core: { productName: 'Acme', essence: 'x', audience: 'devs', problem: 'y', features: [], differentiators: [] },
  platforms: { 'product-hunt': { id: 'ph' }, reddit: { id: 'rdt' } },
} as unknown as Generation

describe('wizardReducer', () => {
  it('advances to review on ANALYZED', () => {
    const s = wizardReducer(initialState, { type: 'ANALYZED', context: ctx })
    expect(s.step).toBe('review')
    expect(s.context?.name).toBe('Acme')
  })

  it('advances to kit on GENERATED and stores the generation', () => {
    const mid = wizardReducer(initialState, { type: 'ANALYZED', context: ctx })
    const s = wizardReducer(mid, { type: 'GENERATED', generation: gen })
    expect(s.step).toBe('kit')
    expect(s.generation).toBe(gen)
  })

  it('REGEN_PLATFORM patches one platform without touching others or the core', () => {
    const atKit = { ...initialState, step: 'kit' as const, context: ctx, generation: gen }
    const fresh = { id: 'new-rdt' } as unknown as PlatformContent
    const s = wizardReducer(atKit, { type: 'REGEN_PLATFORM', platform: 'reddit', content: fresh })
    expect(s.generation?.platforms.reddit).toBe(fresh)
    expect(s.generation?.platforms['product-hunt']).toBe(gen.platforms['product-hunt'])
    expect(s.generation?.core).toBe(gen.core)
  })

  it('REGEN_PLATFORM is a no-op when there is no generation', () => {
    const s = wizardReducer(initialState, { type: 'REGEN_PLATFORM', platform: 'reddit', content: {} as PlatformContent })
    expect(s.generation).toBeNull()
  })

  it('RESET returns to folder step', () => {
    const mid = wizardReducer(initialState, { type: 'ANALYZED', context: ctx })
    expect(wizardReducer(mid, { type: 'RESET' }).step).toBe('folder')
  })

  it('HYDRATE replaces state wholesale', () => {
    const saved = { ...initialState, step: 'kit' as const, context: ctx }
    expect(wizardReducer(initialState, { type: 'HYDRATE', state: saved })).toEqual(saved)
  })

  it('GO navigates without dropping context or generation', () => {
    const atKit = { ...initialState, step: 'kit' as const, context: ctx, generation: gen }
    const back = wizardReducer(atKit, { type: 'GO', step: 'review' })
    expect(back.step).toBe('review')
    expect(back.context).toBe(ctx)
    expect(back.generation).not.toBeNull()
  })

  it('ANALYZED clears a stale generation from a previous run', () => {
    const withGen = { ...initialState, step: 'kit' as const, context: ctx, generation: gen }
    const re = wizardReducer(withGen, { type: 'ANALYZED', context: { ...ctx, name: 'New' } })
    expect(re.generation).toBeNull()
    expect(re.step).toBe('review')
  })
})
