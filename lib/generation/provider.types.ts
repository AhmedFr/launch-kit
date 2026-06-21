import type { GenerateInput, LaunchCore, LaunchPlan, PlatformContent } from '@/lib/types'
import type { PlatformId } from '@/lib/platforms'

export interface GenerationProvider {
  // Distill the platform-neutral core once.
  generateCore(input: GenerateInput): Promise<LaunchCore>
  // Write one platform's native content from the shared core.
  generatePlatform(platform: PlatformId, core: LaunchCore, input: GenerateInput): Promise<PlatformContent>
  // Build the cross-platform launch plan from the shared core.
  generatePlan(core: LaunchCore, input: GenerateInput): Promise<LaunchPlan>
}
