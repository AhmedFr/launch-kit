import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LaunchPlan } from './LaunchPlan'
import type { LaunchPlan as LaunchPlanData } from '@/lib/types'

const plan: LaunchPlanData = {
  phases: [{ window: 'L-6 weeks', goal: 'Lock strategy', tasks: ['Define the ICP'] }],
  countdown30: ['Build the landing page'],
  countdown7: ['Confirm the hunter'],
  countdown48h: ['Final QA'],
  seoGeo: ['Configure IndexNow'],
  momentum: ['Post a recap'],
}

describe('LaunchPlan', () => {
  it('renders the timeline and every checklist section', () => {
    render(<LaunchPlan plan={plan} onCopy={() => {}} onExport={() => {}} />)
    expect(screen.getByText('L-6 weeks')).toBeInTheDocument()
    expect(screen.getByText('Define the ICP')).toBeInTheDocument()
    expect(screen.getByText('Configure IndexNow')).toBeInTheDocument()
    expect(screen.getByText('Post a recap')).toBeInTheDocument()
  })

  it('wires the copy and export actions', async () => {
    const onCopy = vi.fn()
    const onExport = vi.fn()
    render(<LaunchPlan plan={plan} onCopy={onCopy} onExport={onExport} />)
    await userEvent.click(screen.getByRole('button', { name: 'Copy' }))
    await userEvent.click(screen.getByRole('button', { name: 'Export' }))
    expect(onCopy).toHaveBeenCalledOnce()
    expect(onExport).toHaveBeenCalledOnce()
  })
})
