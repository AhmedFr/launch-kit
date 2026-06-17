import { describe, it, expect } from 'vitest'
import { describeOpenRouterError } from './openrouter-errors'

describe('describeOpenRouterError', () => {
  it('explains a rejected key on 401/403 and points at OPENROUTER_API_KEY', () => {
    expect(describeOpenRouterError(401, '{"error":{"message":"invalid key"}}')).toMatch(/API key/i)
    expect(describeOpenRouterError(401, '')).toContain('OPENROUTER_API_KEY')
    expect(describeOpenRouterError(403, '')).toContain('OPENROUTER_API_KEY')
  })

  it('explains a missing model on 404 and points at OPENROUTER_MODEL', () => {
    expect(describeOpenRouterError(404, '')).toContain('OPENROUTER_MODEL')
  })

  it('handles credits (402) and rate-limit (429)', () => {
    expect(describeOpenRouterError(402, '')).toMatch(/credit/i)
    expect(describeOpenRouterError(429, '')).toMatch(/rate limit/i)
  })

  it('falls back to a generic message with the status', () => {
    expect(describeOpenRouterError(500, 'boom')).toMatch(/OpenRouter 500/)
  })

  it('appends the upstream detail message when present', () => {
    expect(describeOpenRouterError(400, '{"error":{"message":"bad request detail"}}')).toContain('bad request detail')
  })
})
