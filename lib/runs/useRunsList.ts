'use client'
import { useCallback, useEffect, useState } from 'react'
import { listRuns, deleteRun } from './store'
import type { Run } from './runs.types'

// Reactive view of the runs list for the dashboard. localStorage is read after
// mount (so SSR and first client render match), and `remove` refreshes in place.
export function useRunsList(): { runs: Run[]; loaded: boolean; refresh: () => void; remove: (id: string) => void } {
  const [runs, setRuns] = useState<Run[]>([])
  const [loaded, setLoaded] = useState(false)

  const refresh = useCallback(() => {
    setRuns(listRuns())
    setLoaded(true)
  }, [])

  useEffect(() => {
    // SSR-safe: read localStorage only after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh()
  }, [refresh])

  const remove = useCallback(
    (id: string) => {
      deleteRun(id)
      refresh()
    },
    [refresh],
  )

  return { runs, loaded, refresh, remove }
}
