'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { ContextReviewProps } from './ContextReview.types'

const REFINEMENTS = [
  { key: 'audience', label: 'Audience', placeholder: 'e.g. indie developers' },
  { key: 'angle', label: 'Angle', placeholder: 'the one big hook' },
  { key: 'goal', label: 'Goal', placeholder: 'signups / feedback / stars' },
  { key: 'tone', label: 'Tone', placeholder: 'bold, friendly, technical…' },
] as const

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
    <div className="mx-auto max-w-2xl space-y-6 px-6">
      <div className="reveal reveal-1 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight">Does this look right?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tweak what we found and add a little intent — it sharpens every section.
        </p>
      </div>

      {context.warnings.map((w) => (
        <p
          key={w}
          className="reveal reveal-1 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <span aria-hidden className="mt-px">⚠️</span>
          <span>{w}</span>
        </p>
      ))}

      <section className="reveal reveal-2 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What we found</h3>
        <div className="space-y-2">
          <Label htmlFor="name">Product name</Label>
          <Input id="name" value={context.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea id="summary" rows={3} value={context.summary} onChange={(e) => set({ summary: e.target.value })} />
        </div>
        {context.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {context.techStack.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
          </div>
        )}
      </section>

      <section className="reveal reveal-3 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Launch intent</h3>
          <p className="mt-1 text-xs text-muted-foreground">Optional, but it makes the copy noticeably better.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {REFINEMENTS.map((f) => (
            <div key={f.key} className="space-y-2">
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input
                id={f.key}
                value={refinements[f.key] ?? ''}
                placeholder={f.placeholder}
                onChange={(e) => setRef({ [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </section>

      <Button onClick={onGenerate} disabled={generating} size="lg" className="reveal reveal-4 w-full">
        {generating ? 'Generating your kit…' : 'Generate Post Kit →'}
      </Button>
    </div>
  )
}
