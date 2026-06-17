function parseUpstreamMessage(body: string): string {
  try {
    const parsed = JSON.parse(body)
    return parsed?.error?.message ?? parsed?.message ?? ''
  } catch {
    return ''
  }
}

// Turns an OpenRouter HTTP failure into an actionable, user-facing message that
// points at the env var most likely at fault.
export function describeOpenRouterError(status: number, body: string): string {
  const detail = parseUpstreamMessage(body)
  const suffix = detail ? ` — ${detail}` : ''
  if (status === 401 || status === 403) return `OpenRouter rejected your API key (${status}). Check OPENROUTER_API_KEY.${suffix}`
  if (status === 404) return `Model not found on OpenRouter (404). Check OPENROUTER_MODEL.${suffix}`
  if (status === 402) return `Insufficient OpenRouter credits (402).${suffix}`
  if (status === 429) return `OpenRouter rate limit hit (429). Try again shortly.${suffix}`
  return `OpenRouter ${status}: ${detail || body.slice(0, 200) || 'request failed'}`
}
