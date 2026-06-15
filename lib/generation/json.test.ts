import { describe, it, expect } from 'vitest'
import { extractJsonObject } from './json'

describe('extractJsonObject', () => {
  it('returns a bare JSON object unchanged', () => {
    expect(extractJsonObject('{"a":1}')).toBe('{"a":1}')
  })
  it('strips ```json fences', () => {
    expect(extractJsonObject('```json\n{"a":1}\n```')).toBe('{"a":1}')
  })
  it('strips bare ``` fences', () => {
    expect(extractJsonObject('```\n{"a":1}\n```')).toBe('{"a":1}')
  })
  it('extracts an object surrounded by prose', () => {
    expect(extractJsonObject('Sure! Here it is:\n{"a":1}\nHope that helps')).toBe('{"a":1}')
  })
  it('handles nested objects', () => {
    const json = '{"a":{"b":2},"c":[1,2]}'
    expect(extractJsonObject('```json\n' + json + '\n```')).toBe(json)
  })
  it('throws when there is no JSON object', () => {
    expect(() => extractJsonObject('no json here')).toThrow(/no json/i)
  })
})
