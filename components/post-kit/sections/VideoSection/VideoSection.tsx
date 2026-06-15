import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import type { VideoSectionProps } from './VideoSection.types'

export function VideoSection({ kit, onRegenerate, regenerating }: VideoSectionProps) {
  const { video } = kit
  return (
    <SectionCard
      title="Demo video storyboard"
      action={<Button variant="ghost" size="sm" onClick={onRegenerate} disabled={regenerating}>Regenerate</Button>}
    >
      <p><span className="font-medium">Hook:</span> {video.hook}</p>
      <p className="text-muted-foreground">Length ~{video.lengthSec}s · CTA: {video.cta}</p>
      <ol className="space-y-2">
        {video.scenes.map((s, i) => (
          <li key={i} className="rounded-md border p-2">
            <span className="font-mono text-xs text-primary">{s.timeRange}</span> — {s.visual}
            <div className="text-muted-foreground">On-screen: {s.onScreenText}</div>
          </li>
        ))}
      </ol>
    </SectionCard>
  )
}
