import { describe, it, expect } from 'vitest'
import { launchKitSchema } from './schema'

const validKit = {
  copy: { nameSuggestions: ['Acme'], tagline: 'Do X fast', taglineAlternatives: ['Alt'], description: 'A tool.' },
  topics: ['Developer Tools'],
  firstComment: 'Hey hunters!',
  gallery: { shots: [{ title: 'Hero', purpose: 'wow', caption: 'cap', layoutHint: 'full-bleed' }] },
  video: { hook: 'Tired of X?', scenes: [{ timeRange: '0-3s', visual: 'logo', onScreenText: 'Acme' }], lengthSec: 30, cta: 'Try it' },
  launch: { recommendedDay: 'Tuesday', recommendedTimePT: '12:01 AM', prelaunchChecklist: ['a'], launchDayChecklist: ['b'], outreach: { hunter: 'hi', supporters: 'yo' } },
}

describe('launchKitSchema', () => {
  it('accepts a valid kit', () => {
    expect(launchKitSchema.parse(validKit)).toEqual(validKit)
  })
  it('rejects a kit missing tagline', () => {
    const bad = { ...validKit, copy: { ...validKit.copy, tagline: undefined } }
    expect(() => launchKitSchema.parse(bad)).toThrow()
  })
})
