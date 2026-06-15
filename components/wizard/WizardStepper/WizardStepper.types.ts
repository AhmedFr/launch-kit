import type { WizardStep } from '@/lib/wizard/wizard-reducer'

export type WizardStepperProps = {
  current: WizardStep
  /** Steps the user is allowed to jump to (have the data they need). */
  reachable: WizardStep[]
  onStep: (step: WizardStep) => void
}
