export type EditableTextProps = {
  value: string
  /** When omitted, the text renders read-only (no contentEditable). */
  onCommit?: (next: string) => void
  /** Multiline keeps line breaks and lets Enter insert a newline. */
  multiline?: boolean
  ariaLabel: string
  className?: string
}
