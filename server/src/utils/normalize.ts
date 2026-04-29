import type { JobType } from '../types/job'

// ── Text helpers ─────────────────────────────────────────────────────────────

export function stripHtml(html: string): string {
  return (html ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function normalizeText(text: string): string {
  return (text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function slugId(source: string, rawId: string | number): string {
  return `${source}::${rawId}`
}

// ── Job-type normalizer ───────────────────────────────────────────────────────

const FULL_TIME_RE  = /full[\s-]?time/i
const PART_TIME_RE  = /part[\s-]?time/i
const CONTRACT_RE   = /contract|freelance|temp/i
const INTERNSHIP_RE = /internship|intern/i
const REMOTE_RE     = /remote/i

export function parseJobType(raw: string): JobType {
  if (!raw) return 'full-time'
  if (INTERNSHIP_RE.test(raw)) return 'internship'
  if (PART_TIME_RE.test(raw))  return 'part-time'
  if (CONTRACT_RE.test(raw))   return 'contract'
  if (REMOTE_RE.test(raw))     return 'remote'
  if (FULL_TIME_RE.test(raw))  return 'full-time'
  return 'full-time'
}

// ── Salary parser ─────────────────────────────────────────────────────────────

export function parseSalary(raw: string | null | undefined): {
  display: string | null; min: number | null; max: number | null
} {
  if (!raw || !raw.trim()) return { display: null, min: null, max: null }

  // Strip HTML / noise
  const clean = raw.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').trim()
  if (!clean) return { display: null, min: null, max: null }

  // Extract numbers (handle K suffix)
  const nums = Array.from(
    clean.matchAll(/\$?([\d,]+(?:\.\d+)?)\s*k?/gi),
    m => {
      const n = parseFloat(m[1].replace(/,/g, ''))
      return /k$/i.test(m[0]) ? n * 1000 : n
    }
  ).filter(n => n > 1000) // ignore e.g. "1 year"

  if (nums.length === 0) return { display: clean, min: null, max: null }
  if (nums.length === 1) return { display: clean, min: nums[0], max: nums[0] }
  return { display: clean, min: Math.min(...nums), max: Math.max(...nums) }
}

// ── Country inference ─────────────────────────────────────────────────────────

const COUNTRY_PATTERNS: [RegExp, string][] = [
  [/\bcanada\b|\bca\b|\bontario\b|\bquebec\b|\bbritish columbia\b|\balberta\b|\bbc\b/i, 'CA'],
  [/\bunited states\b|\busa\b|\bu\.s\.a?\b|\bamerica\b/i,                               'US'],
  [/\bunited kingdom\b|\buk\b|\bengland\b|\bscotland\b|\bwales\b|\blondon\b/i,          'GB'],
  [/\baustralia\b|\bau\b|\bsydney\b|\bmelbourne\b/i,                                    'AU'],
  [/\bgermany\b|\bdeutschland\b|\bberlin\b/i,                                           'DE'],
  [/\bfrance\b|\bparis\b/i,                                                             'FR'],
  [/\bindia\b|\bbangalore\b|\bmumbai\b|\bdelhi\b/i,                                     'IN'],
  [/\bnetherlands\b|\bamsterdam\b/i,                                                    'NL'],
  [/\bsingapore\b/i,                                                                    'SG'],
  [/\bpoland\b|\bwarsaw\b/i,                                                            'PL'],
  [/\bspain\b|\bmadrid\b|\bbarcelona\b/i,                                               'ES'],
  [/\bbrazil\b|\bsao paulo\b/i,                                                         'BR'],
  [/\bnew zealand\b|\bauckland\b/i,                                                     'NZ'],
]

export function inferCountry(location: string): string {
  for (const [re, code] of COUNTRY_PATTERNS) {
    if (re.test(location)) return code
  }
  return 'US'
}

// ── Adzuna country code map ───────────────────────────────────────────────────

const ADZUNA_MAP: Record<string, string> = {
  CA: 'ca', US: 'us', GB: 'gb', AU: 'au',
  DE: 'de', FR: 'fr', IN: 'in', NL: 'nl',
  SG: 'sg', PL: 'pl', ES: 'es', BR: 'br',
  NZ: 'nz', AT: 'at', BE: 'be', IT: 'it',
  MX: 'mx', ZA: 'za', RU: 'ru',
}

export function adzunaCountry(countryCode: string, locationFallback: string): string {
  const code = countryCode.toUpperCase()
  if (ADZUNA_MAP[code]) return ADZUNA_MAP[code]
  const inferred = inferCountry(locationFallback)
  return ADZUNA_MAP[inferred] ?? 'us'
}

// ── Posted-at formatter ───────────────────────────────────────────────────────

export function formatPostedAt(raw: string | number | null | undefined): string {
  if (!raw) return new Date().toISOString()
  try {
    const d = typeof raw === 'number'
      ? new Date(raw * 1000)
      : new Date(String(raw))
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
  } catch {
    return new Date().toISOString()
  }
}
