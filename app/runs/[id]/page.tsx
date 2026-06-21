'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { WizardStepper } from '@/components/wizard/WizardStepper'
import { FolderSelect } from '@/components/folder-select/FolderSelect'
import { ContextReview } from '@/components/context-review/ContextReview'
import { PostKit } from '@/components/post-kit/PostKit'
import { GeneratingKit } from '@/components/generating/GeneratingKit'
import { platformToMarkdown } from '@/lib/export/to-markdown'
import { planToMarkdown } from '@/lib/export/plan-to-markdown'
import { PLATFORMS, type PlatformId } from '@/lib/platforms'
import { useRun } from '@/lib/runs/useRun'
import { findByPath } from '@/lib/runs/store'
import type { GenerateInput, ProjectContext } from '@/lib/types'
import type { WizardStep } from '@/lib/wizard/wizard-reducer'

export default function RunPage() {
  const params = useParams()
  const id = String(params.id)
  // Key by id so navigating between runs remounts with a fresh reducer.
  return <RunWizard key={id} id={id} />
}

function RunWizard({ id }: { id: string }) {
  const router = useRouter()
  const { state, dispatch, status } = useRun(id)
  const [generating, setGenerating] = useState(false)

  function handleAnalyzed(context: ProjectContext) {
    // One run per folder: if this path already belongs to another run, go there.
    const existing = findByPath(state.path)
    if (existing && existing.id !== id) {
      router.push(`/runs/${existing.id}`)
      return
    }
    dispatch({ type: 'ANALYZED', context })
  }

  async function generate() {
    if (!state.context) return
    const input: GenerateInput = { context: state.context, refinements: state.refinements }
    setGenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      dispatch({ type: 'GENERATED', generation: data.generation })
      if (Array.isArray(data.failed) && data.failed.length) {
        const names = data.failed.map((f: PlatformId) => PLATFORMS.find((p) => p.id === f)?.name ?? f)
        toast.warning(`Couldn't generate: ${names.join(', ')}.`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  function markdownFor(platform: PlatformId): string | null {
    if (!state.generation) return null
    const content = state.generation.platforms[platform]
    if (!content) return null
    return platformToMarkdown(platform, state.generation.core, content)
  }

  function exportMarkdown(platform: PlatformId) {
    const md = markdownFor(platform)
    if (!md) return
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${platform}-launch-kit.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  function planMarkdown(): string | null {
    if (!state.generation?.plan) return null
    return planToMarkdown(state.generation.core, state.generation.plan)
  }

  function exportPlan() {
    const md = planMarkdown()
    if (!md) return
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'launch-plan.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copyPlan() {
    const md = planMarkdown()
    if (!md) return
    await navigator.clipboard.writeText(md)
    toast.success('Launch plan copied')
  }

  if (status === 'loading') {
    return <p className="px-6 py-16 text-center text-sm text-muted-foreground">Loading run…</p>
  }

  if (status === 'not-found') {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <h2 className="font-display text-xl font-bold tracking-tight">Run not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This run doesn&apos;t exist on this device.</p>
        <Link href="/runs" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          ← Back to your runs
        </Link>
      </div>
    )
  }

  const reachable: WizardStep[] = ['folder']
  if (state.context) reachable.push('review')
  if (state.generation) reachable.push('kit')

  return (
    <div className="space-y-6">
      {!generating && (
        <WizardStepper current={state.step} reachable={reachable} onStep={(step) => dispatch({ type: 'GO', step })} />
      )}

      {state.step === 'folder' && (
        <FolderSelect
          path={state.path}
          onPathChange={(path) => dispatch({ type: 'SET_PATH', path })}
          onAnalyzed={handleAnalyzed}
        />
      )}

      {state.step === 'review' && state.context && (
        generating ? (
          <GeneratingKit productName={state.context.name} />
        ) : (
          <ContextReview
            context={state.context}
            refinements={state.refinements}
            onContextChange={(context) => dispatch({ type: 'EDIT_CONTEXT', context })}
            onRefinementsChange={(refinements) => dispatch({ type: 'EDIT_REFINEMENTS', refinements })}
            onGenerate={() => generate()}
            generating={generating}
          />
        )
      )}

      {state.step === 'kit' && state.generation && (
        <PostKit
          generation={state.generation}
          productName={state.context?.name ?? state.generation.core.productName ?? 'Your product'}
          onExportMarkdown={exportMarkdown}
          onCopyPlan={copyPlan}
          onExportPlan={exportPlan}
          onStartOver={() => router.push('/runs')}
        />
      )}
    </div>
  )
}
