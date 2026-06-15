import type { GenerateInput, LaunchKit, SectionKey } from '@/lib/types'

export interface GenerationProvider {
  generateKit(input: GenerateInput): Promise<LaunchKit>
  generateSection(section: SectionKey, input: GenerateInput): Promise<Partial<LaunchKit>>
}
