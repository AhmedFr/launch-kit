import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import type { GallerySectionProps } from './GallerySection.types'

export function GallerySection({ kit, onRegenerate, regenerating }: GallerySectionProps) {
  return (
    <SectionCard
      title="Gallery shot list"
      action={<Button variant="ghost" size="sm" onClick={onRegenerate} disabled={regenerating}>Regenerate</Button>}
    >
      <ol className="space-y-3">
        {kit.gallery.shots.map((s, i) => (
          <li key={i} className="rounded-md border p-3">
            <div className="font-medium">
              {i + 1}. {s.title} <span className="font-normal text-muted-foreground">— {s.purpose}</span>
            </div>
            <div className="text-muted-foreground">Caption: {s.caption}</div>
            <div className="text-muted-foreground">Layout: {s.layoutHint}</div>
          </li>
        ))}
      </ol>
    </SectionCard>
  )
}
