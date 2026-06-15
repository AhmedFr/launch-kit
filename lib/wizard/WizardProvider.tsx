'use client'
import { createContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { wizardReducer, initialState, type WizardState, type WizardAction } from './wizard-reducer'

const KEY = 'ph-launch-kit'

export const WizardContext = createContext<{ state: WizardState; dispatch: Dispatch<WizardAction> } | null>(null)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState, (init) => {
    if (typeof window === 'undefined') return init
    try {
      const saved = window.localStorage.getItem(KEY)
      return saved ? { ...init, ...JSON.parse(saved) } : init
    } catch {
      return init
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ context: state.context, refinements: state.refinements, kit: state.kit, step: state.step }))
    } catch {
      // ignore quota / serialization errors
    }
  }, [state.context, state.refinements, state.kit, state.step])

  return <WizardContext.Provider value={{ state, dispatch }}>{children}</WizardContext.Provider>
}
