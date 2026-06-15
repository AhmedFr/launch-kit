import type { LaunchKit, SectionKey } from '@/lib/types'

export type PostKitProps = {
  kit: LaunchKit
  productName: string
  onRegenerateSection: (section: SectionKey) => void
  regeneratingSection: SectionKey | null
  onExportMarkdown: () => void
  onCopyAll: () => void
  onStartOver: () => void
}
