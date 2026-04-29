// Arbeitnow free job board API — no auth required, global + EU focus
import type { NormalizedJob, SourceResult, SearchParams } from '../types/job'
import { stripHtml, parseJobType, slugId, formatPostedAt, inferCountry } from '../utils/normalize'

const BASE = 'https://www.arbeitnow.com/api/job-board-api'

interface ArbeitnowJob {
  slug:         string
  title:        string
  company_name: string
  location:     string
  remote:       boolean
  tags:         string[]
  job_types:    string[]
  description:  string
  url:          string
  created_at:   number  // unix timestamp
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[]
}

export async function fetchArbeitnow(params: SearchParams): Promise<SourceResult> {
  try {
    const qs = new URLSearchParams({ page: String(params.page) })
    const res = await fetch(`${BASE}?${qs}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'ApplyAI Job Aggregator' },
      signal:  AbortSignal.timeout(8_000),
    })
    if (!res.ok) throw new Error(`Arbeitnow HTTP ${res.status}`)

    const data = await res.json() as ArbeitnowResponse
    const kw = params.q.toLowerCase().trim()

    const filtered = kw
      ? data.data.filter(j =>
          j.title?.toLowerCase().includes(kw) ||
          j.company_name?.toLowerCase().includes(kw) ||
          j.tags?.some(t => t.toLowerCase().includes(kw))
        )
      : data.data

    const jobs: NormalizedJob[] = filtered.slice(0, params.limit).map((j): NormalizedJob => ({
      id:          slugId('arbeitnow', j.slug),
      title:       j.title,
      company:     j.company_name,
      location:    j.location || (j.remote ? 'Remote' : 'Europe'),
      country:     inferCountry(j.location ?? ''),
      salary:      null,
      salaryMin:   null,
      salaryMax:   null,
      type:        parseJobType((j.job_types ?? []).join(' ')),
      description: stripHtml(j.description ?? '').slice(0, 500),
      postedAt:    formatPostedAt(j.created_at),
      applyUrl:    j.url,
      source:      'arbeitnow',
      remote:      j.remote ?? false,
      tags:        (j.tags ?? []).slice(0, 6),
    }))

    return { source: 'arbeitnow', jobs }
  } catch (err) {
    return { source: 'arbeitnow', jobs: [], error: String(err) }
  }
}
