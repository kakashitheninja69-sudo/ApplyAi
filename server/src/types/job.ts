export type JobType = 'full-time' | 'part-time' | 'contract' | 'remote' | 'internship'
export type JobSource =
  | 'adzuna' | 'jsearch' | 'remotive'
  | 'remoteok' | 'arbeitnow' | 'workingnomads' | 'themuse' | 'reed'
  | 'greenhouse' | 'lever' | 'rss' | 'other'
export type DateFilter = '24h' | '7d' | '30d' | 'any'

export interface NormalizedJob {
  id:          string
  title:       string
  company:     string
  location:    string
  country:     string
  salary:      string | null
  salaryMin:   number | null
  salaryMax:   number | null
  type:        JobType
  description: string
  postedAt:    string       // ISO 8601
  applyUrl:    string
  source:      JobSource
  remote:      boolean
  tags:        string[]
}

export interface SearchParams {
  q:          string
  location:   string
  country:    string
  remote:     boolean
  salaryMin:  number | null
  salaryMax:  number | null
  type:       string
  datePosted: DateFilter
  page:       number
  limit:      number
}

export interface JobsResponse {
  jobs:        NormalizedJob[]
  total:       number
  page:        number
  sources:     JobSource[]
  cachedAt:    string | null
  fetchTimeMs: number
}

export interface SourceResult {
  source: JobSource
  jobs:   NormalizedJob[]
  error?: string
}
