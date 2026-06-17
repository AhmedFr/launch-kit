import type { z } from 'zod'
import type { GenerateInput, LaunchCore, PlatformContent } from '@/lib/types'
import type { PlatformId } from '@/lib/platforms'
import type { GenerationProvider } from './provider.types'
import { launchCoreSchema } from './core/core.schema'
import { buildCorePrompt, CORE_SYSTEM_PROMPT } from './core/core.prompt'
import { PLATFORM_GENERATORS } from './platforms/registry'
import { extractJsonObject } from './json'
import { DEFAULT_MODEL } from './model'
import { describeOpenRouterError } from './openrouter-errors'

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

export class OpenRouterProvider implements GenerationProvider {
  constructor(
    private apiKey = process.env.OPENROUTER_API_KEY ?? '',
    private model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL,
  ) {}

  async generateCore(input: GenerateInput): Promise<LaunchCore> {
    return this.call(CORE_SYSTEM_PROMPT, buildCorePrompt(input), launchCoreSchema)
  }

  async generatePlatform(platform: PlatformId, core: LaunchCore, input: GenerateInput): Promise<PlatformContent> {
    const gen = PLATFORM_GENERATORS[platform]
    return this.call(gen.system, gen.buildPrompt(core, input), gen.schema)
  }

  private async call<T>(system: string, user: string, schema: z.ZodType<T>): Promise<T> {
    if (!this.apiKey) throw new Error('OPENROUTER_API_KEY is not set.')

    let res: Response
    try {
      res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        }),
      })
    } catch (err) {
      throw new Error(`Could not reach OpenRouter: ${err instanceof Error ? err.message : 'network error'}`)
    }

    if (!res.ok) {
      throw new Error(describeOpenRouterError(res.status, await res.text().catch(() => '')))
    }

    const data = await res.json()
    const content: string | undefined = data?.choices?.[0]?.message?.content
    if (!content) throw new Error(`Model "${this.model}" returned an empty response.`)

    let parsed: unknown
    try {
      parsed = JSON.parse(extractJsonObject(content))
    } catch (err) {
      throw new Error(`Model "${this.model}" did not return valid JSON: ${err instanceof Error ? err.message : 'parse error'}`)
    }

    const result = schema.safeParse(parsed)
    if (!result.success) {
      const fields = result.error.issues.slice(0, 4).map((i) => i.path.join('.') || '(root)').join(', ')
      throw new Error(`Model output didn't match the expected shape (problem fields: ${fields}). Try regenerating.`)
    }
    return result.data
  }
}
