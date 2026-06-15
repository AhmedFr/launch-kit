import { SectionCard } from '@/components/common/SectionCard'
import { RegenerateButton } from '@/components/common/RegenerateButton'
import type { VideoSectionProps } from './VideoSection.types'

export function VideoSection({ kit, onRegenerate, regenerating }: VideoSectionProps) {
  const { video } = kit
  return (
    <SectionCard
      title="Demo video storyboard"
      action={<RegenerateButton onClick={onRegenerate} regenerating={regenerating} />}
    >
      <p><span className="font-medium">Hook:</span> {video.hook}</p>
      <p className="text-muted-foreground">Length ~{video.lengthSec}s · CTA: {video.cta}</p>
      <ol className="relative space-y-3 border-l border-border pl-5">
        {video.scenes.map((s, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[1.4rem] top-1 size-2 rounded-full bg-primary ring-4 ring-background" />
            <div className="font-mono text-xs font-medium text-primary">{s.timeRange}</div>
            <div>{s.visual}</div>
            <div className="text-muted-foreground"><span className="text-foreground/70">On-screen:</span> {s.onScreenText}</div>
          </li>
        ))}
      </ol>
    </SectionCard>
  )
}
