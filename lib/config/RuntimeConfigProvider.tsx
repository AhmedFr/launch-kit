'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { RuntimeConfig } from './runtime-config'

const RuntimeConfigContext = createContext<RuntimeConfig | null>(null)

// Seeded by the server layout with values read from env once — no client fetch.
export function RuntimeConfigProvider({ value, children }: { value: RuntimeConfig; children: ReactNode }) {
  return <RuntimeConfigContext.Provider value={value}>{children}</RuntimeConfigContext.Provider>
}

export function useRuntimeConfig(): RuntimeConfig {
  const ctx = useContext(RuntimeConfigContext)
  if (!ctx) throw new Error('useRuntimeConfig must be used within RuntimeConfigProvider')
  return ctx
}
