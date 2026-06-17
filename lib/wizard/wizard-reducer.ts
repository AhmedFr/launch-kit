import type { ProjectContext, Refinements, Generation, PlatformContent } from '@/lib/types'
import type { PlatformId } from '@/lib/platforms'

export type WizardStep = 'folder' | 'review' | 'kit'

export type WizardState = {
  step: WizardStep
  path: string
  context: ProjectContext | null
  refinements: Refinements
  generation: Generation | null
}

export type WizardAction =
  | { type: 'SET_PATH'; path: string }
  | { type: 'ANALYZED'; context: ProjectContext }
  | { type: 'EDIT_CONTEXT'; context: ProjectContext }
  | { type: 'EDIT_REFINEMENTS'; refinements: Refinements }
  | { type: 'GENERATED'; generation: Generation }
  | { type: 'REGEN_PLATFORM'; platform: PlatformId; content: PlatformContent }
  | { type: 'GO'; step: WizardStep }
  | { type: 'HYDRATE'; state: WizardState }
  | { type: 'RESET' }

export const initialState: WizardState = {
  step: 'folder', path: '', context: null, refinements: {}, generation: null,
}

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_PATH': return { ...state, path: action.path }
    case 'ANALYZED': return { ...state, context: action.context, generation: null, step: 'review' }
    case 'EDIT_CONTEXT': return { ...state, context: action.context }
    case 'EDIT_REFINEMENTS': return { ...state, refinements: action.refinements }
    case 'GENERATED': return { ...state, generation: action.generation, step: 'kit' }
    case 'REGEN_PLATFORM':
      return state.generation
        ? {
            ...state,
            generation: {
              ...state.generation,
              platforms: { ...state.generation.platforms, [action.platform]: action.content },
            },
          }
        : state
    case 'GO': return { ...state, step: action.step }
    case 'HYDRATE': return action.state
    case 'RESET': return initialState
    default: return state
  }
}
