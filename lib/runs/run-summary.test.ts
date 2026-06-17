import { describe, it, expect } from 'vitest'
import { runTitle, runStatus, shortPath } from './run-summary'
import type { Run } from './runs.types'

const makeRun = (over: Partial<Run>): Run => ({
  id: '1', path: '/code/acme', step: 'review', context: null, refinements: {}, generation: null, createdAt: 0, updatedAt: 0, ...over,
})

describe('runTitle', () => {
  it('prefers the product name', () => {
    expect(runTitle(makeRun({ context: { name: 'Acme' } as Run['context'] }))).toBe('Acme')
  })
  it('falls back to the folder basename', () => {
    expect(runTitle(makeRun({ path: '/code/acme' }))).toBe('acme')
  })
  it('falls back to a label when there is no path', () => {
    expect(runTitle(makeRun({ path: '' }))).toBe('Untitled run')
  })
})

describe('runStatus', () => {
  it('reports draft, context, and kit tones', () => {
    expect(runStatus(makeRun({ context: null, generation: null })).tone).toBe('draft')
    expect(runStatus(makeRun({ context: { name: 'Acme' } as Run['context'] })).tone).toBe('review')
    expect(runStatus(makeRun({ generation: { core: {}, platforms: {} } as Run['generation'] })).tone).toBe('ready')
  })
})

describe('shortPath', () => {
  it('keeps short paths intact', () => {
    expect(shortPath('/code')).toBe('/code')
    expect(shortPath('/code/acme')).toBe('/code/acme')
  })
  it('compacts long paths to the last two segments', () => {
    expect(shortPath('/Users/me/code/personal/acme')).toBe('…/personal/acme')
  })
})
