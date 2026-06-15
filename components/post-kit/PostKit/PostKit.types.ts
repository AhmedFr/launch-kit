import type { LaunchKit, SectionKey } from '@/lib/types'

export type PostKitProps = {
  kit: LaunchKit
  onRegenerateSection: (section: SectionKey) => void
  regeneratingSection: SectionKey | null
  onExportMarkdown: () => void
  onCopyAll: () => void
  onStartOver: () => void
}
