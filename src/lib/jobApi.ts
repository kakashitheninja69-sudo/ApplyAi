// Job search API client
// Tries the local backend first; falls back to Remotive directly.

export interface ApiJob {
  id:          string
  title:       string
  company:     string
  location:    string
  country:     string
  salary:      string | null
  salaryMin:   number | null
  salaryMax:   number | null
  type:        'full-time' | 'part-time' | 'contract' | 'remote' | 'internship'
  description: string
  postedAt:    string
  applyUrl:    string
  source:      'adzuna' | 'jsearch' | 'remotive' | 'other'
  remote:      boolean
  tags:        string[]
}

export interface JobsResponse {
  jobs:        ApiJob[]
  total:       number
  page:        number
  sources:     string[]
  cachedAt:    string | null
  fetchTimeMs: number
}

// Point this at your deployed backend when you have one
const BACKEND_URL = import.meta.env.VITE_JOB_API_URL ?? ''

// ── Backend client ────────────────────────────────────────────────────────────

async function fetchFromBackend(params: Record<string, string>): Promise<JobsResponse> {
  const qs  = new URLSearchParams(params)
  const res = await fetch(`${BACKEND_URL}/jobs?${qs}`, {
    signal: AbortSignal.timeout(12_000),
  })
  if (!res.ok) throw new Error(`Backend ${res.status}`)
  return res.json() as Promise<JobsResponse>
}

// ── Remotive direct fallback ──────────────────────────────────────────────────

function stripHtml(html: string): string {
  return (html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim()
}

function formatPostedAt(dateStr: string): string {
  try {
    const diff  = Date.now() - new Date(dateStr).getTime()
    const hours = Math.floor(diff / 3_600_000)
    const days  = Math.floor(diff / 86_400_000)
    if (hours < 1)  return 'Just posted'
    if (hours < 24) return `${hours}h ago`
    if (days  < 7)  return `${days}d ago`
    return `${Math.floor(days / 7)}w ago`
  } catch { return 'Recently' }
}

async function fetchFromRemotive(keyword: string, limit = 25): Promise<JobsResponse> {
  const qs = new URLSearchParams({ limit: String(limit) })
  if (keyword.trim()) qs.set('search', keyword.trim())
  const res = await fetch(`https://remotive.com/api/remote-jobs?${qs}`, {
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`Remotive ${res.status}`)
  const data = await res.json() as { jobs: any[] }

  const jobs: ApiJob[] = data.jobs.map((j): ApiJob => ({
    id:          `remotive::${j.id}`,
    title:       j.title,
    company:     j.company_name,
    location:    j.candidate_required_location || 'Worldwide',
    country:     'US',
    salary:      j.salary?.trim() || null,
    salaryMin:   null,
    salaryMax:   null,
    type:        j.job_type === 'part_time' ? 'part-time'
               : j.job_type === 'contract'  ? 'contract'
               : j.job_type === 'internship' ? 'internship'
               : 'full-time',
    description: stripHtml(j.description).slice(0, 220),
    postedAt:    j.publication_date,
    applyUrl:    j.url,
    source:      'remotive',
    remote:      true,
    tags:        (j.tags ?? []).slice(0, 6),
  }))

  return {
    jobs,
    total:       jobs.length,
    page:        1,
    sources:     ['remotive'],
    cachedAt:    null,
    fetchTimeMs: 0,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface SearchOptions {
  q?:          string
  location?:   string
  country?:    string
  remote?:     boolean
  type?:       string
  datePosted?: string
  salaryMin?:  number
  salaryMax?:  number
  page?:       number
  limit?:      number
}

// Score a job against a keyword — higher = more relevant
function relevanceScore(job: ApiJob, q: string): number {
  if (!q.trim()) return 0
  const kw    = q.toLowerCase()
  const words = kw.split(/\s+/).filter(Boolean)
  const title = job.title.toLowerCase()
  const tags  = job.tags.join(' ').toLowerCase()
  const desc  = job.description.toLowerCase()
  let score   = 0
  for (const w of words) {
    if (title.includes(w)) score += 10   // title match is strongest signal
    if (tags.includes(w))  score += 4
    if (desc.includes(w))  score += 1
  }
  if (title.includes(kw)) score += 15   // bonus: exact phrase in title
  return score
}

export async function searchJobs(opts: SearchOptions): Promise<JobsResponse> {
  // Backend path — handles all filtering + ranking server-side
  if (BACKEND_URL) {
    const params: Record<string, string> = {}
    if (opts.q)          params.q          = opts.q
    if (opts.location)   params.location   = opts.location
    if (opts.country)    params.country    = opts.country
    if (opts.remote)     params.remote     = 'true'
    if (opts.type)       params.type       = opts.type
    if (opts.datePosted) params.datePosted = opts.datePosted
    if (opts.salaryMin)  params.salaryMin  = String(opts.salaryMin)
    if (opts.salaryMax)  params.salaryMax  = String(opts.salaryMax)
    if (opts.page)       params.page       = String(opts.page)
    if (opts.limit)      params.limit      = String(opts.limit)
    return fetchFromBackend(params)
  }

  // Fallback: Remotive direct
  const result = await fetchFromRemotive(opts.q ?? '', opts.limit ?? 25)
  const kw = (opts.q ?? '').trim()

  // Strict relevance filter: drop jobs with zero title/tag/desc match
  if (kw) {
    const scored = result.jobs
      .map(j => ({ j, s: relevanceScore(j, kw) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)

    result.jobs = scored.map(({ j }) => j)
  }

  // Location filter
  if (opts.location?.trim()) {
    const loc      = opts.location.toLowerCase()
    const filtered = result.jobs.filter(j => {
      const jl = j.location.toLowerCase()
      return jl.includes(loc) || jl.includes('worldwide') || jl.includes('anywhere') || loc.includes('remote')
    })
    if (filtered.length > 0) result.jobs = filtered
  }

  result.total = result.jobs.length
  return result
}

// Expose a human-readable "X ago" for postedAt strings
export function relativeTime(isoOrRaw: string): string {
  if (!isoOrRaw) return ''
  // Already formatted (e.g. "2d ago")
  if (/ago|posted|recently/i.test(isoOrRaw)) return isoOrRaw
  return formatPostedAt(isoOrRaw)
}
