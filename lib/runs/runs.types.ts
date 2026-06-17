import type { ProjectContext, Refinements, Generation } from '@/lib/types'
import type { WizardStep } from '@/lib/wizard/wizard-reducer'

// A single launch run, keyed by folder path (one run per folder). Persisted to
// localStorage — the wizard slice (step/context/refinements/generation) plus metadata.
export type Run = {
  id: string
  path: string
  step: WizardStep
  context: ProjectContext | null
  refinements: Refinements
  generation: Generation | null
  createdAt: number
  updatedAt: number
}
