import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useResumeStore } from '@/store/resumeStore'
import {
  loadUserResumes, loadResume, deleteResume, renameResume,
  loadVersions, loadVersionData, saveVersion,
  type ResumeListItem, type ResumeVersion,
} from '@/lib/firestore'
import { cn } from '@/lib/utils'

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const TEMPLATE_LABELS: Record<string, string> = {
  'ats-clean':            'ATS Clean',
  'google-standard':      'Google Standard',
  'amazon-results':       'Amazon Results',
  'meta-impact':          'Meta Impact',
  'modern-sidebar':       'Modern Sidebar',
  'classic-professional': 'Classic Professional',
  'minimal-clean':        'Minimal Clean',
}

// ── Version History Modal ─────────────────────────────────────────────────────
function VersionModal({
  userId, resumeId, onRestore, onClose,
}: {
  userId: string
  resumeId: string
  onRestore: (data: import('@/types/resume').ResumeData) => void
  onClose: () => void
}) {
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [loading, setLoading]   = useState(true)
  const [restoring, setRestoring] = useState<string | null>(null)

  useEffect(() => {
    loadVersions(userId, resumeId)
      .then(setVersions)
      .finally(() => setLoading(false))
  }, [userId, resumeId])

  async function handleRestore(v: ResumeVersion) {
    setRestoring(v.id)
    const data = await loadVersionData(userId, resumeId, v.id)
    if (data) onRestore(data)
    setRestoring(null)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-on-background text-[15px]">Version History</h3>
            <p className="text-[12px] text-on-surface-variant mt-0.5">Last 10 saved versions</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: '24px' }}>
                progress_activity
              </span>
            </div>
          ) : versions.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#cbd5e1' }}>
                history
              </span>
              <p className="text-[13px] mt-2">No versions saved yet</p>
              <p className="text-[11px] mt-1">Versions are saved each time you use "Save Version"</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {versions.map((v, idx) => (
                <div key={v.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-[13px] font-medium text-on-background">
                      {idx === 0 ? '✦ Latest' : `Version ${versions.length - idx}`}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">{timeAgo(v.savedAt)}</p>
                  </div>
                  <button
                    onClick={() => handleRestore(v)}
                    disabled={!!restoring}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-primary hover:bg-primary/8 transition-colors"
                  >
                    {restoring === v.id ? (
                      <span className="material-symbols-outlined animate-spin" style={{ fontSize: '14px' }}>
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                        restore
                      </span>
                    )}
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Resume Card ───────────────────────────────────────────────────────────────
function ResumeCard({
  resume, userId, onEdit, onDelete, onVersionRestore,
}: {
  resume: ResumeListItem
  userId: string
  onEdit: () => void
  onDelete: () => void
  onVersionRestore: (data: import('@/types/resume').ResumeData) => void
}) {
  const [renaming, setRenaming]     = useState(false)
  const [nameInput, setNameInput]   = useState(resume.name)
  const [showHistory, setShowHistory] = useState(false)
  const [deleting, setDeleting]     = useState(false)

  async function handleRename() {
    if (nameInput.trim() && nameInput !== resume.name) {
      await renameResume(userId, resume.id, nameInput.trim())
    }
    setRenaming(false)
  }

  async function handleDelete() {
    setDeleting(true)
    await deleteResume(userId, resume.id)
    onDelete()
  }

  const templateLabel = TEMPLATE_LABELS[resume.template] ?? resume.template

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
        {/* Preview area */}
        <div
          className="h-32 flex items-center justify-center cursor-pointer relative"
          style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8edff 100%)' }}
          onClick={onEdit}
        >
          <span
            className="material-symbols-outlined opacity-20 group-hover:opacity-40 transition-opacity"
            style={{ fontSize: '56px', color: '#1a56db' }}
          >
            description
          </span>
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-white/90 px-4 py-2 rounded-xl text-[13px] font-semibold text-primary shadow-sm">
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>edit</span>
              Open Resume
            </span>
          </div>
        </div>

        <div className="p-4">
          {/* Name */}
          {renaming ? (
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenaming(false) }}
              className="w-full text-[14px] font-semibold border-b border-primary outline-none bg-transparent pb-0.5 text-on-background"
            />
          ) : (
            <button
              className="flex items-center gap-1 group/name w-full text-left"
              onClick={() => setRenaming(true)}
            >
              <span className="text-[14px] font-semibold text-on-background truncate">{resume.name}</span>
              <span className="material-symbols-outlined opacity-0 group-hover/name:opacity-60 transition-opacity shrink-0" style={{ fontSize: '14px' }}>
                edit
              </span>
            </button>
          )}

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-on-surface-variant">{templateLabel}</span>
            <span className="text-[11px] text-gray-300">·</span>
            <span className="text-[11px] text-on-surface-variant">{timeAgo(resume.updatedAt)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 mt-3">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>edit_document</span>
              Edit
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant text-[12px] font-medium hover:text-primary hover:bg-primary/8 transition-colors"
              title="Version history"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>history</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant text-[12px] font-medium hover:text-error hover:bg-error/8 transition-colors"
              title="Delete resume"
            >
              {deleting ? (
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: '14px' }}>progress_activity</span>
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {showHistory && (
        <VersionModal
          userId={userId}
          resumeId={resume.id}
          onRestore={(data) => { setShowHistory(false); onVersionRestore(data) }}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { loadResumeData, setResumeId, setResumeName, setSavedResumes, resetBuilder } = useResumeStore()
  const [resumes, setResumes]   = useState<ResumeListItem[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!currentUser) { navigate('/'); return }
    loadUserResumes(currentUser.uid)
      .then((list) => { setResumes(list); setSavedResumes(list) })
      .finally(() => setLoading(false))
  }, [currentUser])

  async function handleEdit(resume: ResumeListItem) {
    if (!currentUser) return
    const data = await loadResume(currentUser.uid, resume.id)
    if (data) {
      loadResumeData(data, resume.id, resume.name)
      navigate('/builder')
    }
  }

  function handleVersionRestore(
    resume: ResumeListItem,
    data: import('@/types/resume').ResumeData,
  ) {
    loadResumeData(data, resume.id, resume.name)
    navigate('/builder')
  }

  function handleDelete(id: string) {
    setResumes((prev) => prev.filter((r) => r.id !== id))
  }

  function handleNewResume() {
    resetBuilder('modern-sidebar', 'primary')
    setResumeId(null)
    setResumeName('My Resume')
    navigate('/onboarding')
  }

  function handleSaveVersion(resume: ResumeListItem) {
    // Opens builder for that resume, user can save version from there
    handleEdit(resume)
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
            </button>
            <span className="font-bold text-primary text-lg">ApplyAI</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[13px] font-bold">
              {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
            </div>
            <span className="text-[13px] font-medium text-on-surface hidden sm:block">
              {currentUser.displayName || currentUser.email}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Title row */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-on-background">My Resumes</h1>
            <p className="text-[14px] text-on-surface-variant mt-1">
              {loading ? 'Loading…' : `${resumes.length} resume${resumes.length !== 1 ? 's' : ''} saved to cloud`}
            </p>
          </div>
          <button
            onClick={handleNewResume}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[14px] text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #003fb1 0%, #0055f5 100%)', boxShadow: '0 2px 12px rgba(0,63,177,0.25)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            New Resume
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: '32px' }}>
              progress_activity
            </span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#cbd5e1' }}>
              description
            </span>
            <h3 className="text-[18px] font-semibold text-on-background mt-4">No resumes yet</h3>
            <p className="text-[14px] text-on-surface-variant mt-1 mb-6">
              Create your first resume to get started
            </p>
            <button
              onClick={handleNewResume}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[14px] text-white"
              style={{ background: 'linear-gradient(135deg, #003fb1 0%, #0055f5 100%)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              Create Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                userId={currentUser.uid}
                onEdit={() => handleEdit(resume)}
                onDelete={() => handleDelete(resume.id)}
                onVersionRestore={(data) => handleVersionRestore(resume, data)}
              />
            ))}
            {/* New resume card */}
            <button
              onClick={handleNewResume}
              className="flex flex-col items-center justify-center h-[232px] rounded-2xl border-2 border-dashed border-gray-200 text-on-surface-variant hover:border-primary/40 hover:text-primary hover:bg-primary/3 transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>add_circle</span>
              <span className="text-[13px] font-semibold mt-2">New Resume</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
