import { describe, it, expect } from 'vitest'
import { buildCorePrompt, CORE_SYSTEM_PROMPT } from './core/core.prompt'
import { PLATFORM_GENERATORS } from './platforms/registry'
import type { GenerateInput, LaunchCore } from '@/lib/types'

const core: LaunchCore = {
  productName: 'Acme',
  essence: 'Acme ships faster.',
  audience: 'developers',
  problem: 'Shipping is slow.',
  features: ['Fast builds'],
  differentiators: ['Zero config'],
}

const input: GenerateInput = {
  context: {
    name: 'Acme', oneLiner: 'Ship faster', summary: 'Acme helps teams ship faster.',
    features: ['Fast builds'], techStack: ['Next.js'], differentiators: ['Zero config'],
    links: [], readmeExcerpt: '', warnings: [],
  },
  refinements: { tone: 'bold', audience: 'developers' },
}

describe('buildCorePrompt', () => {
  it('includes the product facts and asks for the core shape', () => {
    const prompt = buildCorePrompt(input)
    expect(prompt).toContain('Acme')
    expect(prompt).toContain('essence')
  })
  it('has a non-empty system prompt', () => {
    expect(CORE_SYSTEM_PROMPT.length).toBeGreaterThan(0)
  })
})

describe('PLATFORM_GENERATORS', () => {
  it('covers all four platforms with schema, system, and buildPrompt', () => {
    for (const id of ['product-hunt', 'appsumo', 'hacker-news', 'reddit'] as const) {
      const gen = PLATFORM_GENERATORS[id]
      expect(gen.schema).toBeDefined()
      expect(gen.system.length).toBeGreaterThan(0)
      expect(typeof gen.buildPrompt).toBe('function')
    }
  })

  it('builds a Product Hunt prompt referencing the core and tagline', () => {
    const prompt = PLATFORM_GENERATORS['product-hunt'].buildPrompt(core, input)
    expect(prompt).toContain('Acme')
    expect(prompt).toContain('tagline')
  })

  it('builds a Hacker News prompt that asks for a Show HN post', () => {
    expect(PLATFORM_GENERATORS['hacker-news'].buildPrompt(core, input)).toContain('Show HN')
  })

  it('builds a Reddit prompt that talks about subreddits', () => {
    expect(PLATFORM_GENERATORS['reddit'].buildPrompt(core, input).toLowerCase()).toContain('subreddit')
  })

  it('builds an AppSumo prompt framed around a lifetime deal', () => {
    expect(PLATFORM_GENERATORS['appsumo'].buildPrompt(core, input).toLowerCase()).toContain('lifetime')
  })
})
