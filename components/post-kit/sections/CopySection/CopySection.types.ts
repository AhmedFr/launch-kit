import type { LaunchKit } from '@/lib/types'
import type { EditFieldFn } from '@/components/post-kit/platforms/platform-sections.types'

export type CopySectionProps = { kit: LaunchKit; loading?: boolean; onEdit?: EditFieldFn }
