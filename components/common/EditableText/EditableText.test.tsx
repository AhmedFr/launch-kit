import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EditableText } from './EditableText'

describe('EditableText', () => {
  it('commits trimmed text on blur when changed', () => {
    const onCommit = vi.fn()
    render(<EditableText value="hello" onCommit={onCommit} ariaLabel="Field" />)
    const el = screen.getByRole('textbox', { name: 'Field' })
    el.textContent = '  world  '
    fireEvent.blur(el)
    expect(onCommit).toHaveBeenCalledWith('world')
  })

  it('does not commit when the value is unchanged', () => {
    const onCommit = vi.fn()
    render(<EditableText value="hello" onCommit={onCommit} ariaLabel="Field" />)
    const el = screen.getByRole('textbox', { name: 'Field' })
    fireEvent.blur(el)
    expect(onCommit).not.toHaveBeenCalled()
  })

  it('reverts to the previous value when cleared to empty', () => {
    const onCommit = vi.fn()
    render(<EditableText value="hello" onCommit={onCommit} ariaLabel="Field" />)
    const el = screen.getByRole('textbox', { name: 'Field' })
    el.textContent = '   '
    fireEvent.blur(el)
    expect(onCommit).not.toHaveBeenCalled()
    expect(el.textContent).toBe('hello')
  })

  it('renders read-only text (no textbox) when onCommit is omitted', () => {
    render(<EditableText value="static" ariaLabel="Field" />)
    expect(screen.queryByRole('textbox')).toBeNull()
    expect(screen.getByText('static')).toBeInTheDocument()
  })
})
