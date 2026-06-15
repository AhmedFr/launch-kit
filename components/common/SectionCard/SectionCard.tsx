import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SectionCardProps } from './SectionCard.types'

export function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <Card className="reveal reveal-1 border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 border-b border-border/60 pb-4">
        <CardTitle className="font-display text-lg font-semibold tracking-tight">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="space-y-4 pt-5 text-sm leading-relaxed">{children}</CardContent>
    </Card>
  )
}
