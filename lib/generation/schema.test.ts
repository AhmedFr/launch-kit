import { describe, it, expect } from 'vitest'
import { launchCoreSchema } from './core/core.schema'
import { productHuntSchema } from './platforms/product-hunt/schema'
import { hackerNewsSchema } from './platforms/hacker-news/schema'
import { redditSchema } from './platforms/reddit/schema'
import { appSumoSchema } from './platforms/appsumo/schema'
import { socialSchema } from './platforms/social/schema'

const core = {
  productName: 'Acme',
  essence: 'Acme ships faster.',
  audience: 'developers',
  problem: 'Shipping is slow.',
  features: ['Fast builds'],
  differentiators: ['Zero config'],
  valueProp: 'Ship in minutes, not days.',
  icp: 'Seed-stage dev teams shipping weekly',
  keywords: ['ci', 'builds', 'developer tools'],
}

const productHunt = {
  copy: { nameSuggestions: ['Acme'], tagline: 'Do X fast', taglineAlternatives: ['Alt'], description: 'A tool.' },
  topics: ['Developer Tools'],
  firstComment: 'Hey hunters!',
  gallery: { shots: [{ title: 'Hero', purpose: 'wow', caption: 'cap', layoutHint: 'full-bleed' }] },
  video: { hook: 'Tired of X?', scenes: [{ timeRange: '0-3s', visual: 'logo', onScreenText: 'Acme' }], lengthSec: 30, cta: 'Try it' },
  launch: { recommendedDay: 'Tuesday', recommendedTimePT: '12:01 AM', prelaunchChecklist: ['a'], launchDayChecklist: ['b'], outreach: { hunter: 'hi', supporters: 'yo' } },
}

const hackerNews = {
  title: 'Show HN: Acme – ship faster',
  postBody: 'I built Acme to make builds fast.',
  firstComment: 'Happy to answer technical questions.',
  postingTips: { bestTimeET: '8:00 AM ET, weekday', avoid: ['marketing language'] },
}

const reddit = {
  subreddits: [{ name: 'r/SideProject', why: 'makers share early projects' }],
  title: 'I built Acme to make builds fast',
  body: 'Here is the story and what I learned.',
  replyEtiquette: ['Answer every comment', 'Disclose you are the maker'],
}

const appSumo = {
  dealHeadline: 'Lifetime access to Acme',
  pitch: 'Ship faster, pay once.',
  whatsIncluded: ['All core features', 'Lifetime updates'],
  bestFor: ['Indie developers'],
  faq: [{ q: 'Is it really lifetime?', a: 'Yes.' }],
}

const social = {
  thread: { tweets: ['Devs: shipping is slow. I built Acme. 🧵', 'It does X, Y, Z.', 'Live today — try it.'] },
  kolOutreach: { twitter: 'Hey {name}...', linkedin: 'Hi {name}...', telegram: 'Hi {name}!' },
  ugcAsk: 'Would you share how you use Acme?',
  postingTips: { bestTimeET: '9:00 AM ET', hashtags: ['#buildinpublic'] },
}

describe('launchCoreSchema', () => {
  it('accepts a valid core', () => {
    expect(launchCoreSchema.parse(core)).toEqual(core)
  })
  it('rejects a core missing essence', () => {
    expect(() => launchCoreSchema.parse({ ...core, essence: undefined })).toThrow()
  })
  it('accepts a core without the optional enrichment fields (back-compat)', () => {
    const { valueProp, icp, keywords, ...legacy } = core
    void valueProp; void icp; void keywords
    expect(() => launchCoreSchema.parse(legacy)).not.toThrow()
  })
})

describe('productHuntSchema', () => {
  it('accepts valid Product Hunt content', () => {
    expect(productHuntSchema.parse(productHunt)).toEqual(productHunt)
  })
  it('rejects content missing the tagline', () => {
    expect(() => productHuntSchema.parse({ ...productHunt, copy: { ...productHunt.copy, tagline: undefined } })).toThrow()
  })
})

describe('hackerNewsSchema', () => {
  it('accepts valid Hacker News content', () => {
    expect(hackerNewsSchema.parse(hackerNews)).toEqual(hackerNews)
  })
  it('rejects content missing the title', () => {
    expect(() => hackerNewsSchema.parse({ ...hackerNews, title: undefined })).toThrow()
  })
})

describe('redditSchema', () => {
  it('accepts valid Reddit content', () => {
    expect(redditSchema.parse(reddit)).toEqual(reddit)
  })
  it('rejects content with a malformed subreddit entry', () => {
    expect(() => redditSchema.parse({ ...reddit, subreddits: [{ name: 'r/X' }] })).toThrow()
  })
})

describe('appSumoSchema', () => {
  it('accepts valid AppSumo content', () => {
    expect(appSumoSchema.parse(appSumo)).toEqual(appSumo)
  })
  it('rejects content with a malformed faq entry', () => {
    expect(() => appSumoSchema.parse({ ...appSumo, faq: [{ q: 'no answer' }] })).toThrow()
  })
})

describe('socialSchema', () => {
  it('accepts valid Social content', () => {
    expect(socialSchema.parse(social)).toEqual(social)
  })
  it('rejects content missing the thread', () => {
    expect(() => socialSchema.parse({ ...social, thread: undefined })).toThrow()
  })
  it('rejects outreach missing a channel', () => {
    expect(() => socialSchema.parse({ ...social, kolOutreach: { twitter: 'a', linkedin: 'b' } })).toThrow()
  })
})
