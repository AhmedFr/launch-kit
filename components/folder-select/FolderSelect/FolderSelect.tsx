'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRuntimeConfig } from '@/lib/config/RuntimeConfigProvider'
import type { FolderSelectProps } from './FolderSelect.types'

export function FolderSelect({ path, onPathChange, onAnalyzed }: FolderSelectProps) {
  const { localFsAvailable } = useRuntimeConfig()
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
    <div className="mx-auto max-w-xl px-6">
      <div className="reveal reveal-1 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <span className="size-1.5 rounded-full bg-primary" /> Step 1 · Point it at your project
        </span>
        <h2 className="font-display mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-[2.75rem]">
          Turn your repo into a
          <span className="text-primary"> launch worth upvoting</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-balance text-sm text-muted-foreground">
          Drop in a project folder with a README. We read it locally and draft your whole post —
          copy, gallery shots, a video storyboard, and a launch-day plan.
        </p>
      </div>

      <div className="reveal reveal-2 mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="path" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Project folder
          </Label>
          <Input
            id="path"
            value={path}
            placeholder="/Users/you/code/your-project"
            className="h-11 font-mono text-sm"
            onChange={(e) => onPathChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && localFsAvailable && analyze()}
            disabled={!localFsAvailable}
          />
        </div>
        <Button
          onClick={analyze}
          disabled={loading || !localFsAvailable}
          title={localFsAvailable ? undefined : 'Folder analysis runs locally — clone and run Launch Kit on your machine'}
          size="lg"
          className="mt-4 w-full"
        >
          {loading ? 'Reading your project…' : 'Analyze folder →'}
        </Button>
        {localFsAvailable ? (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Runs locally · reads README + package.json · nothing leaves your machine
          </p>
        ) : (
          <p className="mt-3 text-center text-xs text-amber-700">
            Folder analysis runs locally. Clone Launch Kit and run it on your machine to analyze a folder.
          </p>
        )}
      </div>
    </div>
  )
}
