import type { NormalizedJob, SourceResult, SearchParams } from '../types/job'
import {
  stripHtml, parseJobType, parseSalary, slugId, formatPostedAt, inferCountry
} from '../utils/normalize'

const BASE = 'https://remotive.com/api/remote-jobs'

interface RemotiveJob {
  id:                         number
  url:                        string
  title:                      string
  company_name:               string
  company_logo_url?:          string
  category:                   string
  tags:                       string[]
  job_type:                   string
  publication_date:           string
  candidate_required_location: string
  salary:                     string
  description:                string
}

export async function fetchRemotive(params: SearchParams): Promise<SourceResult> {
  try {
    const qs = new URLSearchParams({ limit: String(Math.min(params.limit * 2, 50)) })
    if (params.q.trim()) qs.set('search', params.q.trim())

    const res = await fetch(`${BASE}?${qs.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) throw new Error(`Remotive HTTP ${res.status}`)

    const data = await res.json() as { jobs: RemotiveJob[] }

    const jobs: NormalizedJob[] = data.jobs.map((j, i): NormalizedJob => {
      const { display, min, max } = parseSalary(j.salary)
      const loc = j.candidate_required_location || 'Worldwide'
      return {
        id:          slugId('remotive', j.id),
        title:       j.title,
        company:     j.company_name,
        location:    loc,
        country:     inferCountry(loc),
        salary:      display,
        salaryMin:   min,
        salaryMax:   max,
        type:        parseJobType(j.job_type),
        description: stripHtml(j.description).slice(0, 500),
        postedAt:    formatPostedAt(j.publication_date),
        applyUrl:    j.url,
        source:      'remotive',
        remote:      true,
        tags:        (j.tags ?? []).slice(0, 6),
      }
    })

    return { source: 'remotive', jobs }
  } catch (err) {
    return { source: 'remotive', jobs: [], error: String(err) }
  }
}
