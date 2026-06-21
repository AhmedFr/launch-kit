import type { LaunchCore, PlatformContent } from '@/lib/types'

// Commits an inline edit of one prose field. `path` is relative to the active
// platform's content object (e.g. ['copy','tagline'], ['thread','tweets',2]).
export type EditFieldFn = (path: (string | number)[], value: string) => void

// Every platform's edit-view section group takes the shared core plus its own
// content (narrowed internally), a loading flag, and an optional inline-edit hook.
export type PlatformSectionsProps = {
  core: LaunchCore
  content: PlatformContent
  loading?: boolean
  onEdit?: EditFieldFn
}
