'use client'
import { createContext, useEffect, useReducer, useState, type Dispatch, type ReactNode } from 'react'
import { wizardReducer, initialState, type WizardState, type WizardAction } from './wizard-reducer'

const KEY = 'ph-launch-kit'

export const WizardContext = createContext<{ state: WizardState; dispatch: Dispatch<WizardAction> } | null>(null)

export function WizardProvider({ children }: { children: ReactNode }) {
  // Always start from initialState so the server render and the first client
  // render match. We restore any saved state in an effect, after mount.
  const [state, dispatch] = useReducer(wizardReducer, initialState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY)
      if (saved) dispatch({ type: 'HYDRATE', state: { ...initialState, ...JSON.parse(saved) } })
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    // Don't persist until we've hydrated, or we'd clobber saved state with initialState.
    if (!hydrated) return
    try {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({ context: state.context, refinements: state.refinements, kit: state.kit, step: state.step }),
      )
    } catch {
      // ignore quota / serialization errors
    }
  }, [hydrated, state.context, state.refinements, state.kit, state.step])

  return <WizardContext.Provider value={{ state, dispatch }}>{children}</WizardContext.Provider>
}
