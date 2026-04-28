import type { ResumeData } from '@/types/resume'
import { generateId } from '@/lib/utils'

// All resume data lives in localStorage — no cloud required.
//   applyai-resumes          → StoredResume[]
//   applyai-versions-{id}   → StoredVersion[] (last 10 per resume)

const RESUMES_KEY = 'applyai-resumes'
const MAX_VERSIONS = 10

export interface ResumeListItem {
  id: string
  name: string
  updatedAt: Date
  createdAt: Date
  template: string
  accentColor: string
}

export interface ResumeVersion {
  id: string
  savedAt: Date
  label: string
}

interface StoredResume {
  id: string; name: string; template: string
  updatedAt: string; createdAt: string; data: ResumeData
}

interface StoredVersion {
  id: string; savedAt: string; label: string; data: ResumeData
}

function readResumes(): StoredResume[] {
  try { return JSON.parse(localStorage.getItem(RESUMES_KEY) ?? '[]') } catch { return [] }
}

function writeResumes(list: StoredResume[]) {
  localStorage.setItem(RESUMES_KEY, JSON.stringify(list))
}

const vKey = (id: string) => `applyai-versions-${id}`

// ── Resume CRUD ───────────────────────────────────────────────────────────────

export function saveResume(
  resumeId: string | null, data: ResumeData, name: string,
): string {
  const list = readResumes()
  const now  = new Date().toISOString()
  if (resumeId) {
    const idx = list.findIndex((r) => r.id === resumeId)
    if (idx >= 0) {
      list[idx] = { ...list[idx], name, data, template: data.template, updatedAt: now }
    } else {
      list.push({ id: resumeId, name, template: data.template, data, createdAt: now, updatedAt: now })
    }
    writeResumes(list)
    return resumeId
  }
  const id = generateId()
  list.push({ id, name, template: data.template, data, createdAt: now, updatedAt: now })
  writeResumes(list)
  return id
}

export function loadAllResumes(): ResumeListItem[] {
  return readResumes()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map((r) => ({
      id: r.id, name: r.name,
      updatedAt:   new Date(r.updatedAt),
      createdAt:   new Date(r.createdAt),
      template:    r.template,
      accentColor: r.data?.accentColor ?? 'primary',
    }))
}

export function loadResume(resumeId: string): ResumeData | null {
  return readResumes().find((r) => r.id === resumeId)?.data ?? null
}

export function deleteResume(resumeId: string): void {
  writeResumes(readResumes().filter((r) => r.id !== resumeId))
  localStorage.removeItem(vKey(resumeId))
}

export function renameResume(resumeId: string, name: string): void {
  const list = readResumes()
  const idx  = list.findIndex((r) => r.id === resumeId)
  if (idx >= 0) { list[idx].name = name; list[idx].updatedAt = new Date().toISOString(); writeResumes(list) }
}

// ── Version history ───────────────────────────────────────────────────────────

export function saveVersion(resumeId: string, data: ResumeData, label: string): void {
  let versions: StoredVersion[] = []
  try { versions = JSON.parse(localStorage.getItem(vKey(resumeId)) ?? '[]') } catch {}
  versions.unshift({ id: generateId(), savedAt: new Date().toISOString(), label, data })
  localStorage.setItem(vKey(resumeId), JSON.stringify(versions.slice(0, MAX_VERSIONS)))
}

export function loadVersions(resumeId: string): ResumeVersion[] {
  try {
    const v: StoredVersion[] = JSON.parse(localStorage.getItem(vKey(resumeId)) ?? '[]')
    return v.map((x) => ({ id: x.id, savedAt: new Date(x.savedAt), label: x.label }))
  } catch { return [] }
}

export function loadVersionData(resumeId: string, versionId: string): ResumeData | null {
  try {
    const v: StoredVersion[] = JSON.parse(localStorage.getItem(vKey(resumeId)) ?? '[]')
    return v.find((x) => x.id === versionId)?.data ?? null
  } catch { return null }
}
