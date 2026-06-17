'use client'
import { useState } from 'react'
import { useRuntimeConfig } from '@/lib/config/RuntimeConfigProvider'

type Tone = 'neutral' | 'brand' | 'good' | 'warn' | 'bad'
type BadgeDef = { key: string; label: string; tone: Tone; title: string }

const TONE: Record<Tone, string> = {
  neutral: 'border-border bg-card text-muted-foreground',
  brand: 'border-primary/30 bg-primary/10 text-primary',
  good: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
  warn: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
  bad: 'border-destructive/30 bg-destructive/10 text-destructive',
}

const DOT: Record<Tone, string> = {
  neutral: 'bg-muted-foreground',
  brand: 'bg-primary',
  good: 'bg-emerald-600',
  warn: 'bg-amber-600',
  bad: 'bg-destructive',
}

function shortModel(model: string): string {
  return (model.split('/').pop() ?? model).replace(/^claude-/, '')
}

function StatusBadge({ label, tone, title }: { label: string; tone: Tone; title: string }) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${TONE[tone]}`}
    >
      {label}
    </span>
  )
}

export function GenerationStatus() {
  const config = useRuntimeConfig()
  const [open, setOpen] = useState(false)

  const badges: BadgeDef[] = []
  if (config.provider === 'openrouter') {
    badges.push({ key: 'provider', label: 'OpenRouter', tone: 'brand', title: 'Generating with OpenRouter' })
    badges.push(
      config.hasKey
        ? { key: 'key', label: '✓ Key', tone: 'good', title: 'OPENROUTER_API_KEY is set' }
        : { key: 'key', label: '✗ No key', tone: 'bad', title: 'Add OPENROUTER_API_KEY to your .env to generate' },
    )
    badges.push({ key: 'model', label: shortModel(config.model), tone: 'neutral', title: `Model: ${config.model}` })
  } else {
    badges.push({ key: 'provider', label: 'Mock', tone: 'neutral', title: 'Using the built-in mock generator — no API key needed' })
  }
  badges.push(
    config.localFsAvailable
      ? { key: 'fs', label: 'FS on', tone: 'neutral', title: 'Local folder analysis is available' }
      : { key: 'fs', label: 'FS off', tone: 'warn', title: 'Folder analysis is disabled on hosted/production builds' },
  )

  const summary: { label: string; tone: Tone } = badges.some((b) => b.tone === 'bad')
    ? { label: 'Needs key', tone: 'bad' }
    : badges.some((b) => b.tone === 'warn')
      ? { label: 'FS off', tone: 'warn' }
      : { label: 'Ready', tone: 'good' }

  return (
    <>
      {/* Desktop: full badge row */}
      <div className="hidden items-center gap-1.5 sm:flex">
        {badges.map((b) => (
          <StatusBadge key={b.key} label={b.label} tone={b.tone} title={b.title} />
        ))}
      </div>

      {/* Mobile: a summary chip that opens a popover with the full set */}
      <div className="relative sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Generation status"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground"
        >
          <span className={`size-1.5 rounded-full ${DOT[summary.tone]}`} />
          {summary.label}
          <span aria-hidden>▾</span>
        </button>
        {open && (
          <>
            <button
              type="button"
              aria-hidden
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-30 cursor-default"
            />
            <div className="absolute right-0 z-40 mt-2 flex w-max flex-col items-start gap-1.5 rounded-xl border border-border bg-card p-2.5 shadow-lg">
              {badges.map((b) => (
                <StatusBadge key={b.key} label={b.label} tone={b.tone} title={b.title} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
