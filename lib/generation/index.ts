import type { GenerationProvider } from './provider.types'
import { MockProvider } from './mock-provider'
import { OpenRouterProvider } from './openrouter-provider'

export function getProvider(): GenerationProvider {
  if (process.env.GENERATION_PROVIDER === 'openrouter') return new OpenRouterProvider()
  return new MockProvider()
}

export type { GenerationProvider }
