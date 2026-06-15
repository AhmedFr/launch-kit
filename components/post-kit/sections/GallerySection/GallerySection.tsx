import { SectionCard } from '@/components/common/SectionCard'
import { RegenerateButton } from '@/components/common/RegenerateButton'
import type { GallerySectionProps } from './GallerySection.types'

export function GallerySection({ kit, onRegenerate, regenerating }: GallerySectionProps) {
  return (
    <SectionCard
      title="Gallery shot list"
      action={<RegenerateButton onClick={onRegenerate} regenerating={regenerating} />}
      loading={regenerating}
    >
      <ol className="space-y-3">
        {kit.gallery.shots.map((s, i) => (
          <li key={i} className="flex gap-3 rounded-xl border border-border bg-muted/30 p-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
              {i + 1}
            </span>
            <div className="space-y-0.5">
              <div className="font-medium">
                {s.title} <span className="font-normal text-muted-foreground">— {s.purpose}</span>
              </div>
              <div className="text-muted-foreground"><span className="text-foreground/70">Caption:</span> {s.caption}</div>
              <div className="text-muted-foreground"><span className="text-foreground/70">Layout:</span> {s.layoutHint}</div>
            </div>
          </li>
        ))}
      </ol>
    </SectionCard>
  )
}
