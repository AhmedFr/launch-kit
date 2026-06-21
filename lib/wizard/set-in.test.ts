import { describe, it, expect } from 'vitest'
import { setIn } from './set-in'

describe('setIn', () => {
  it('sets a nested object key immutably', () => {
    const o = { copy: { tagline: 'a', description: 'd' } }
    const next = setIn(o, ['copy', 'tagline'], 'b')
    expect(next).toEqual({ copy: { tagline: 'b', description: 'd' } })
    expect(o.copy.tagline).toBe('a')
    expect(next).not.toBe(o)
    expect(next.copy).not.toBe(o.copy)
  })

  it('sets an array index immutably', () => {
    const o = { thread: { tweets: ['x', 'y', 'z'] } }
    const next = setIn(o, ['thread', 'tweets', 1], 'Y')
    expect(next.thread.tweets).toEqual(['x', 'Y', 'z'])
    expect(o.thread.tweets[1]).toBe('y')
    expect(next.thread.tweets).not.toBe(o.thread.tweets)
  })

  it('replaces the whole value at an empty path', () => {
    expect(setIn({ a: 1 }, [], 'whole')).toBe('whole')
  })
})
