// RemoteOK public API — no auth, no rate limit stated (be polite: 1 req/min)
import type { NormalizedJob, SourceResult, SearchParams } from '../types/job'
import { stripHtml, parseSalary, slugId, formatPostedAt } from '../utils/normalize'

const URL = 'https://remoteok.com/api'

interface RemoteOKJob {
  id:          string
  slug:        string
  company:     string
  company_logo?: string
  position:    string
  tags:        string[]
  description: string
  date:        string
  url:         string
  salary_min?: number
  salary_max?: number
  location?:   string
}

export async function fetchRemoteOK(params: SearchParams): Promise<SourceResult> {
  try {
    const res = await fetch(URL, {
      headers: { 'User-Agent': 'ApplyAI Job Aggregator (applyai-dab34.web.app)' },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) throw new Error(`RemoteOK HTTP ${res.status}`)

    // First element is metadata, rest are jobs
    const raw = await res.json() as [object, ...RemoteOKJob[]]
    const data = raw.slice(1) as RemoteOKJob[]

    const kw = params.q.toLowerCase().trim()
    const filtered = kw
      ? data.filter(j =>
          j.position?.toLowerCase().includes(kw) ||
          j.company?.toLowerCase().includes(kw) ||
          j.tags?.some(t => t.toLowerCase().includes(kw))
        )
      : data

    const jobs: NormalizedJob[] = filtered.slice(0, params.limit).map((j): NormalizedJob => {
      const display = j.salary_min && j.salary_max
        ? `$${Math.round(j.salary_min / 1000)}k – $${Math.round(j.salary_max / 1000)}k`
        : null
      return {
        id:          slugId('remoteok', j.id || j.slug),
        title:       j.position,
        company:     j.company,
        location:    j.location || 'Worldwide',
        country:     'US',
        salary:      display,
        salaryMin:   j.salary_min ?? null,
        salaryMax:   j.salary_max ?? null,
        type:        'full-time',
        description: stripHtml(j.description ?? '').slice(0, 500),
        postedAt:    formatPostedAt(j.date),
        applyUrl:    j.url,
        source:      'remoteok',
        remote:      true,
        tags:        (j.tags ?? []).slice(0, 6),
      }
    })

    return { source: 'remoteok', jobs }
  } catch (err) {
    return { source: 'remoteok', jobs: [], error: String(err) }
  }
}
