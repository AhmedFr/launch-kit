import type { GenerateInput, LaunchKit, SectionKey } from '@/lib/types'
import type { GenerationProvider } from './provider.types'
import { launchKitSchema } from './schema'
import { buildKitPrompt } from './prompt'

// Wired in later. Requires OPENROUTER_API_KEY and GENERATION_PROVIDER=openrouter.
export class OpenRouterProvider implements GenerationProvider {
  constructor(
    private apiKey = process.env.OPENROUTER_API_KEY ?? '',
    private model = process.env.OPENROUTER_MODEL ?? 'anthropic/claude-3.5-sonnet',
  ) {}

  async generateKit(input: GenerateInput): Promise<LaunchKit> {
    if (!this.apiKey) throw new Error('OPENROUTER_API_KEY is not set.')
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: buildKitPrompt(input) }],
      }),
    })
    if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`)
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content ?? '{}'
    return launchKitSchema.parse(JSON.parse(content))
  }

  async generateSection(_section: SectionKey, input: GenerateInput): Promise<Partial<LaunchKit>> {
    // For now, regenerate the whole kit and let the caller pick the section.
    return this.generateKit(input)
  }
}
