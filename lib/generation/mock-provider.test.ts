import { describe, it, expect } from 'vitest'
import { MockProvider } from './mock-provider'
import { launchCoreSchema } from './core/core.schema'
import { launchPlanSchema } from './plan/plan.schema'
import { PLATFORM_GENERATORS } from './platforms/registry'
import type { GenerateInput } from '@/lib/types'
import type { PlatformId } from '@/lib/platforms'

const input: GenerateInput = {
  context: {
    name: 'Acme', oneLiner: 'Ship faster', summary: 'Acme helps teams ship faster.',
    features: ['Fast builds', 'Great DX'], techStack: ['Next.js'], differentiators: ['Zero config'],
    links: [], readmeExcerpt: 'Acme helps teams ship faster.', warnings: [],
  },
  refinements: { tone: 'bold', audience: 'developers' },
}

const PLATFORMS: PlatformId[] = ['product-hunt', 'appsumo', 'hacker-news', 'reddit', 'social']

describe('MockProvider', () => {
  it('produces a schema-valid core that references the product', async () => {
    const core = await new MockProvider().generateCore(input)
    expect(() => launchCoreSchema.parse(core)).not.toThrow()
    expect(core.productName).toBe('Acme')
  })

  it.each(PLATFORMS)('produces schema-valid %s content referencing the product', async (platform) => {
    const provider = new MockProvider()
    const core = await provider.generateCore(input)
    const content = await provider.generatePlatform(platform, core, input)
    expect(() => PLATFORM_GENERATORS[platform].schema.parse(content)).not.toThrow()
    expect(JSON.stringify(content)).toContain('Acme')
  })

  it('keeps the Product Hunt tagline within 60 characters', async () => {
    const provider = new MockProvider()
    const core = await provider.generateCore(input)
    const content = await provider.generatePlatform('product-hunt', core, input)
    expect((content as { copy: { tagline: string } }).copy.tagline.length).toBeLessThanOrEqual(60)
  })

  it('produces a schema-valid launch plan spanning the timeline', async () => {
    const provider = new MockProvider()
    const core = await provider.generateCore(input)
    const plan = await provider.generatePlan(core, input)
    expect(() => launchPlanSchema.parse(plan)).not.toThrow()
    expect(plan.phases.length).toBeGreaterThan(0)
    expect(plan.seoGeo.length).toBeGreaterThan(0)
  })
})
