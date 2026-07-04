function resetKey(key: string) {
  try { localStorage.removeItem(key) } catch { /* Storage may be unavailable. */ }
}

export function loadLocal<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    if (isValid(parsed)) return parsed
    resetKey(key)
  } catch { resetKey(key) }
  return fallback
}

export function saveLocal<T>(key: string, value: T): boolean {
  try { localStorage.setItem(key, JSON.stringify(value)); return true } catch { return false }
}

export const isRecordArray = <T>(value: unknown): value is T[] =>
  Array.isArray(value) && value.every(item => typeof item === 'object' && item !== null && !Array.isArray(item))
