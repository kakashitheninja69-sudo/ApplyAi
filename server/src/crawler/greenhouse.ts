// Greenhouse.io public job board API
// Companies host their careers at boards.greenhouse.io/{slug}
// The API is public — no auth required.
import type { NormalizedJob, SourceResult, SearchParams } from '../types/job'
import { stripHtml, parseJobType, slugId, formatPostedAt, inferCountry } from '../utils/normalize'

interface GHJob {
  id:         number
  title:      string
  location:   { name: string }
  departments?: { name: string }[]
  offices?:   { name: string; location: string; country_code?: string }[]
  updated_at: string
  absolute_url: string
  content?:   string
  metadata?:  { id: number; name: string; value: string | null }[]
}

interface GHResponse { jobs: GHJob[] }

async function fetchCompany(slug: string, params: SearchParams): Promise<NormalizedJob[]> {
  const res = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`,
    {
      headers: { Accept: 'application/json', 'User-Agent': 'ApplyAI Job Aggregator' },
      signal:  AbortSignal.timeout(8_000),
    }
  )
  if (!res.ok) return []

  const data = await res.json() as GHResponse
  const kw   = params.q.toLowerCase().trim()

  const filtered = kw
    ? (data.jobs ?? []).filter(j =>
        j.title?.toLowerCase().includes(kw) ||
        j.departments?.some(d => d.name.toLowerCase().includes(kw))
      )
    : (data.jobs ?? [])

  return filtered.slice(0, 10).map((j): NormalizedJob => {
    const loc     = j.location?.name ?? j.offices?.[0]?.location ?? 'Unknown'
    const country = j.offices?.[0]?.country_code ?? inferCountry(loc)
    return {
      id:          slugId('greenhouse', j.id),
      title:       j.title,
      company:     slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      location:    loc,
      country:     country.toUpperCase(),
      salary:      null,
      salaryMin:   null,
      salaryMax:   null,
      type:        parseJobType(j.departments?.[0]?.name ?? ''),
      description: stripHtml(j.content ?? '').slice(0, 500),
      postedAt:    formatPostedAt(j.updated_at),
      applyUrl:    j.absolute_url,
      source:      'greenhouse',
      remote:      /remote/i.test(loc),
      tags:        (j.departments ?? []).map(d => d.name).slice(0, 4),
    }
  })
}

// ── Company slugs to crawl ────────────────────────────────────────────────────
// These are real companies with public Greenhouse boards

export const GREENHOUSE_COMPANIES = [
  'stripe', 'notion', 'figma', 'airbnb', 'coinbase', 'robinhood',
  'brex', 'plaid', 'gusto', 'doordash', 'instacart', 'thumbtack',
  'asana', 'zendesk', 'dropbox', 'box', 'twilio', 'sendgrid',
  'hashicorp', 'cloudflare', 'mongodb', 'elastic', 'confluent',
  'datadog', 'newrelic', 'pagerduty', 'okta', 'auth0',
  'segment', 'amplitude', 'mixpanel', 'intercom', 'drift',
]

export async function crawlGreenhouse(params: SearchParams): Promise<SourceResult> {
  try {
    // Fetch up to 10 companies in parallel (be polite to Greenhouse)
    const batch    = GREENHOUSE_COMPANIES.slice(0, 10)
    const results  = await Promise.allSettled(batch.map(slug => fetchCompany(slug, params)))
    const allJobs  = results
      .filter((r): r is PromiseFulfilledResult<NormalizedJob[]> => r.status === 'fulfilled')
      .flatMap(r => r.value)

    return { source: 'greenhouse', jobs: allJobs }
  } catch (err) {
    return { source: 'greenhouse', jobs: [], error: String(err) }
  }
}
