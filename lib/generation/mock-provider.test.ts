import { describe, it, expect } from 'vitest'
import { MockProvider } from './mock-provider'
import { launchKitSchema } from './schema'
import type { GenerateInput } from '@/lib/types'

const input: GenerateInput = {
  context: {
    name: 'Acme', oneLiner: 'Ship faster', summary: 'Acme helps teams ship faster.',
    features: ['Fast builds', 'Great DX'], techStack: ['Next.js'], differentiators: [],
    links: [], readmeExcerpt: 'Acme helps teams ship faster.', warnings: [],
  },
  refinements: { tone: 'bold', audience: 'developers' },
}

describe('MockProvider', () => {
  it('produces a schema-valid kit that references the product name', async () => {
    const kit = await new MockProvider().generateKit(input)
    expect(() => launchKitSchema.parse(kit)).not.toThrow()
    expect(kit.copy.tagline.length).toBeLessThanOrEqual(60)
    expect(JSON.stringify(kit)).toContain('Acme')
    expect(kit.gallery.shots.length).toBeGreaterThanOrEqual(3)
    expect(kit.video.scenes.length).toBeGreaterThanOrEqual(3)
  })

  it('regenerates a single section', async () => {
    const patch = await new MockProvider().generateSection('copy', input)
    expect(patch.copy).toBeDefined()
    expect(patch.topics).toBeUndefined()
  })
})
