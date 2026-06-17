import { DEFAULT_MODEL } from '@/lib/generation/model'

export type GenerationProviderId = 'mock' | 'openrouter'

// Generation/runtime status surfaced to the UI. Never includes the key itself.
export type RuntimeConfig = {
  provider: GenerationProviderId
  hasKey: boolean
  model: string
  localFsAvailable: boolean
}

// The folder-analysis route reads the local filesystem, so it's only allowed during
// local dev or when explicitly opted in. Denied on hosted/production deploys.
export function localFsAllowed(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.LAUNCHKIT_ALLOW_LOCAL_FS === 'true'
}

export function getRuntimeConfig(): RuntimeConfig {
  const provider: GenerationProviderId = process.env.GENERATION_PROVIDER === 'openrouter' ? 'openrouter' : 'mock'
  return {
    provider,
    hasKey: Boolean(process.env.OPENROUTER_API_KEY?.trim()),
    model: process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL,
    localFsAvailable: localFsAllowed(),
  }
}

// Whether generation can succeed from configuration alone (mock always works; openrouter needs a key).
export function canGenerate(config: RuntimeConfig): boolean {
  return config.provider === 'mock' || config.hasKey
}
