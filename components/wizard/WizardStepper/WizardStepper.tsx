import type { WizardStepperProps } from './WizardStepper.types'

const STEPS = [
  { key: 'folder', label: 'Folder' },
  { key: 'review', label: 'Review context' },
  { key: 'kit', label: 'Post Kit' },
] as const

export function WizardStepper({ current }: WizardStepperProps) {
  return (
    <ol className="mx-auto flex max-w-md items-center justify-center gap-2 py-4 text-sm">
      {STEPS.map((s, i) => {
        const active = s.key === current
        return (
          <li key={s.key} className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {i + 1}
            </span>
            <span className={active ? 'font-medium' : 'text-muted-foreground'}>{s.label}</span>
            {i < STEPS.length - 1 && <span className="text-muted-foreground">·</span>}
          </li>
        )
      })}
    </ol>
  )
}
