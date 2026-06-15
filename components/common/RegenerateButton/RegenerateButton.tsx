'use client'
import { Button } from '@/components/ui/button'
import type { RegenerateButtonProps } from './RegenerateButton.types'

export function RegenerateButton({ onClick, regenerating }: RegenerateButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={regenerating}
      className="-mr-2 text-muted-foreground hover:text-primary"
    >
      <span className={regenerating ? 'inline-block animate-spin' : 'inline-block'} aria-hidden>↻</span>
      <span className="ml-1.5">{regenerating ? 'Regenerating…' : 'Regenerate'}</span>
    </Button>
  )
}
