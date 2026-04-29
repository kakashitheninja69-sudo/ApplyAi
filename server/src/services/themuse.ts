// The Muse public API — no auth required
import type { NormalizedJob, SourceResult, SearchParams } from '../types/job'
import { stripHtml, slugId, formatPostedAt, inferCountry } from '../utils/normalize'

const BASE = 'https://www.themuse.com/api/public/jobs'

interface MuseJob {
  id:               number
  name:             string
  publication_date: string
  company:          { name: string }
  locations:        { name: string }[]
  categories:       { name: string }[]
  levels:           { name: string; short_name: string }[]
  refs:             { landing_page: string }
  contents?:        string
}

interface MuseResponse { results: MuseJob[] }

export async function fetchTheMuse(params: SearchParams): Promise<SourceResult> {
  try {
    const qs = new URLSearchParams({
      page:        String(params.page - 1), // 0-indexed
      descending:  'true',
    })
    if (params.q.trim()) qs.set('category', params.q.trim())
    if (params.location.trim()) qs.set('location', params.location.trim())

    const res = await fetch(`${BASE}?${qs}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'ApplyAI Job Aggregator' },
      signal:  AbortSignal.timeout(8_000),
    })
    if (!res.ok) throw new Error(`TheMuse HTTP ${res.status}`)

    const data = await res.json() as MuseResponse
    const kw = params.q.toLowerCase().trim()

    const filtered = kw
      ? (data.results ?? []).filter(j =>
          j.name?.toLowerCase().includes(kw) ||
          j.company?.name?.toLowerCase().includes(kw) ||
          j.categories?.some(c => c.name.toLowerCase().includes(kw))
        )
      : (data.results ?? [])

    const jobs: NormalizedJob[] = filtered.slice(0, params.limit).map((j): NormalizedJob => {
      const locName = j.locations?.[0]?.name ?? 'Flexible / Remote'
      return {
        id:          slugId('themuse', j.id),
        title:       j.name,
        company:     j.company?.name ?? 'Unknown',
        location:    locName,
        country:     inferCountry(locName),
        salary:      null,
        salaryMin:   null,
        salaryMax:   null,
        type:        'full-time',
        description: stripHtml(j.contents ?? '').slice(0, 500),
        postedAt:    formatPostedAt(j.publication_date),
        applyUrl:    j.refs?.landing_page ?? '',
        source:      'themuse',
        remote:      /flexible|remote/i.test(locName),
        tags:        (j.categories ?? []).map(c => c.name).slice(0, 4),
      }
    })

    return { source: 'themuse', jobs }
  } catch (err) {
    return { source: 'themuse', jobs: [], error: String(err) }
  }
}
