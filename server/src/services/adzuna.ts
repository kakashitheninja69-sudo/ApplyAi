import type { NormalizedJob, SourceResult, SearchParams } from '../types/job'
import {
  stripHtml, parseJobType, parseSalary, slugId,
  formatPostedAt, inferCountry, adzunaCountry,
} from '../utils/normalize'

const BASE = 'https://api.adzuna.com/v1/api/jobs'

interface AdzunaJob {
  id:              string
  title:           string
  description:     string
  created:         string
  redirect_url:    string
  salary_min?:     number
  salary_max?:     number
  salary_is_predicted?: string  // "0" or "1"
  contract_time?:  string  // "full_time" | "part_time"
  contract_type?:  string  // "permanent" | "contract"
  company: { display_name: string }
  location: {
    display_name: string
    area: string[]
  }
  category: { label: string; tag: string }
  adref?: string
}

interface AdzunaResponse {
  results:      AdzunaJob[]
  count:        number
  __CLASS__:    string
}

function buildSalaryDisplay(min?: number, max?: number): string | null {
  if (!min && !max) return null
  if (min && max && min !== max) {
    return `$${Math.round(min / 1000)}k – $${Math.round(max / 1000)}k`
  }
  const val = min ?? max!
  return `$${Math.round(val / 1000)}k`
}

export async function fetchAdzuna(params: SearchParams): Promise<SourceResult> {
  const appId  = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY

  if (!appId || !appKey) {
    return { source: 'adzuna', jobs: [], error: 'ADZUNA_APP_ID / ADZUNA_APP_KEY not set' }
  }

  try {
    const country = adzunaCountry(params.country, params.location)
    const page    = Math.max(1, params.page)

    const qs = new URLSearchParams({
      app_id:           appId,
      app_key:          appKey,
      results_per_page: String(Math.min(params.limit, 50)),
      what:             params.q      || '',
      where:            params.location || '',
      content_type:     'application/json',
      sort_by:          'date',
    })

    if (params.remote) qs.set('what_and', 'remote')
    if (params.salaryMin) qs.set('salary_min', String(params.salaryMin))
    if (params.salaryMax) qs.set('salary_max', String(params.salaryMax))

    const url = `${BASE}/${country}/search/${page}?${qs}`
    const res  = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal:  AbortSignal.timeout(10_000),
    })
    if (!res.ok) throw new Error(`Adzuna HTTP ${res.status}: ${await res.text()}`)

    const data = await res.json() as AdzunaResponse

    const jobs: NormalizedJob[] = (data.results ?? []).map((j): NormalizedJob => {
      const salaryDisplay = buildSalaryDisplay(j.salary_min, j.salary_max)
      const { min, max }  = parseSalary(salaryDisplay)
      const locParts      = j.location?.area ?? []
      const locationStr   = j.location?.display_name ?? locParts.join(', ')

      return {
        id:          slugId('adzuna', j.id),
        title:       j.title,
        company:     j.company?.display_name ?? 'Unknown',
        location:    locationStr,
        country:     country.toUpperCase(),
        salary:      salaryDisplay,
        salaryMin:   j.salary_min  ?? min,
        salaryMax:   j.salary_max  ?? max,
        type:        parseJobType(`${j.contract_time ?? ''} ${j.contract_type ?? ''}`),
        description: stripHtml(j.description).slice(0, 500),
        postedAt:    formatPostedAt(j.created),
        applyUrl:    j.redirect_url,
        source:      'adzuna',
        remote:      /remote/i.test(j.title) || /remote/i.test(j.description),
        tags:        j.category?.label ? [j.category.label] : [],
      }
    })

    return { source: 'adzuna', jobs }
  } catch (err) {
    return { source: 'adzuna', jobs: [], error: String(err) }
  }
}
