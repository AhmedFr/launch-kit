import type { ProjectContext, Refinements } from '@/lib/types'

export type ContextReviewProps = {
  context: ProjectContext
  refinements: Refinements
  onContextChange: (context: ProjectContext) => void
  onRefinementsChange: (refinements: Refinements) => void
  onGenerate: () => void
  generating: boolean
}
