import type { ApiJob } from './jobApi'

const KEY = 'applyai-saved-jobs'

function read(): ApiJob[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}

export function getSavedJobs(): ApiJob[] {
  return read()
}

export function saveJob(job: ApiJob): void {
  const jobs = read().filter(j => j.id !== job.id)
  localStorage.setItem(KEY, JSON.stringify([job, ...jobs]))
}

export function unsaveJob(id: string): void {
  localStorage.setItem(KEY, JSON.stringify(read().filter(j => j.id !== id)))
}

export function isJobSaved(id: string): boolean {
  return read().some(j => j.id === id)
}
