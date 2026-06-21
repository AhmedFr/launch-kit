import type { PlatformId } from '@/lib/platforms'

export type PlatformLogoProps = {
  id: PlatformId
  /** Tailwind size utility (width + height). Defaults to `size-5`. */
  className?: string
}
