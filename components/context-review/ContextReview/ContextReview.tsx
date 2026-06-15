'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { ContextReviewProps } from './ContextReview.types'

export function ContextReview({
  context,
  refinements,
  onContextChange,
  onRefinementsChange,
  onGenerate,
  generating,
}: ContextReviewProps) {
  const set = (patch: Partial<typeof context>) => onContextChange({ ...context, ...patch })
  const setRef = (patch: Partial<typeof refinements>) => onRefinementsChange({ ...refinements, ...patch })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {context.warnings.map((w) => (
        <p key={w} className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{w}</p>
      ))}

      <section className="space-y-3">
        <h2 className="font-semibold">What we found</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Product name</Label>
          <Input id="name" value={context.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea id="summary" rows={3} value={context.summary} onChange={(e) => set({ summary: e.target.value })} />
        </div>
        {context.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {context.techStack.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">
          Launch intent <span className="font-normal text-muted-foreground">(sharpens the output)</span>
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="audience">Audience</Label>
            <Input id="audience" value={refinements.audience ?? ''} placeholder="e.g. indie developers" onChange={(e) => setRef({ audience: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="angle">Angle</Label>
            <Input id="angle" value={refinements.angle ?? ''} placeholder="the one big hook" onChange={(e) => setRef({ angle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Goal</Label>
            <Input id="goal" value={refinements.goal ?? ''} placeholder="signups / feedback / stars" onChange={(e) => setRef({ goal: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Input id="tone" value={refinements.tone ?? ''} placeholder="bold, friendly, technical…" onChange={(e) => setRef({ tone: e.target.value })} />
          </div>
        </div>
      </section>

      <Button onClick={onGenerate} disabled={generating} className="w-full">
        {generating ? 'Generating your kit…' : 'Generate Post Kit'}
      </Button>
    </div>
  )
}
