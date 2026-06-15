import type { WizardStepperProps } from './WizardStepper.types'

const STEPS = [
  { key: 'folder', label: 'Folder' },
  { key: 'review', label: 'Review context' },
  { key: 'kit', label: 'Post Kit' },
] as const

export function WizardStepper({ current }: WizardStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === current)

  return (
    <ol className="mx-auto flex max-w-md items-center justify-center gap-1 px-4 py-2">
      {STEPS.map((s, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'todo'
        return (
          <li key={s.key} className="flex items-center gap-1">
            <div className="flex items-center gap-2">
              <span
                className={[
                  'flex size-6 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-colors',
                  state === 'active' && 'bg-primary text-primary-foreground shadow-sm shadow-primary/30',
                  state === 'done' && 'bg-primary/15 text-primary',
                  state === 'todo' && 'bg-muted text-muted-foreground',
                ].filter(Boolean).join(' ')}
              >
                {state === 'done' ? '✓' : i + 1}
              </span>
              <span
                className={[
                  'text-sm transition-colors',
                  state === 'active' ? 'font-medium text-foreground' : 'text-muted-foreground',
                ].join(' ')}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={[
                  'mx-1 h-px w-6 rounded-full transition-colors',
                  i < currentIndex ? 'bg-primary/40' : 'bg-border',
                ].join(' ')}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
