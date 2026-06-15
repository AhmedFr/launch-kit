import type { ProjectContext } from '@/lib/types'

export type FolderSelectProps = {
  path: string
  onPathChange: (path: string) => void
  onAnalyzed: (context: ProjectContext) => void
}
