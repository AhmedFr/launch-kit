import { describe, it, expect } from 'vitest'
import { platformToMarkdown } from './to-markdown'
import type { LaunchCore, ProductHuntContent, HackerNewsContent, RedditContent, AppSumoContent } from '@/lib/types'

const core: LaunchCore = {
  productName: 'Acme', essence: 'Ship faster', audience: 'developers', problem: 'Shipping is slow', features: ['Fast builds'], differentiators: ['Zero config'],
}

const ph: ProductHuntContent = {
  copy: { nameSuggestions: ['Acme'], tagline: 'Ship faster', taglineAlternatives: ['Go fast'], description: 'A tool.' },
  topics: ['Developer Tools'],
  firstComment: 'Hey hunters!',
  gallery: { shots: [{ title: 'Hero', purpose: 'wow', caption: 'cap', layoutHint: 'full-bleed' }] },
  video: { hook: 'Tired?', scenes: [{ timeRange: '0-3s', visual: 'logo', onScreenText: 'Acme' }], lengthSec: 30, cta: 'Try it' },
  launch: { recommendedDay: 'Tuesday', recommendedTimePT: '12:01 AM PT', prelaunchChecklist: ['a'], launchDayChecklist: ['b'], outreach: { hunter: 'hi', supporters: 'yo' } },
}

const hn: HackerNewsContent = {
  title: 'Show HN: Acme – ship faster',
  postBody: 'I built Acme to make builds fast.',
  firstComment: 'Happy to answer questions.',
  postingTips: { bestTimeET: '8:00 AM ET', avoid: ['hype'] },
}

const reddit: RedditContent = {
  subreddits: [{ name: 'r/SideProject', why: 'makers share early projects' }],
  title: 'I built Acme',
  body: 'Story here.',
  replyEtiquette: ['Reply to everyone'],
}

const appSumo: AppSumoContent = {
  dealHeadline: 'Lifetime access to Acme',
  pitch: 'Pay once, own forever.',
  whatsIncluded: ['All features'],
  bestFor: ['Indie devs'],
  faq: [{ q: 'Lifetime?', a: 'Yes.' }],
}

describe('platformToMarkdown', () => {
  it('renders Product Hunt content with gallery and video', () => {
    const md = platformToMarkdown('product-hunt', core, ph)
    expect(md).toContain('Product Hunt')
    expect(md).toContain('Ship faster')
    expect(md).toContain('## Gallery')
    expect(md).toContain('## Demo Video')
    expect(md).toContain('Tuesday')
  })

  it('renders Hacker News content without a gallery section', () => {
    const md = platformToMarkdown('hacker-news', core, hn)
    expect(md).toContain('Show HN: Acme – ship faster')
    expect(md).toContain('I built Acme to make builds fast.')
    expect(md).not.toContain('## Gallery')
  })

  it('renders Reddit content with subreddits', () => {
    const md = platformToMarkdown('reddit', core, reddit)
    expect(md).toContain('r/SideProject')
    expect(md).toContain('Story here.')
  })

  it('renders AppSumo content with the deal headline', () => {
    const md = platformToMarkdown('appsumo', core, appSumo)
    expect(md).toContain('Lifetime access to Acme')
    expect(md).toContain('Pay once, own forever.')
  })
})
