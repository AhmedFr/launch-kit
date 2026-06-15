import type { GenerateInput, LaunchKit, SectionKey } from '@/lib/types'
import type { GenerationProvider } from './provider.types'
import { launchKitSchema } from './schema'
import { buildKitPrompt, SYSTEM_PROMPT } from './prompt'
import { extractJsonObject } from './json'

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL = 'anthropic/claude-sonnet-4.6'

// Which LaunchKit fields each section owns (for single-section regeneration).
const SECTION_FIELDS: Record<SectionKey, (keyof LaunchKit)[]> = {
  copy: ['copy'],
  topicsComment: ['topics', 'firstComment'],
  gallery: ['gallery'],
  video: ['video'],
  launch: ['launch'],
}

function upstreamMessage(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body)
    const msg = parsed?.error?.message ?? parsed?.message
    if (msg) return `OpenRouter ${status}: ${msg}`
  } catch {
    // body wasn't JSON
  }
  return `OpenRouter ${status}: ${body.slice(0, 200) || 'request failed'}`
}

export class OpenRouterProvider implements GenerationProvider {
  constructor(
    private apiKey = process.env.OPENROUTER_API_KEY ?? '',
    private model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL,
  ) {}

  async generateKit(input: GenerateInput): Promise<LaunchKit> {
    return this.callModel(input)
  }

  async generateSection(section: SectionKey, input: GenerateInput): Promise<Partial<LaunchKit>> {
    const kit = await this.callModel(input)
    const patch: Partial<LaunchKit> = {}
    for (const field of SECTION_FIELDS[section]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(patch as any)[field] = kit[field]
    }
    return patch
  }

  private async callModel(input: GenerateInput): Promise<LaunchKit> {
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
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: buildKitPrompt(input) },
          ],
        }),
      })
    } catch (err) {
      throw new Error(`Could not reach OpenRouter: ${err instanceof Error ? err.message : 'network error'}`)
    }

    if (!res.ok) {
      throw new Error(upstreamMessage(res.status, await res.text().catch(() => '')))
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

    const result = launchKitSchema.safeParse(parsed)
    if (!result.success) {
      const fields = result.error.issues.slice(0, 4).map((i) => i.path.join('.') || '(root)').join(', ')
      throw new Error(`Model output didn't match the expected shape (problem fields: ${fields}). Try regenerating.`)
    }
    return result.data
  }
}
