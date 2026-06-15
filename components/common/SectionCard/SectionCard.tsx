import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SectionCardProps } from './SectionCard.types'

export function SectionCard({ title, action, loading = false, children }: SectionCardProps) {
  return (
    <Card className="reveal reveal-1 relative overflow-hidden border-border shadow-sm">
      {loading && (
        <span className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden">
          <span className="block h-full w-1/4 rounded-full bg-primary [animation:loading-slide_1.1s_ease-in-out_infinite]" />
        </span>
      )}
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 border-b border-border/60 pb-4">
        <CardTitle className="font-display text-lg font-semibold tracking-tight">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent
        className={`space-y-4 pt-5 text-sm leading-relaxed transition-opacity ${loading ? 'pointer-events-none opacity-45' : ''}`}
      >
        {children}
      </CardContent>
    </Card>
  )
}
