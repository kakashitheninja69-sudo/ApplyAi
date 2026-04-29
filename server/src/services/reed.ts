// Reed.co.uk API — free key at reed.co.uk/developers (UK + international jobs)
import type { NormalizedJob, SourceResult, SearchParams } from '../types/job'
import { stripHtml, slugId, formatPostedAt } from '../utils/normalize'

const BASE = 'https://www.reed.co.uk/api/1.0/search'

interface ReedJob {
  jobId:            number
  jobTitle:         string
  employerName:     string
  locationName:     string
  minimumSalary?:   number
  maximumSalary?:   number
  currency?:        string
  expirationDate:   string
  date:             string
  jobDescription:   string
  jobUrl:           string
  contractType?:    string
  contractTime?:    string
}

interface ReedResponse { results: ReedJob[] }

function buildAuth(key: string): string {
  return 'Basic ' + Buffer.from(`${key}:`).toString('base64')
}

export async function fetchReed(params: SearchParams): Promise<SourceResult> {
  const key = process.env.REED_API_KEY
  if (!key) return { source: 'reed', jobs: [], error: 'REED_API_KEY not set' }

  try {
    const qs = new URLSearchParams({
      keywords:       params.q || '',
      locationName:   params.location || '',
      resultsToTake:  String(Math.min(params.limit, 100)),
      resultsToSkip:  String((params.page - 1) * params.limit),
    })
    if (params.salaryMin) qs.set('minimumSalary', String(params.salaryMin))
    if (params.salaryMax) qs.set('maximumSalary', String(params.salaryMax))

    const res = await fetch(`${BASE}?${qs}`, {
      headers: {
        Authorization: buildAuth(key),
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) throw new Error(`Reed HTTP ${res.status}: ${await res.text()}`)

    const data = await res.json() as ReedResponse

    const jobs: NormalizedJob[] = (data.results ?? []).map((j): NormalizedJob => {
      const salaryDisplay = j.minimumSalary && j.maximumSalary
        ? `£${Math.round(j.minimumSalary / 1000)}k – £${Math.round(j.maximumSalary / 1000)}k`
        : j.minimumSalary ? `£${Math.round(j.minimumSalary / 1000)}k+` : null

      return {
        id:          slugId('reed', j.jobId),
        title:       j.jobTitle,
        company:     j.employerName,
        location:    j.locationName,
        country:     'GB',
        salary:      salaryDisplay,
        salaryMin:   j.minimumSalary ?? null,
        salaryMax:   j.maximumSalary ?? null,
        type:        j.contractTime === 'Part Time' ? 'part-time'
                   : j.contractType === 'Contract'  ? 'contract'
                   : 'full-time',
        description: stripHtml(j.jobDescription ?? '').slice(0, 500),
        postedAt:    formatPostedAt(j.date),
        applyUrl:    j.jobUrl,
        source:      'reed',
        remote:      /remote/i.test(j.locationName) || /remote/i.test(j.jobDescription ?? ''),
        tags:        [],
      }
    })

    return { source: 'reed', jobs }
  } catch (err) {
    return { source: 'reed', jobs: [], error: String(err) }
  }
}
