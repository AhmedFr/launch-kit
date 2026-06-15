import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readFolder } from './read-folder'

let dir: string
beforeEach(async () => { dir = await mkdtemp(join(tmpdir(), 'ph-')) })
afterEach(async () => { await rm(dir, { recursive: true, force: true }) })

describe('readFolder', () => {
  it('builds a ProjectContext from README + package.json', async () => {
    await writeFile(join(dir, 'package.json'), JSON.stringify({ name: 'acme', description: 'Ship faster', dependencies: { next: '14' } }))
    await writeFile(join(dir, 'README.md'), '# Acme\n\nAcme helps teams ship faster.\n\n- Feature one\n- Feature two\n')
    const ctx = await readFolder(dir)
    expect(ctx.name).toBe('acme')
    expect(ctx.techStack).toContain('Next.js')
    expect(ctx.features.length).toBeGreaterThan(0)
    expect(ctx.readmeExcerpt).toContain('Acme')
    expect(ctx.warnings).toHaveLength(0)
  })

  it('warns when README is missing but still returns context', async () => {
    await writeFile(join(dir, 'package.json'), JSON.stringify({ name: 'noreadme' }))
    const ctx = await readFolder(dir)
    expect(ctx.name).toBe('noreadme')
    expect(ctx.warnings.join(' ')).toMatch(/README/i)
  })

  it('throws a clear error when the path is not a directory', async () => {
    await expect(readFolder(join(dir, 'does-not-exist'))).rejects.toThrow(/not a directory|does not exist/i)
  })
})
