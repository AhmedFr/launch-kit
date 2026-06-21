import type { LaunchPlan as LaunchPlanData } from '@/lib/types'

export type LaunchPlanProps = {
  plan: LaunchPlanData
  onCopy: () => void
  onExport: () => void
}
