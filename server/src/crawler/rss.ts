// Generic RSS job feed crawler — parses standard RSS 2.0 <item> blocks
import type { NormalizedJob, SourceResult } from '../types/job'
import { stripHtml, slugId, formatPostedAt, inferCountry } from '../utils/normalize'

export interface RssFeedConfig {
  name:    string
  url:     string
  source?: string  // defaults to 'rss'
}

// ── Minimal RSS XML parser (no external deps) ─────────────────────────────────

function extract(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/${tag}>`, 'i')
  return (xml.match(re)?.[1] ?? '').trim()
}

function extractAll(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/${tag}>`, 'gi')
  const results: string[] = []
  let m
  while ((m = re.exec(xml)) !== null) results.push(m[1].trim())
  return results
}

function parseItems(xml: string): string[] {
  return extractAll(xml, 'item')
}

function itemToJob(item: string, feedName: string, index: number): NormalizedJob | null {
  const title   = stripHtml(extract(item, 'title'))
  const link    = extract(item, 'link') || extract(item, 'guid')
  const desc    = stripHtml(extract(item, 'description')).slice(0, 500)
  const pubDate = extract(item, 'pubDate') || extract(item, 'dc:date')
  const author  = extract(item, 'author') || extract(item, 'dc:creator') || feedName

  // Skip if no title or link
  if (!title || !link) return null

  // Try to extract company from common patterns
  // e.g. "Senior Engineer at Stripe" or "[Stripe] Senior Engineer"
  let company = author
  let cleanTitle = title
  const atMatch  = title.match(/^(.+?)\s+at\s+(.+)$/i)
  const brkMatch = title.match(/^\[(.+?)\]\s+(.+)$/)
  if (atMatch)  { cleanTitle = atMatch[1]; company = atMatch[2] }
  if (brkMatch) { cleanTitle = brkMatch[2]; company = brkMatch[1] }

  const location = extract(item, 'location') || 'Remote'

  return {
    id:          slugId('rss', `${feedName}-${index}`),
    title:       cleanTitle,
    company,
    location,
    country:     inferCountry(location),
    salary:      null,
    salaryMin:   null,
    salaryMax:   null,
    type:        'full-time',
    description: desc,
    postedAt:    formatPostedAt(pubDate),
    applyUrl:    link,
    source:      'rss',
    remote:      /remote/i.test(title) || /remote/i.test(location),
    tags:        [],
  }
}

// ── Public crawl function ─────────────────────────────────────────────────────

export async function crawlRssFeed(feed: RssFeedConfig, keyword = ''): Promise<SourceResult> {
  try {
    const res = await fetch(feed.url, {
      headers: {
        'User-Agent': 'ApplyAI Job Aggregator (applyai-dab34.web.app)',
        Accept:       'application/rss+xml, application/xml, text/xml',
      },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) throw new Error(`RSS ${feed.name} HTTP ${res.status}`)

    const xml   = await res.text()
    const items = parseItems(xml)
    const kw    = keyword.toLowerCase().trim()

    const jobs = items
      .map((item, i) => itemToJob(item, feed.name, i))
      .filter((j): j is NormalizedJob => j !== null)
      .filter(j => !kw || j.title.toLowerCase().includes(kw) || j.description.toLowerCase().includes(kw))
      .slice(0, 30)

    return { source: 'rss', jobs }
  } catch (err) {
    return { source: 'rss', jobs: [], error: String(err) }
  }
}

// ── Pre-configured feeds ──────────────────────────────────────────────────────

export const RSS_FEEDS: RssFeedConfig[] = [
  {
    name: 'WeWorkRemotely',
    url:  'https://weworkremotely.com/remote-jobs.rss',
  },
  {
    name: 'WeWorkRemotely-FullStack',
    url:  'https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss',
  },
  {
    name: 'Jobicy',
    url:  'https://jobicy.com/?feed=job_feed',
  },
  {
    name: 'EuropeRemotely',
    url:  'https://europeremotely.com/feed.rss',
  },
]

export async function crawlAllRssFeeds(keyword: string): Promise<SourceResult> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(f => crawlRssFeed(f, keyword))
  )
  const allJobs = results
    .filter((r): r is PromiseFulfilledResult<SourceResult> => r.status === 'fulfilled')
    .flatMap(r => r.value.jobs)

  return { source: 'rss', jobs: allJobs }
}
