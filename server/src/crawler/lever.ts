// Lever.co public job posting API
// Companies host careers at jobs.lever.co/{slug}
// API is public — no auth required.
import type { NormalizedJob, SourceResult, SearchParams } from '../types/job'
import { stripHtml, parseJobType, slugId, formatPostedAt, inferCountry } from '../utils/normalize'

interface LeverPosting {
  id:              string
  text:            string  // job title
  categories: {
    commitment?:   string
    department?:   string
    location?:     string
    team?:         string
  }
  description:     string
  descriptionPlain?: string
  hostedUrl:       string
  applyUrl:        string
  createdAt:       number  // ms timestamp
  workplaceType?:  string
}

async function fetchCompany(slug: string, params: SearchParams): Promise<NormalizedJob[]> {
  const res = await fetch(
    `https://api.lever.co/v0/postings/${slug}?mode=json`,
    {
      headers: { Accept: 'application/json', 'User-Agent': 'ApplyAI Job Aggregator' },
      signal:  AbortSignal.timeout(8_000),
    }
  )
  if (!res.ok) return []

  const data = await res.json() as LeverPosting[]
  const kw   = params.q.toLowerCase().trim()
  const companyName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')

  const filtered = kw
    ? (data ?? []).filter(p =>
        p.text?.toLowerCase().includes(kw) ||
        p.categories?.team?.toLowerCase().includes(kw) ||
        p.categories?.department?.toLowerCase().includes(kw)
      )
    : (data ?? [])

  return filtered.slice(0, 10).map((p): NormalizedJob => {
    const loc     = p.categories?.location ?? 'Remote'
    const isRemote = p.workplaceType === 'remote' || /remote/i.test(loc)
    return {
      id:          slugId('lever', p.id),
      title:       p.text,
      company:     companyName,
      location:    loc,
      country:     inferCountry(loc),
      salary:      null,
      salaryMin:   null,
      salaryMax:   null,
      type:        parseJobType(p.categories?.commitment ?? ''),
      description: (p.descriptionPlain ?? stripHtml(p.description ?? '')).slice(0, 500),
      postedAt:    formatPostedAt(p.createdAt / 1000),
      applyUrl:    p.applyUrl || p.hostedUrl,
      source:      'lever',
      remote:      isRemote,
      tags:        [
        p.categories?.team,
        p.categories?.department,
      ].filter((s): s is string => Boolean(s)).slice(0, 4),
    }
  })
}

// ── Company slugs to crawl ────────────────────────────────────────────────────

export const LEVER_COMPANIES = [
  'netflix', 'shopify', 'canva', 'hubspot', 'zendesk',
  'reddit', 'discord', 'airtable', 'carta', 'rippling',
  'coda', 'retool', 'linear', 'vercel', 'neon',
  'anthropic', 'openai', 'cohere', 'mistral',
  'duolingo', 'calm', 'headspace',
  'loom', 'miro', 'figma-inc',
]

export async function crawlLever(params: SearchParams): Promise<SourceResult> {
  try {
    const batch   = LEVER_COMPANIES.slice(0, 10)
    const results = await Promise.allSettled(batch.map(slug => fetchCompany(slug, params)))
    const allJobs = results
      .filter((r): r is PromiseFulfilledResult<NormalizedJob[]> => r.status === 'fulfilled')
      .flatMap(r => r.value)

    return { source: 'lever', jobs: allJobs }
  } catch (err) {
    return { source: 'lever', jobs: [], error: String(err) }
  }
}
