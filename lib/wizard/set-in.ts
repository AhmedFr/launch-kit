// Immutable deep-set: returns a copy of `obj` with `value` written at `path`,
// cloning only the nodes along the path. Supports object keys and array indices.
export function setIn<T>(obj: T, path: ReadonlyArray<string | number>, value: unknown): T {
  if (path.length === 0) return value as T
  const [key, ...rest] = path
  if (typeof key === 'number') {
    const arr = Array.isArray(obj) ? obj.slice() : []
    arr[key] = setIn(arr[key], rest, value)
    return arr as T
  }
  const src = obj && typeof obj === 'object' ? (obj as Record<string, unknown>) : {}
  return { ...src, [key]: setIn(src[key], rest, value) } as T
}
