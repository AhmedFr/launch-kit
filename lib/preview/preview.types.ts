import type { LaunchKit } from '@/lib/types'

// The contract every platform preview implements. A preview takes the same
// generated kit and renders it the way that platform's post actually looks.
export type PreviewProps = { kit: LaunchKit; productName: string }
