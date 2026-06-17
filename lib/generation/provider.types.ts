import type { GenerateInput, LaunchCore, PlatformContent } from '@/lib/types'
import type { PlatformId } from '@/lib/platforms'

export interface GenerationProvider {
  // Distill the platform-neutral core once.
  generateCore(input: GenerateInput): Promise<LaunchCore>
  // Write one platform's native content from the shared core.
  generatePlatform(platform: PlatformId, core: LaunchCore, input: GenerateInput): Promise<PlatformContent>
}
