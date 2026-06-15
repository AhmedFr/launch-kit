import type { ReactNode } from 'react'

export type SectionCardProps = {
  title: string
  action?: ReactNode
  loading?: boolean
  children: ReactNode
}
