import type { Run } from '@/lib/runs/runs.types'

export type RunCardProps = { run: Run; onDelete: (id: string) => void }
