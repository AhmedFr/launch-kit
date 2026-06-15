import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SectionCardProps } from './SectionCard.types'

export function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="space-y-3 text-sm">{children}</CardContent>
    </Card>
  )
}
