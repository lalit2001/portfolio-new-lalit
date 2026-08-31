import { BLOG_CONFIG } from '../config/blog'

interface Entry<T> {
  t: number
  v: T
}

export function readCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Entry<T>
    if (Date.now() - parsed.t > BLOG_CONFIG.cacheTtlMs) return null
    return parsed.v
  } catch {
    return null
  }
}

export function writeCache<T>(key: string, value: T): void {
  try {
    const entry: Entry<T> = { t: Date.now(), v: value }
    sessionStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // sessionStorage full / disabled; ignore
  }
}
