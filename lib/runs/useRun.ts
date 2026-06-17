'use client'
import { useEffect, useReducer, useRef, useState, type Dispatch } from 'react'
import { wizardReducer, initialState, type WizardAction, type WizardState } from '@/lib/wizard/wizard-reducer'
import { getRun, saveRun } from './store'

type RunStatus = 'loading' | 'ready' | 'not-found'

// Loads one run by id into the wizard reducer and persists user edits back to the
// store. Mount this keyed by id (see the [id] page) so each run gets a fresh reducer
// and there's no chance of writing one run's state under another run's id.
export function useRun(id: string): { state: WizardState; dispatch: Dispatch<WizardAction>; status: RunStatus } {
  const [state, dispatch] = useReducer(wizardReducer, initialState)
  const [status, setStatus] = useState<RunStatus>('loading')
  // The write that immediately follows hydration carries no user edit — skip it so
  // merely opening a run doesn't bump updatedAt (which would reorder the dashboard).
  const skipPersist = useRef(true)

  /* eslint-disable react-hooks/set-state-in-effect -- SSR-safe: hydrate from localStorage only after mount */
  useEffect(() => {
    const run = getRun(id)
    if (!run) {
      setStatus('not-found')
      return
    }
    skipPersist.current = true
    dispatch({
      type: 'HYDRATE',
      state: { step: run.step, path: run.path, context: run.context, refinements: run.refinements, generation: run.generation },
    })
    setStatus('ready')
  }, [id])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (status !== 'ready') return
    if (skipPersist.current) {
      skipPersist.current = false
      return
    }
    saveRun({
      id,
      path: state.path,
      step: state.step,
      context: state.context,
      refinements: state.refinements,
      generation: state.generation,
      createdAt: 0, // preserved from the stored run by saveRun
      updatedAt: 0,
    })
  }, [status, state, id])

  return { state, dispatch, status }
}
