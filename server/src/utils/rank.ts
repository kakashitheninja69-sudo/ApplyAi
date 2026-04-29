import type { NormalizedJob, SearchParams } from '../types/job'
import { normalizeText } from './normalize'

// ── Recency score: 1.0 (just posted) → 0.0 (30+ days) ───────────────────────

function recencyScore(postedAt: string): number {
  try {
    const ageMs  = Date.now() - new Date(postedAt).getTime()
    const ageDays = ageMs / 86_400_000
    if (ageDays <= 0)  return 1.0
    if (ageDays <= 1)  return 0.95
    if (ageDays <= 3)  return 0.85
    if (ageDays <= 7)  return 0.70
    if (ageDays <= 14) return 0.50
    if (ageDays <= 30) return 0.25
    return 0.05
  } catch {
    return 0.3
  }
}

// ── Keyword relevance: title match > description match ────────────────────────

function relevanceScore(job: NormalizedJob, q: string): number {
  if (!q) return 0.5
  const kw    = normalizeText(q)
  const title = normalizeText(job.title)
  const desc  = normalizeText(job.description)
  const tags  = job.tags.map(t => normalizeText(t)).join(' ')

  const words   = kw.split(' ').filter(Boolean)
  let score = 0

  for (const word of words) {
    if (title.includes(word))             score += 0.4
    if (tags.includes(word))              score += 0.15
    if (desc.includes(word))              score += 0.05
    if (title.startsWith(word))           score += 0.1  // bonus: starts with kw
  }

  // Exact full-phrase match in title
  if (title.includes(kw)) score += 0.3

  return Math.min(score / Math.max(words.length, 1), 1)
}

// ── Salary bonus ──────────────────────────────────────────────────────────────

function salaryScore(job: NormalizedJob): number {
  if (job.salaryMin !== null) return 0.1
  if (job.salary)             return 0.05
  return 0
}

// ── Source trust ─────────────────────────────────────────────────────────────

const SOURCE_TRUST: Record<string, number> = {
  adzuna:   0.08,
  jsearch:  0.06,
  remotive: 0.04,
  other:    0.0,
}

// ── Date filter gate ─────────────────────────────────────────────────────────

const DATE_FILTER_MS: Record<string, number> = {
  '24h': 86_400_000,
  '7d':  7  * 86_400_000,
  '30d': 30 * 86_400_000,
  any:   Infinity,
}

export function applyDateFilter(jobs: NormalizedJob[], datePosted: string): NormalizedJob[] {
  const windowMs = DATE_FILTER_MS[datePosted] ?? Infinity
  if (!isFinite(windowMs)) return jobs
  const cutoff = Date.now() - windowMs
  return jobs.filter(j => {
    try { return new Date(j.postedAt).getTime() >= cutoff }
    catch { return true }
  })
}

// ── Salary range filter ───────────────────────────────────────────────────────

export function applySalaryFilter(
  jobs: NormalizedJob[],
  min: number | null,
  max: number | null,
): NormalizedJob[] {
  if (min === null && max === null) return jobs
  return jobs.filter(j => {
    // If job has no salary info, pass it through (don't exclude)
    if (j.salaryMin === null && j.salaryMax === null) return true
    const jMin = j.salaryMin ?? 0
    const jMax = j.salaryMax ?? jMin
    if (min !== null && jMax < min) return false
    if (max !== null && jMin > max) return false
    return true
  })
}

// ── Main ranking ──────────────────────────────────────────────────────────────

export function rankJobs(jobs: NormalizedJob[], params: SearchParams): NormalizedJob[] {
  type Scored = { job: NormalizedJob; score: number }

  const scored: Scored[] = jobs.map(job => ({
    job,
    score:
      recencyScore(job.postedAt)   * 0.45 +
      relevanceScore(job, params.q) * 0.40 +
      salaryScore(job)             +
      (SOURCE_TRUST[job.source] ?? 0),
  }))

  scored.sort((a, b) => b.score - a.score)
  return scored.map(s => s.job)
}
