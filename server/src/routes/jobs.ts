import { Router, Request, Response } from 'express'
import type { SearchParams, DateFilter } from '../types/job'
import { aggregateJobs }               from '../services/aggregator'
import { cacheKey, getCache, setCache } from '../cache/jobCache'

export const router = Router()

function parseParams(q: InstanceType<typeof URLSearchParams>): SearchParams {
  const limit = Math.min(parseInt(q.get('limit') ?? '20', 10), 50)
  const page  = Math.max(1, parseInt(q.get('page')  ?? '1',  10))

  const datePosted = (['24h', '7d', '30d', 'any'] as DateFilter[])
    .includes(q.get('datePosted') as DateFilter)
    ? (q.get('datePosted') as DateFilter)
    : 'any'

  const salaryMin = q.get('salaryMin') ? parseInt(q.get('salaryMin')!, 10) : null
  const salaryMax = q.get('salaryMax') ? parseInt(q.get('salaryMax')!, 10) : null

  return {
    q:          q.get('q')        ?? '',
    location:   q.get('location') ?? '',
    country:    q.get('country')  ?? '',
    remote:     q.get('remote')   === 'true',
    type:       q.get('type')     ?? 'all',
    datePosted,
    salaryMin,
    salaryMax,
    page,
    limit,
  }
}

// GET /jobs
router.get('/', async (req: Request, res: Response) => {
  const start  = Date.now()
  const params = parseParams(new URLSearchParams(req.query as Record<string, string>))
  const key    = cacheKey(params)

  // ── Cache hit ────────────────────────────────────────────────────────────────
  const cached = getCache(key)
  if (cached) {
    const page  = params.page
    const limit = params.limit
    const slice = cached.jobs.slice((page - 1) * limit, page * limit)
    return res.json({
      jobs:        slice,
      total:       cached.jobs.length,
      page,
      sources:     [...new Set(cached.jobs.map(j => j.source))],
      cachedAt:    cached.cachedAt,
      fetchTimeMs: Date.now() - start,
    })
  }

  // ── Live fetch ───────────────────────────────────────────────────────────────
  try {
    // Always fetch page 1 from sources and cache the full result;
    // pagination is handled here so callers get consistent results.
    const fetchParams = { ...params, page: 1, limit: 50 }
    const result      = await aggregateJobs(fetchParams)

    setCache(key, result.jobs)

    const { page, limit } = params
    const slice = result.jobs.slice((page - 1) * limit, page * limit)

    return res.json({
      jobs:        slice,
      total:       result.jobs.length,
      page,
      sources:     result.sources,
      cachedAt:    null,
      fetchTimeMs: Date.now() - start,
      ...(Object.keys(result.errors).length > 0 ? { warnings: result.errors } : {}),
    })
  } catch (err) {
    console.error('[/jobs]', err)
    return res.status(500).json({ error: 'Internal server error', jobs: [], total: 0, page: 1 })
  }
})

// GET /jobs/health — quick source status
router.get('/health', (_req: Request, res: Response) => {
  const ok  = 'on (no key)'
  const cfg = (k: string) => process.env[k] ? '✓ configured' : `✗ missing ${k}`
  res.json({
    sources: {
      // Always-on (no key needed)
      remotive:      ok,
      remoteok:      ok,
      arbeitnow:     ok,
      workingnomads: ok,
      themuse:       ok,
      greenhouse:    'on (public API)',
      lever:         'on (public API)',
      rss_feeds:     'on (We Work Remotely, Jobicy, …)',
      // Require keys
      adzuna:  cfg('ADZUNA_APP_ID'),
      jsearch: cfg('JSEARCH_API_KEY'),
      reed:    cfg('REED_API_KEY'),
    },
  })
})
