import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createRun, getRun, findByPath, saveRun, deleteRun, listRuns } from './store'
import type { ProjectContext } from '@/lib/types'

const ctx = (name: string) =>
  ({ name, oneLiner: '', summary: '', features: [], techStack: [], differentiators: [], links: [], readmeExcerpt: '', warnings: [] }) as ProjectContext

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
})

describe('runs store', () => {
  it('creates a run with an id, path and timestamps, and lists it', () => {
    const run = createRun('/code/acme', ctx('Acme'))
    expect(run.id).toBeTruthy()
    expect(run.path).toBe('/code/acme')
    expect(run.context?.name).toBe('Acme')
    expect(run.createdAt).toBeGreaterThan(0)
    expect(listRuns().map((r) => r.id)).toContain(run.id)
  })

  it('starts at review when created with context, folder when without', () => {
    expect(createRun('/a', ctx('A')).step).toBe('review')
    expect(createRun('/b').step).toBe('folder')
  })

  it('finds a run by its folder path and returns null for unknown paths', () => {
    const run = createRun('/code/acme', ctx('Acme'))
    expect(findByPath('/code/acme')?.id).toBe(run.id)
    expect(findByPath('/code/nope')).toBeNull()
  })

  it('treats trailing-slash and whitespace path variants as the same run', () => {
    const run = createRun('/code/acme/', ctx('Acme'))
    expect(run.path).toBe('/code/acme')
    expect(findByPath('/code/acme')?.id).toBe(run.id)
    expect(findByPath('  /code/acme/  ')?.id).toBe(run.id)
  })

  it('getRun returns the run by id, null when missing', () => {
    const run = createRun('/code/acme', ctx('Acme'))
    expect(getRun(run.id)?.path).toBe('/code/acme')
    expect(getRun('missing')).toBeNull()
  })

  it('saveRun persists changes and bumps updatedAt', () => {
    vi.setSystemTime(1000)
    const run = createRun('/code/acme', ctx('Acme'))
    vi.setSystemTime(5000)
    saveRun({ ...run, step: 'kit' })
    const stored = getRun(run.id)
    expect(stored?.step).toBe('kit')
    expect(stored?.updatedAt).toBe(5000)
    expect(stored?.createdAt).toBe(1000)
  })

  it('lists runs most-recently-updated first', () => {
    vi.setSystemTime(1000)
    const a = createRun('/a', ctx('A'))
    vi.setSystemTime(2000)
    const b = createRun('/b', ctx('B'))
    expect(listRuns().map((r) => r.id)).toEqual([b.id, a.id])
    vi.setSystemTime(3000)
    saveRun({ ...a, step: 'kit' })
    expect(listRuns().map((r) => r.id)).toEqual([a.id, b.id])
  })

  it('deletes a run', () => {
    const run = createRun('/code/acme', ctx('Acme'))
    deleteRun(run.id)
    expect(getRun(run.id)).toBeNull()
    expect(listRuns()).toHaveLength(0)
  })

  it('migrates a legacy single-run from ph-launch-kit on first read', () => {
    localStorage.setItem(
      'ph-launch-kit',
      JSON.stringify({ step: 'kit', context: ctx('Legacy'), refinements: { tone: 'bold' }, generation: { core: {}, platforms: {} } }),
    )
    const runs = listRuns()
    expect(runs).toHaveLength(1)
    expect(runs[0].context?.name).toBe('Legacy')
    expect(runs[0].step).toBe('kit')
    // legacy key is consumed so it doesn't migrate twice
    expect(localStorage.getItem('ph-launch-kit')).toBeNull()
  })
})
