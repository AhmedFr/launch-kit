'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { useWizard } from '@/lib/wizard/useWizard'
import { WizardStepper } from '@/components/wizard/WizardStepper'
import { FolderSelect } from '@/components/folder-select/FolderSelect'
import { ContextReview } from '@/components/context-review/ContextReview'
import { PostKit } from '@/components/post-kit/PostKit'
import { GeneratingKit } from '@/components/generating/GeneratingKit'
import { kitToMarkdown } from '@/lib/export/to-markdown'
import type { GenerateInput, SectionKey } from '@/lib/types'
import type { WizardStep } from '@/lib/wizard/wizard-reducer'

export default function Home() {
  const { state, dispatch } = useWizard()
  const [generating, setGenerating] = useState(false)
  const [regenSection, setRegenSection] = useState<SectionKey | null>(null)

  async function generate(section?: SectionKey) {
    if (!state.context) return
    const input: GenerateInput & { section?: SectionKey } = {
      context: state.context,
      refinements: state.refinements,
      section,
    }
    if (section) setRegenSection(section)
    else setGenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      if (section) dispatch({ type: 'PATCH_KIT', patch: data.patch })
      else dispatch({ type: 'GENERATED', kit: data.kit })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      if (section) setRegenSection(null)
      else setGenerating(false)
    }
  }

  function exportMarkdown() {
    if (!state.kit) return
    const blob = new Blob([kitToMarkdown(state.kit)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'launch-kit.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copyAll() {
    if (!state.kit) return
    await navigator.clipboard.writeText(kitToMarkdown(state.kit))
    toast.success('Full kit copied')
  }

  const reachable: WizardStep[] = ['folder']
  if (state.context) reachable.push('review')
  if (state.kit) reachable.push('kit')

  return (
    <div className="space-y-6">
      {!generating && (
        <WizardStepper
          current={state.step}
          reachable={reachable}
          onStep={(step) => dispatch({ type: 'GO', step })}
        />
      )}
      {state.step === 'folder' && (
        <FolderSelect
          path={state.path}
          onPathChange={(path) => dispatch({ type: 'SET_PATH', path })}
          onAnalyzed={(context) => dispatch({ type: 'ANALYZED', context })}
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
      {state.step === 'kit' && state.kit && (
        <PostKit
          kit={state.kit}
          productName={state.context?.name ?? state.kit.copy.nameSuggestions[0] ?? 'Your product'}
          onRegenerateSection={(s) => generate(s)}
          regeneratingSection={regenSection}
          onExportMarkdown={exportMarkdown}
          onCopyAll={copyAll}
          onStartOver={() => dispatch({ type: 'RESET' })}
        />
      )}
    </div>
  )
}
