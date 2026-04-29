// Working Nomads public API — no auth, remote jobs only
import type { NormalizedJob, SourceResult, SearchParams } from '../types/job'
import { stripHtml, parseJobType, slugId, formatPostedAt } from '../utils/normalize'

const BASE = 'https://www.workingnomads.com/api/exposed_jobs/'

interface WNJob {
  id:          number
  title:       string
  company:     string
  category:    string
  tags:        string[]
  url:         string
  pub_date:    string
  description: string
  location?:   string
}

export async function fetchWorkingNomads(params: SearchParams): Promise<SourceResult> {
  try {
    const res = await fetch(BASE, {
      headers: { Accept: 'application/json', 'User-Agent': 'ApplyAI Job Aggregator' },
      signal:  AbortSignal.timeout(8_000),
    })
    if (!res.ok) throw new Error(`WorkingNomads HTTP ${res.status}`)

    const data = await res.json() as WNJob[]
    const kw = params.q.toLowerCase().trim()

    const filtered = kw
      ? data.filter(j =>
          j.title?.toLowerCase().includes(kw) ||
          j.company?.toLowerCase().includes(kw) ||
          j.category?.toLowerCase().includes(kw) ||
          j.tags?.some(t => t.toLowerCase().includes(kw))
        )
      : data

    const jobs: NormalizedJob[] = filtered.slice(0, params.limit).map((j): NormalizedJob => ({
      id:          slugId('workingnomads', j.id),
      title:       j.title,
      company:     j.company,
      location:    j.location || 'Worldwide',
      country:     'US',
      salary:      null,
      salaryMin:   null,
      salaryMax:   null,
      type:        parseJobType(j.category ?? ''),
      description: stripHtml(j.description ?? '').slice(0, 500),
      postedAt:    formatPostedAt(j.pub_date),
      applyUrl:    j.url,
      source:      'workingnomads',
      remote:      true,
      tags:        (j.tags ?? []).slice(0, 6),
    }))

    return { source: 'workingnomads', jobs }
  } catch (err) {
    return { source: 'workingnomads', jobs: [], error: String(err) }
  }
}
