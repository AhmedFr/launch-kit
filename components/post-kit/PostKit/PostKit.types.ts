import type { Generation } from '@/lib/types'
import type { PlatformId } from '@/lib/platforms'

export type PostKitProps = {
  generation: Generation
  productName: string
  onExportMarkdown: (platform: PlatformId) => void
  onCopyPlan: () => void
  onExportPlan: () => void
  onEditField: (platform: PlatformId, path: (string | number)[], value: string) => void
  onStartOver: () => void
}
