import { describe, it, expect } from 'vitest'
import { kitToMarkdown } from './to-markdown'
import type { LaunchKit } from '@/lib/types'

const kit: LaunchKit = {
  copy: { nameSuggestions: ['Acme'], tagline: 'Ship faster', taglineAlternatives: ['Go fast'], description: 'A tool.' },
  topics: ['Developer Tools'],
  firstComment: 'Hey hunters!',
  gallery: { shots: [{ title: 'Hero', purpose: 'wow', caption: 'cap', layoutHint: 'full-bleed' }] },
  video: { hook: 'Tired?', scenes: [{ timeRange: '0-3s', visual: 'logo', onScreenText: 'Acme' }], lengthSec: 30, cta: 'Try it' },
  launch: { recommendedDay: 'Tuesday', recommendedTimePT: '12:01 AM PT', prelaunchChecklist: ['a'], launchDayChecklist: ['b'], outreach: { hunter: 'hi', supporters: 'yo' } },
}

describe('kitToMarkdown', () => {
  it('renders all sections as markdown', () => {
    const md = kitToMarkdown(kit)
    expect(md).toContain('# Product Hunt Launch Kit')
    expect(md).toContain('Ship faster')
    expect(md).toContain('## Gallery')
    expect(md).toContain('## Demo Video')
    expect(md).toContain('Tuesday')
  })
})
