export interface Frontmatter {
  data: Record<string, unknown>
  content: string
}

const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/

function parseScalar(raw: string): unknown {
  const v = raw.trim()
  if (v === '') return ''
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1)
  }
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim()
    if (!inner) return []
    return inner.split(',').map((x) => {
      const trimmed = x.trim()
      if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ) {
        return trimmed.slice(1, -1)
      }
      return trimmed
    })
  }
  if (v === 'true') return true
  if (v === 'false') return false
  if (v === 'null') return null
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
  return v
}

export function parseFrontmatter(source: string): Frontmatter {
  const match = source.match(FRONTMATTER_RE)
  if (!match) return { data: {}, content: source }
  const [, yaml, content] = match
  const data: Record<string, unknown> = {}
  yaml.split('\n').forEach((line) => {
    const m = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/)
    if (!m) return
    const [, key, rawValue] = m
    data[key] = parseScalar(rawValue)
  })
  return { data, content }
}
