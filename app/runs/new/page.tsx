'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { FolderSelect } from '@/components/folder-select/FolderSelect'
import { findByPath, createRun } from '@/lib/runs/store'
import type { ProjectContext } from '@/lib/types'

export default function NewRunPage() {
  const router = useRouter()
  const [path, setPath] = useState('')

  function handleAnalyzed(context: ProjectContext) {
    // One run per folder: reopen an existing run for this path, else create one.
    const existing = findByPath(path)
    if (existing) toast.info('Reopened your existing run for this folder')
    const run = existing ?? createRun(path, context)
    router.push(`/runs/${run.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-xl px-6">
        <Link href="/runs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          ← Your runs
        </Link>
      </div>
      <FolderSelect path={path} onPathChange={setPath} onAnalyzed={handleAnalyzed} />
    </div>
  )
}
