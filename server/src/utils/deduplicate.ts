import type { NormalizedJob } from '../types/job'
import { normalizeText } from './normalize'

// ── Levenshtein distance (O(m×n) DP) ─────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  if (a === b)          return 0
  if (a.length === 0)   return b.length
  if (b.length === 0)   return a.length

  const m = a.length, n = b.length
  const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j)
  let prev: number

  for (let i = 1; i <= m; i++) {
    prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]
      dp[j] = a[i - 1] === b[j - 1]
        ? prev
        : 1 + Math.min(prev, dp[j], dp[j - 1])
      prev = tmp
    }
  }
  return dp[n]
}

// Similarity in [0, 1] — 1 = identical
function similarity(a: string, b: string): number {
  const na = normalizeText(a)
  const nb = normalizeText(b)
  if (na === nb) return 1
  const maxLen = Math.max(na.length, nb.length)
  if (maxLen === 0) return 1
  return 1 - levenshtein(na, nb) / maxLen
}

// ── Completeness score (higher = prefer this copy) ────────────────────────────

function completeness(job: NormalizedJob): number {
  let s = 0
  if (job.salaryMin !== null)   s += 4
  if (job.salary)               s += 2
  if (job.description.length > 200) s += 3
  if (job.description.length > 100) s += 1
  if (job.tags.length > 2)      s += 2
  if (job.applyUrl && !job.applyUrl.includes('adzuna.com/land')) s += 1
  // Source quality preference
  const srcScore = { adzuna: 3, jsearch: 2, remotive: 1, other: 0 } as const
  s += srcScore[job.source] ?? 0
  return s
}

// ── Main dedup function ───────────────────────────────────────────────────────
// Strategy:
//   1. Exact-match dedup on normalised title+company (O(n) hash pass)
//   2. Fuzzy-match dedup within same-company bucket (O(k²) per company, k << n)

export function deduplicate(jobs: NormalizedJob[]): NormalizedJob[] {
  // Pass 1 — exact fingerprint dedup
  const exactMap = new Map<string, NormalizedJob>()
  for (const job of jobs) {
    const fp = `${normalizeText(job.title)}|${normalizeText(job.company)}`
    const existing = exactMap.get(fp)
    if (!existing || completeness(job) > completeness(existing)) {
      exactMap.set(fp, job)
    }
  }

  const candidates = Array.from(exactMap.values())

  // Pass 2 — fuzzy dedup within company buckets
  // Group by normalised company name to keep the inner loop small
  const companyBuckets = new Map<string, NormalizedJob[]>()
  for (const job of candidates) {
    const key = normalizeText(job.company).slice(0, 12) // rough bucket
    const bucket = companyBuckets.get(key) ?? []
    bucket.push(job)
    companyBuckets.set(key, bucket)
  }

  const kept: NormalizedJob[] = []
  for (const bucket of companyBuckets.values()) {
    const dedupedBucket: NormalizedJob[] = []
    for (const job of bucket) {
      let merged = false
      for (let i = 0; i < dedupedBucket.length; i++) {
        const other = dedupedBucket[i]
        const titleSim   = similarity(job.title,   other.title)
        const companySim = similarity(job.company, other.company)
        // Same company + very similar title → duplicate
        if (titleSim > 0.78 && companySim > 0.70) {
          if (completeness(job) > completeness(other)) {
            dedupedBucket[i] = job
          }
          merged = true
          break
        }
      }
      if (!merged) dedupedBucket.push(job)
    }
    kept.push(...dedupedBucket)
  }

  return kept
}
