import type { LaunchCore, PlatformContent } from '@/lib/types'

// The contract every platform preview implements. A preview takes the shared core
// plus that platform's own content and renders it the way the platform's post looks.
// Each component narrows `content` to its specific platform type internally.
export type PreviewProps = { core: LaunchCore; content: PlatformContent; productName: string }
