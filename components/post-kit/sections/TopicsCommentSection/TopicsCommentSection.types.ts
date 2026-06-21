import type { LaunchKit } from '@/lib/types'
import type { EditFieldFn } from '@/components/post-kit/platforms/platform-sections.types'

export type TopicsCommentSectionProps = { kit: LaunchKit; loading?: boolean; onEdit?: EditFieldFn }
