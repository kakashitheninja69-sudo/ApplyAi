import {
  collection, doc, setDoc, getDoc, getDocs, addDoc,
  deleteDoc, serverTimestamp, query, orderBy, limit, Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { ResumeData } from '@/types/resume'

export interface ResumeListItem {
  id: string
  name: string
  updatedAt: Date
  createdAt: Date
  template: string
}

export interface ResumeVersion {
  id: string
  savedAt: Date
  label: string
}

// ── Main resume CRUD ──────────────────────────────────────────────────────────

export async function saveResume(
  userId: string,
  resumeId: string | null,
  data: ResumeData,
  name: string,
): Promise<string> {
  const ref = collection(db, 'users', userId, 'resumes')
  if (resumeId) {
    await setDoc(doc(ref, resumeId), { name, data, updatedAt: serverTimestamp() }, { merge: true })
    return resumeId
  }
  const created = await addDoc(ref, {
    name,
    data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return created.id
}

export async function loadUserResumes(userId: string): Promise<ResumeListItem[]> {
  const q = query(
    collection(db, 'users', userId, 'resumes'),
    orderBy('updatedAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const dd = d.data()
    return {
      id:        d.id,
      name:      dd.name ?? 'Untitled Resume',
      updatedAt: (dd.updatedAt as Timestamp)?.toDate?.() ?? new Date(),
      createdAt: (dd.createdAt as Timestamp)?.toDate?.() ?? new Date(),
      template:  dd.data?.template ?? 'modern-sidebar',
    }
  })
}

export async function loadResume(userId: string, resumeId: string): Promise<ResumeData | null> {
  const snap = await getDoc(doc(db, 'users', userId, 'resumes', resumeId))
  if (!snap.exists()) return null
  return snap.data().data as ResumeData
}

export async function deleteResume(userId: string, resumeId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'resumes', resumeId))
}

export async function renameResume(userId: string, resumeId: string, name: string): Promise<void> {
  await setDoc(
    doc(db, 'users', userId, 'resumes', resumeId),
    { name, updatedAt: serverTimestamp() },
    { merge: true },
  )
}

// ── Version history ───────────────────────────────────────────────────────────

export async function saveVersion(
  userId: string,
  resumeId: string,
  data: ResumeData,
  label: string,
): Promise<void> {
  await addDoc(
    collection(db, 'users', userId, 'resumes', resumeId, 'versions'),
    { data, savedAt: serverTimestamp(), label },
  )
}

export async function loadVersions(userId: string, resumeId: string): Promise<ResumeVersion[]> {
  const q = query(
    collection(db, 'users', userId, 'resumes', resumeId, 'versions'),
    orderBy('savedAt', 'desc'),
    limit(10),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id:      d.id,
    savedAt: (d.data().savedAt as Timestamp)?.toDate?.() ?? new Date(),
    label:   d.data().label as string,
  }))
}

export async function loadVersionData(
  userId: string,
  resumeId: string,
  versionId: string,
): Promise<ResumeData | null> {
  const snap = await getDoc(
    doc(db, 'users', userId, 'resumes', resumeId, 'versions', versionId),
  )
  if (!snap.exists()) return null
  return snap.data().data as ResumeData
}
