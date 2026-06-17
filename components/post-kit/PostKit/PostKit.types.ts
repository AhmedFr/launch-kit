import type { Generation } from '@/lib/types'
import type { PlatformId } from '@/lib/platforms'

export type PostKitProps = {
  generation: Generation
  productName: string
  onRegeneratePlatform: (platform: PlatformId) => void
  regeneratingPlatform: PlatformId | null
  onExportMarkdown: (platform: PlatformId) => void
  onCopyAll: (platform: PlatformId) => void
  onStartOver: () => void
}
