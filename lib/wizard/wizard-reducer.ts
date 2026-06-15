import type { ProjectContext, Refinements, LaunchKit } from '@/lib/types'

export type WizardStep = 'folder' | 'review' | 'kit'

export type WizardState = {
  step: WizardStep
  path: string
  context: ProjectContext | null
  refinements: Refinements
  kit: LaunchKit | null
}

export type WizardAction =
  | { type: 'SET_PATH'; path: string }
  | { type: 'ANALYZED'; context: ProjectContext }
  | { type: 'EDIT_CONTEXT'; context: ProjectContext }
  | { type: 'EDIT_REFINEMENTS'; refinements: Refinements }
  | { type: 'GENERATED'; kit: LaunchKit }
  | { type: 'PATCH_KIT'; patch: Partial<LaunchKit> }
  | { type: 'GO'; step: WizardStep }
  | { type: 'RESET' }

export const initialState: WizardState = {
  step: 'folder', path: '', context: null, refinements: {}, kit: null,
}

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_PATH': return { ...state, path: action.path }
    case 'ANALYZED': return { ...state, context: action.context, step: 'review' }
    case 'EDIT_CONTEXT': return { ...state, context: action.context }
    case 'EDIT_REFINEMENTS': return { ...state, refinements: action.refinements }
    case 'GENERATED': return { ...state, kit: action.kit, step: 'kit' }
    case 'PATCH_KIT': return state.kit ? { ...state, kit: { ...state.kit, ...action.patch } } : state
    case 'GO': return { ...state, step: action.step }
    case 'RESET': return initialState
    default: return state
  }
}
