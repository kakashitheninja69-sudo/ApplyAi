import NodeCache from 'node-cache'
import type { NormalizedJob, SearchParams } from '../types/job'

const TTL = parseInt(process.env.CACHE_TTL_SECONDS ?? '300', 10)

const store = new NodeCache({ stdTTL: TTL, checkperiod: 60, useClones: false })

export interface CacheEntry {
  jobs:      NormalizedJob[]
  cachedAt:  string
}

export function cacheKey(params: SearchParams): string {
  return JSON.stringify({
    q:          (params.q          ?? '').toLowerCase().trim(),
    location:   (params.location   ?? '').toLowerCase().trim(),
    country:    (params.country    ?? '').toLowerCase().trim(),
    remote:     params.remote,
    type:       params.type,
    datePosted: params.datePosted,
    salaryMin:  params.salaryMin,
    salaryMax:  params.salaryMax,
  })
}

export function getCache(key: string): CacheEntry | undefined {
  return store.get<CacheEntry>(key)
}

export function setCache(key: string, jobs: NormalizedJob[]): void {
  store.set<CacheEntry>(key, { jobs, cachedAt: new Date().toISOString() })
}

export function cacheStats() {
  return store.getStats()
}
