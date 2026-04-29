import type { NormalizedJob, SearchParams, JobSource } from '../types/job'

// ── API sources ───────────────────────────────────────────────────────────────
import { fetchRemotive       } from './remotive'
import { fetchAdzuna         } from './adzuna'
import { fetchJSearch        } from './jsearch'
import { fetchRemoteOK       } from './remoteok'
import { fetchArbeitnow      } from './arbeitnow'
import { fetchWorkingNomads  } from './workingnomads'
import { fetchTheMuse        } from './themuse'
import { fetchReed           } from './reed'

// ── Crawlers ──────────────────────────────────────────────────────────────────
import { crawlAllRssFeeds    } from '../crawler/rss'
import { crawlGreenhouse     } from '../crawler/greenhouse'
import { crawlLever          } from '../crawler/lever'

// ── Post-processing ───────────────────────────────────────────────────────────
import { deduplicate         } from '../utils/deduplicate'
import { rankJobs, applyDateFilter, applySalaryFilter } from '../utils/rank'

export interface AggregateResult {
  jobs:     NormalizedJob[]
  sources:  JobSource[]
  errors:   Record<string, string>
  totalRaw: number
}

export async function aggregateJobs(params: SearchParams): Promise<AggregateResult> {
  // ── Group 1: Fast API sources — always run (free, no auth) ───────────────
  const fastSources = Promise.all([
    fetchRemotive(params),
    fetchRemoteOK(params),
    fetchArbeitnow(params),
    fetchWorkingNomads(params),
    fetchTheMuse(params),
  ])

  // ── Group 2: Authenticated APIs — run if keys are set ────────────────────
  const authSources = Promise.all([
    fetchAdzuna(params),
    fetchJSearch(params),
    fetchReed(params),
  ])

  // ── Group 3: Crawlers — run in parallel with API sources ─────────────────
  // Greenhouse & Lever: public, no auth. RSS: public feeds.
  const crawlerSources = Promise.all([
    crawlGreenhouse(params),
    crawlLever(params),
    crawlAllRssFeeds(params.q),
  ])

  // Run all three groups in parallel
  const [fastResults, authResults, crawlerResults] = await Promise.all([
    fastSources,
    authSources,
    crawlerSources,
  ])

  const allResults  = [...fastResults, ...authResults, ...crawlerResults]
  const allJobs     = allResults.flatMap(r => r.jobs)
  const sources     = allResults.filter(r => r.jobs.length > 0).map(r => r.source)
  const errors      = Object.fromEntries(
    allResults.filter(r => r.error).map(r => [r.source, r.error!])
  )
  const totalRaw    = allJobs.length

  // ── 2. Filters ────────────────────────────────────────────────────────────
  let filtered = applyDateFilter(allJobs, params.datePosted)
  filtered     = applySalaryFilter(filtered, params.salaryMin, params.salaryMax)

  if (params.remote) filtered = filtered.filter(j => j.remote)
  if (params.type && params.type !== 'all') {
    filtered = filtered.filter(j => j.type === params.type)
  }

  // ── 3. Deduplicate ────────────────────────────────────────────────────────
  const deduped = deduplicate(filtered)

  // ── 4. Smart ranking ──────────────────────────────────────────────────────
  const ranked = rankJobs(deduped, params)

  return { jobs: ranked, sources, errors, totalRaw }
}
