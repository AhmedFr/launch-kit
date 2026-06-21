'use client'
import { useRef, type KeyboardEvent, type ClipboardEvent } from 'react'
import type { EditableTextProps } from './EditableText.types'

// Seamless inline editing: the text itself is contentEditable — no input box, no
// edit/save buttons. Edits commit on blur and persist via the run's autosave.
// React renders `value` as the initial child and never re-renders it mid-edit
// (commits happen on blur, so the value prop only changes when unfocused), so the
// caret never jumps.
export function EditableText({ value, onCommit, multiline = false, ariaLabel, className = '' }: EditableTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  if (!onCommit) {
    return (
      <div className={className} style={multiline ? { whiteSpace: 'pre-wrap' } : undefined}>
        {value}
      </div>
    )
  }

  function commit() {
    const el = ref.current
    if (!el) return
    // jsdom lacks innerText; fall back to textContent so tests still exercise commit.
    const raw = (multiline ? el.innerText || el.textContent : el.textContent) || ''
    const next = raw.replace(/ /g, ' ').replace(/\n+$/, '').trim()
    if (!next) {
      el.textContent = value // never persist blank prose — revert
      return
    }
    if (next !== value) onCommit!(next)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
      ref.current?.blur()
    }
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label={ariaLabel}
      aria-multiline={multiline || undefined}
      tabIndex={0}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className={`-mx-1 cursor-text rounded-sm px-1 outline-none transition-colors hover:bg-muted/40 focus:bg-muted/30 focus:ring-1 focus:ring-primary/40 ${className}`}
      style={multiline ? { whiteSpace: 'pre-wrap' } : undefined}
    >
      {value}
    </div>
  )
}
