// Models often wrap JSON in markdown fences or surround it with prose, even
// when asked not to. This pulls out the JSON object so JSON.parse can succeed.
export function extractJsonObject(text: string): string {
  let t = text.trim()

  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) t = fence[1].trim()

  const start = t.indexOf('{')
  const end = t.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) {
    throw new Error('No JSON object found in the model response.')
  }
  return t.slice(start, end + 1)
}
