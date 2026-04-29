import type { NormalizedJob, SourceResult, SearchParams } from '../types/job'
import {
  stripHtml, parseJobType, parseSalary, slugId,
  formatPostedAt, inferCountry,
} from '../utils/normalize'

const BASE = 'https://jsearch.p.rapidapi.com/search'

interface JSearchJob {
  job_id:                  string
  job_title:               string
  employer_name:           string
  employer_logo?:          string
  job_description:         string
  job_employment_type:     string
  job_posted_at_datetime_utc: string
  job_is_remote:           boolean
  job_city?:               string
  job_state?:              string
  job_country?:            string
  job_apply_link:          string
  job_min_salary?:         number
  job_max_salary?:         number
  job_salary_currency?:    string
  job_salary_period?:      string
  job_highlights?: {
    Qualifications?: string[]
    Responsibilities?: string[]
    Benefits?: string[]
  }
  job_required_skills?: string[]
}

interface JSearchResponse {
  status: string
  data:   JSearchJob[]
}

function buildQuery(params: SearchParams): string {
  const parts = [params.q.trim()]
  if (params.location.trim()) parts.push(`in ${params.location.trim()}`)
  if (params.remote)          parts.push('remote')
  return parts.filter(Boolean).join(' ')
}

function annualise(salary: number, period?: string): number {
  if (!period) return salary
  switch (period.toLowerCase()) {
    case 'hour':  return salary * 2080
    case 'day':   return salary * 260
    case 'week':  return salary * 52
    case 'month': return salary * 12
    default:      return salary
  }
}

export async function fetchJSearch(params: SearchParams): Promise<SourceResult> {
  const key = process.env.JSEARCH_API_KEY
  if (!key) {
    return { source: 'jsearch', jobs: [], error: 'JSEARCH_API_KEY not set' }
  }

  try {
    const qs = new URLSearchParams({
      query:        buildQuery(params),
      page:         String(Math.max(1, params.page)),
      num_pages:    '1',
      date_posted:  params.datePosted === '24h' ? 'today'
                  : params.datePosted === '7d'  ? 'week'
                  : params.datePosted === '30d' ? 'month'
                  : 'all',
    })
    if (params.remote) qs.set('remote_jobs_only', 'true')

    const res = await fetch(`${BASE}?${qs}`, {
      headers: {
        'X-RapidAPI-Key':  key,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
        Accept:            'application/json',
      },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) throw new Error(`JSearch HTTP ${res.status}: ${await res.text()}`)

    const data = await res.json() as JSearchResponse

    const jobs: NormalizedJob[] = (data.data ?? []).map((j): NormalizedJob => {
      const locationParts = [j.job_city, j.job_state, j.job_country].filter(Boolean)
      const locationStr   = locationParts.join(', ')

      const rawMin  = j.job_min_salary != null ? annualise(j.job_min_salary, j.job_salary_period) : null
      const rawMax  = j.job_max_salary != null ? annualise(j.job_max_salary, j.job_salary_period) : null
      const salaryDisplay = rawMin && rawMax
        ? `$${Math.round(rawMin / 1000)}k – $${Math.round(rawMax / 1000)}k`
        : rawMin ? `$${Math.round(rawMin / 1000)}k+` : null

      // Collect tags from required skills + highlights
      const tags: string[] = [
        ...(j.job_required_skills ?? []),
        ...(j.job_highlights?.Qualifications ?? []).slice(0, 2),
      ].slice(0, 6).map(s => s.slice(0, 40))

      // Build description from description + highlights
      const highlights = [
        ...(j.job_highlights?.Responsibilities ?? []).slice(0, 3),
        ...(j.job_highlights?.Benefits         ?? []).slice(0, 2),
      ].join(' • ')

      const description = `${stripHtml(j.job_description).slice(0, 300)}${highlights ? ' • ' + highlights : ''}`

      return {
        id:          slugId('jsearch', j.job_id),
        title:       j.job_title,
        company:     j.employer_name,
        location:    locationStr || 'Remote',
        country:     j.job_country?.toUpperCase() ?? inferCountry(locationStr),
        salary:      salaryDisplay,
        salaryMin:   rawMin,
        salaryMax:   rawMax,
        type:        parseJobType(j.job_employment_type),
        description: description.slice(0, 500),
        postedAt:    formatPostedAt(j.job_posted_at_datetime_utc),
        applyUrl:    j.job_apply_link,
        source:      'jsearch',
        remote:      j.job_is_remote,
        tags,
      }
    })

    return { source: 'jsearch', jobs }
  } catch (err) {
    return { source: 'jsearch', jobs: [], error: String(err) }
  }
}
