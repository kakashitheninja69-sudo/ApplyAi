import type { NormalizedJob, SearchParams, JobSource } from '../types/job'
import { fetchRemotive } from './remotive'
import { fetchAdzuna   } from './adzuna'
import { fetchJSearch  } from './jsearch'
import { deduplicate   } from '../utils/deduplicate'
import { rankJobs, applyDateFilter, applySalaryFilter } from '../utils/rank'

export interface AggregateResult {
  jobs:        NormalizedJob[]
  sources:     JobSource[]
  errors:      Record<string, string>
  totalRaw:    number
}

export async function aggregateJobs(params: SearchParams): Promise<AggregateResult> {
  // ── 1. Fetch all sources in parallel ────────────────────────────────────────
  const [remotiveResult, adzunaResult, jsearchResult] = await Promise.all([
    fetchRemotive(params),
    fetchAdzuna(params),
    fetchJSearch(params),
  ])

  const results    = [remotiveResult, adzunaResult, jsearchResult]
  const allJobs    = results.flatMap(r => r.jobs)
  const sources    = results.filter(r => r.jobs.length > 0).map(r => r.source)
  const errors     = Object.fromEntries(
    results.filter(r => r.error).map(r => [r.source, r.error!])
  )
  const totalRaw   = allJobs.length

  // ── 2. Apply filters ─────────────────────────────────────────────────────────
  let filtered = applyDateFilter(allJobs, params.datePosted)
  filtered     = applySalaryFilter(filtered, params.salaryMin, params.salaryMax)

  if (params.remote) {
    filtered = filtered.filter(j => j.remote)
  }

  if (params.type && params.type !== 'all') {
    filtered = filtered.filter(j => j.type === params.type)
  }

  // Location post-filter: if user specified a location, prefer jobs that
  // mention it. Don't hard-exclude (APIs already filter server-side).
  // But weight by location relevance during ranking is fine.

  // ── 3. Deduplicate ───────────────────────────────────────────────────────────
  const deduped = deduplicate(filtered)

  // ── 4. Smart ranking ─────────────────────────────────────────────────────────
  const ranked = rankJobs(deduped, params)

  return { jobs: ranked, sources, errors, totalRaw }
}
