import { describe, it, expect, afterEach, vi } from 'vitest'
import { getRuntimeConfig, localFsAllowed, canGenerate } from './runtime-config'
import { DEFAULT_MODEL } from '@/lib/generation/model'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('getRuntimeConfig', () => {
  it('defaults to the mock provider, FS available, default model in dev', () => {
    vi.stubEnv('GENERATION_PROVIDER', '')
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('OPENROUTER_MODEL', '')
    const c = getRuntimeConfig()
    expect(c.provider).toBe('mock')
    expect(c.localFsAvailable).toBe(true)
    expect(c.model).toBe(DEFAULT_MODEL)
  })

  it('reports openrouter, hasKey, and the resolved model', () => {
    vi.stubEnv('GENERATION_PROVIDER', 'openrouter')
    vi.stubEnv('OPENROUTER_API_KEY', 'sk-abc')
    vi.stubEnv('OPENROUTER_MODEL', 'anthropic/claude-opus-4.8')
    const c = getRuntimeConfig()
    expect(c.provider).toBe('openrouter')
    expect(c.hasKey).toBe(true)
    expect(c.model).toBe('anthropic/claude-opus-4.8')
  })

  it('treats a blank/whitespace key as no key', () => {
    vi.stubEnv('GENERATION_PROVIDER', 'openrouter')
    vi.stubEnv('OPENROUTER_API_KEY', '   ')
    expect(getRuntimeConfig().hasKey).toBe(false)
  })
})

describe('localFsAllowed', () => {
  it('is allowed in development', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('LAUNCHKIT_ALLOW_LOCAL_FS', '')
    expect(localFsAllowed()).toBe(true)
  })

  it('is denied in production unless explicitly enabled', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('LAUNCHKIT_ALLOW_LOCAL_FS', '')
    expect(localFsAllowed()).toBe(false)
    vi.stubEnv('LAUNCHKIT_ALLOW_LOCAL_FS', 'true')
    expect(localFsAllowed()).toBe(true)
  })
})

describe('canGenerate', () => {
  it('is always true for the mock provider', () => {
    expect(canGenerate({ provider: 'mock', hasKey: false, model: 'x', localFsAvailable: true })).toBe(true)
  })
  it('requires a key for openrouter', () => {
    expect(canGenerate({ provider: 'openrouter', hasKey: false, model: 'x', localFsAvailable: true })).toBe(false)
    expect(canGenerate({ provider: 'openrouter', hasKey: true, model: 'x', localFsAvailable: true })).toBe(true)
  })
})
