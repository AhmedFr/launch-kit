import '@testing-library/jest-dom/vitest'

// This Node/jsdom environment exposes a `localStorage` global without a usable
// `clear()` (Node's experimental Web Storage shadows jsdom's). Install a
// deterministic in-memory Storage so tests relying on localStorage are reliable.
class MemoryStorage {
  private store = new Map<string, string>()
  get length() {
    return this.store.size
  }
  clear() {
    this.store.clear()
  }
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value))
  }
  removeItem(key: string) {
    this.store.delete(key)
  }
  key(index: number) {
    return [...this.store.keys()][index] ?? null
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new MemoryStorage() as unknown as Storage,
  configurable: true,
  writable: true,
})
