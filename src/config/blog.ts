export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags?: string[]
  cover?: string
}

export type BlogSource = 'local' | 'github'

export interface BlogConfig {
  source: BlogSource
  local: {
    folder: string
  }
  github: {
    owner: string
    repo: string
    branch: string
    folder: string
    autoIndex: boolean
  }
  cacheTtlMs: number
}

export const BLOG_CONFIG: BlogConfig = {
  source: 'local',
  local: {
    folder: '/posts',
  },
  github: {
    owner: 'lalit2001',
    repo: 'writing',
    branch: 'main',
    folder: 'posts',
    autoIndex: true,
  },
  cacheTtlMs: 5 * 60 * 1000,
}

function baseUrl(): string {
  if (BLOG_CONFIG.source === 'local') {
    return BLOG_CONFIG.local.folder.replace(/\/+$/, '')
  }
  const { owner, repo, branch, folder } = BLOG_CONFIG.github
  const clean = folder.replace(/^\/+|\/+$/g, '')
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${clean}`
}

export function manifestUrl(): string {
  return `${baseUrl()}/index.json`
}

export function postUrl(slug: string): string {
  return `${baseUrl()}/${slug}.mdx`
}

export function sourceRepoUrl(): string {
  if (BLOG_CONFIG.source === 'local') return '#writing'
  const { owner, repo } = BLOG_CONFIG.github
  return `https://github.com/${owner}/${repo}`
}

export function contentsApiUrl(): string {
  const { owner, repo, branch, folder } = BLOG_CONFIG.github
  const clean = folder.replace(/^\/+|\/+$/g, '')
  return `https://api.github.com/repos/${owner}/${repo}/contents/${clean}?ref=${branch}`
}
