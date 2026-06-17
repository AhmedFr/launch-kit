import type { LaunchCore, PlatformContent } from '@/lib/types'

// Every platform's edit-view section group takes the shared core plus its own
// content (narrowed internally) and a loading flag for the regenerate shimmer.
export type PlatformSectionsProps = { core: LaunchCore; content: PlatformContent; loading?: boolean }
