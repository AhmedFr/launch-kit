import type { ProjectContext } from '@/lib/types'
import type { Run } from './runs.types'

const RUNS_KEY = 'launch-kit:runs'
const LEGACY_KEY = 'ph-launch-kit'

function genId(): string {
  return crypto.randomUUID().split('-')[0]
}

// Normalize a folder path so `/x`, `/x/`, and `  /x ` are treated as one run.
// (Case is left intact — paths are case-sensitive on Linux.)
function normalizePath(path: string): string {
  const trimmed = path.trim()
  return trimmed.length > 1 ? trimmed.replace(/\/+$/, '') : trimmed
}

function writeAll(runs: Record<string, Run>): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(RUNS_KEY, JSON.stringify(runs))
  } catch {
    // ignore quota / serialization errors
  }
}

// Fold the old single-run localStorage entry into the runs store, once.
function migrateLegacy(): Record<string, Run> {
  const legacy = localStorage.getItem(LEGACY_KEY)
  if (!legacy) return {}
  let store: Record<string, Run> = {}
  try {
    const s = JSON.parse(legacy)
    if (s && (s.context || s.generation)) {
      const now = Date.now()
      const run: Run = {
        id: genId(),
        path: '',
        step: s.step ?? (s.generation ? 'kit' : s.context ? 'review' : 'folder'),
        context: s.context ?? null,
        refinements: s.refinements ?? {},
        generation: s.generation ?? null,
        createdAt: now,
        updatedAt: now,
      }
      store = { [run.id]: run }
      writeAll(store)
    }
  } catch {
    // corrupt legacy entry — drop it
  }
  localStorage.removeItem(LEGACY_KEY)
  return store
}

function readAll(): Record<string, Run> {
  if (typeof window === 'undefined') return {}
  const raw = localStorage.getItem(RUNS_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as Record<string, Run>
    } catch {
      return {}
    }
  }
  // No runs store yet — attempt a one-time migration of the legacy single run.
  return migrateLegacy()
}

export function listRuns(): Run[] {
  return Object.values(readAll()).sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getRun(id: string): Run | null {
  return readAll()[id] ?? null
}

export function findByPath(path: string): Run | null {
  const target = normalizePath(path)
  if (!target) return null
  return Object.values(readAll()).find((r) => r.path === target) ?? null
}

export function createRun(path: string, context: ProjectContext | null = null): Run {
  const now = Date.now()
  const run: Run = {
    id: genId(),
    path: normalizePath(path),
    step: context ? 'review' : 'folder',
    context,
    refinements: {},
    generation: null,
    createdAt: now,
    updatedAt: now,
  }
  const runs = readAll()
  runs[run.id] = run
  writeAll(runs)
  return run
}

// Upsert a run, preserving createdAt and bumping updatedAt.
export function saveRun(run: Run): Run {
  const runs = readAll()
  const existing = runs[run.id]
  const saved: Run = {
    ...run,
    createdAt: existing?.createdAt || run.createdAt || Date.now(),
    updatedAt: Date.now(),
  }
  runs[run.id] = saved
  writeAll(runs)
  return saved
}

export function deleteRun(id: string): void {
  const runs = readAll()
  delete runs[id]
  writeAll(runs)
}
