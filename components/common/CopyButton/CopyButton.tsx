'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { CopyButtonProps } from './CopyButton.types'

export function CopyButton({ value, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Could not copy')
    }
  }
  return (
    <Button variant="outline" size="sm" onClick={copy}>
      {copied ? 'Copied!' : label}
    </Button>
  )
}
