'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { FolderSelectProps } from './FolderSelect.types'

export function FolderSelect({ path, onPathChange, onAnalyzed }: FolderSelectProps) {
  const [loading, setLoading] = useState(false)

  async function analyze() {
    if (!path.trim()) {
      toast.error('Enter a folder path first')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to analyze folder')
      onAnalyzed(data.context)
      if (data.context.warnings?.length) toast.warning(data.context.warnings[0])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to analyze folder')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="path">Project folder (absolute path)</Label>
        <Input
          id="path"
          value={path}
          placeholder="/Users/you/code/your-project"
          onChange={(e) => onPathChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && analyze()}
        />
        <p className="text-xs text-muted-foreground">
          We read the README and package.json — nothing leaves your machine.
        </p>
      </div>
      <Button onClick={analyze} disabled={loading} className="w-full">
        {loading ? 'Analyzing…' : 'Analyze folder'}
      </Button>
    </div>
  )
}
