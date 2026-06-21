import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostKit } from './PostKit'
import { RuntimeConfigProvider } from '@/lib/config/RuntimeConfigProvider'
import type { RuntimeConfig } from '@/lib/config/runtime-config'
import { MockProvider } from '@/lib/generation/mock-provider'
import type { GenerateInput, Generation } from '@/lib/types'

const input: GenerateInput = {
  context: {
    name: 'Acme', oneLiner: 'Ship faster', summary: 'Acme helps teams ship faster.',
    features: ['Fast builds'], techStack: ['Next.js'], differentiators: ['Zero config'],
    links: [], readmeExcerpt: '', warnings: [],
  },
  refinements: { tone: 'bold', audience: 'developers' },
}

const config: RuntimeConfig = { provider: 'mock', hasKey: false, model: 'mock', localFsAvailable: true }

let generation: Generation

beforeAll(async () => {
  const p = new MockProvider()
  const core = await p.generateCore(input)
  const [ph, hn] = await Promise.all([
    p.generatePlatform('product-hunt', core, input),
    p.generatePlatform('hacker-news', core, input),
  ])
  generation = { core, platforms: { 'product-hunt': ph, 'hacker-news': hn } as Generation['platforms'] }
})

function renderKit() {
  return render(
    <RuntimeConfigProvider value={config}>
      <PostKit
        generation={generation}
        productName="Acme"
        onExportMarkdown={vi.fn()}
        onCopyPlan={vi.fn()}
        onExportPlan={vi.fn()}
        onStartOver={vi.fn()}
      />
    </RuntimeConfigProvider>,
  )
}

describe('PostKit launch-ops tab', () => {
  it('shows a Launch ops tab for Product Hunt and keeps ops out of the Edit view', async () => {
    renderKit()
    // Product Hunt is the default platform; the third tab is present.
    expect(screen.getByRole('button', { name: 'Launch ops' })).toBeInTheDocument()
    // Edit view (default) no longer renders the launch-day ops.
    expect(screen.queryByText('Hour-by-hour (PT)')).not.toBeInTheDocument()
    // Switching to the tab reveals the ops content.
    await userEvent.click(screen.getByRole('button', { name: 'Launch ops' }))
    expect(screen.getByText('Hour-by-hour (PT)')).toBeInTheDocument()
  })

  it('hides the Launch ops tab for platforms without launch-day ops', async () => {
    renderKit()
    await userEvent.click(screen.getByRole('button', { name: 'Hacker News' }))
    expect(screen.queryByRole('button', { name: 'Launch ops' })).not.toBeInTheDocument()
  })
})
