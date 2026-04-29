import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useResumeStore } from '@/store/resumeStore'
import {
  loadAllResumes, loadResume, deleteResume, renameResume,
  loadVersions, loadVersionData,
  type ResumeListItem, type ResumeVersion,
} from '@/lib/localResumes'
import type { ResumeData, AccentColor, TemplateId } from '@/types/resume'
import TemplateThumbnail from '@/components/resume-templates/TemplateThumbnail'

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const diff  = Date.now() - date.getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function computeScore(data: ResumeData): number {
  let score = 0
  if (data.contact?.name)     score += 10
  if (data.contact?.email)    score += 10
  if (data.contact?.phone)    score += 5
  if (data.contact?.location) score += 5
  if (data.summary)           score += 15
  const goodWork = data.work?.filter(w => w.company && w.bullets.filter(Boolean).length >= 2) ?? []
  if (goodWork.length >= 1)   score += 15
  if (goodWork.length >= 2)   score += 10
  if (data.education?.some(e => e.institution)) score += 15
  if ((data.skills?.length ?? 0) >= 3) score += 10
  if ((data.skills?.length ?? 0) >= 6) score += 5
  return score
}

const TEMPLATE_LABELS: Record<string, string> = {
  'ats-clean':            'ATS Clean',
  'google-standard':      'Google Standard',
  'amazon-results':       'Amazon Results',
  'meta-impact':          'Meta Impact',
  'faang-compact':        'FAANG Compact',
  'modern-sidebar':       'Modern Sidebar',
  'classic-professional': 'Classic Professional',
  'minimal-clean':        'Minimal Clean',
  'executive':            'Executive',
  'consulting-impact':    'Consulting Impact',
  'banking-formal':       'Banking Formal',
  'academic-cv':          'Academic CV',
  'healthcare-pro':       'Healthcare Pro',
  'split-modern':         'Split Modern',
  'timeline-classic':     'Timeline Classic',
  'bold-header':          'Bold Header',
  'two-column-grid':      'Two Column',
  'compact-elite':        'Compact Elite',
  'infographic-pro':      'Infographic Pro',
  'startup-modern':       'Startup Modern',
  'creative-portfolio':   'Creative Portfolio',
  'data-science':         'Data Science',
  'product-manager':      'Product Manager',
  'dark-elegant':         'Dark Elegant',
}

// ── Score Badge ───────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#16a34a' : score >= 55 ? '#d97706' : '#dc2626'
  const bg    = score >= 80 ? '#f0fdf4' : score >= 55 ? '#fffbeb' : '#fef2f2'
  const icon  = score >= 80 ? 'check_circle' : score >= 55 ? 'warning' : 'error'
  return (
    <div
      className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold z-10"
      style={{ background: bg, color, border: `1px solid ${color}28` }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '10px', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      {score}
    </div>
  )
}

// ── Version History Modal ─────────────────────────────────────────────────────

function VersionModal({
  resumeId, onRestore, onClose,
}: {
  resumeId: string
  onRestore: (data: ResumeData) => void
  onClose: () => void
}) {
  const [versions] = useState<ResumeVersion[]>(() => loadVersions(resumeId))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-on-background text-[15px]">Version History</h3>
            <p className="text-[12px] text-on-surface-variant mt-0.5">Last {versions.length} saved versions</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {versions.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#cbd5e1' }}>history</span>
              <p className="text-[13px] mt-2">No versions saved yet</p>
              <p className="text-[11px] mt-1 text-on-surface-variant">Use "Save Version" in the builder to snapshot a restore point</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {versions.map((v, idx) => (
                <div key={v.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-[13px] font-medium text-on-background">
                      {idx === 0 ? '✦ Latest' : `Version ${versions.length - idx}`}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">{v.label} · {timeAgo(v.savedAt)}</p>
                  </div>
                  <button
                    onClick={() => { const d = loadVersionData(resumeId, v.id); if (d) onRestore(d) }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-primary hover:bg-primary/8 transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>restore</span>
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

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteModal({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-7" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-error" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>delete</span>
          </div>
          <h3 className="font-semibold text-on-background text-[16px] mb-1">Delete Resume?</h3>
          <p className="text-[13px] text-on-surface-variant mb-6">
            "<span className="font-medium text-on-background">{name}</span>" will be permanently removed from this device.
          </p>
          <div className="flex gap-2.5 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-on-surface-variant hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-error text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Resume Card ───────────────────────────────────────────────────────────────

function ResumeCard({
  resume, onEdit, onDelete, onVersionRestore,
}: {
  resume: ResumeListItem
  onEdit: () => void
  onDelete: () => void
  onVersionRestore: (data: ResumeData) => void
}) {
  const [renaming,    setRenaming]    = useState(false)
  const [nameInput,   setNameInput]   = useState(resume.name)
  const [showHistory, setShowHistory] = useState(false)
  const [showDelete,  setShowDelete]  = useState(false)
  const [hovered,     setHovered]     = useState(false)
  const [score,       setScore]       = useState<number | null>(null)

  useEffect(() => {
    const data = loadResume(resume.id)
    if (data) setScore(computeScore(data))
  }, [resume.id])

  function handleRename() {
    const trimmed = nameInput.trim()
    if (trimmed && trimmed !== resume.name) renameResume(resume.id, trimmed)
    setRenaming(false)
  }

  return (
    <>
      <div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{
          boxShadow: hovered
            ? '0 8px 28px rgba(0,63,177,0.12), 0 2px 8px rgba(0,0,0,0.06)'
            : '0 1px 4px rgba(0,0,0,0.06)',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          transition: 'box-shadow 0.22s ease, transform 0.22s ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Thumbnail preview ── */}
        <div
          className="relative cursor-pointer overflow-hidden"
          style={{ height: '196px', background: '#f1f5f9' }}
          onClick={onEdit}
        >
          <TemplateThumbnail
            templateId={resume.template as TemplateId}
            accentColor={(resume.accentColor as AccentColor) ?? 'primary'}
          />

          {/* Hover "Edit Resume" overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
            style={{
              background: 'rgba(15,23,42,0.42)',
              opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? 'auto' : 'none',
            }}
          >
            <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl text-[13px] font-semibold text-on-background shadow-lg">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', fontVariationSettings: "'FILL' 1" }}>edit_document</span>
              Edit Resume
            </div>
          </div>

          {/* Completeness score badge */}
          {score !== null && <ScoreBadge score={score} />}
        </div>

        {/* ── Card body ── */}
        <div className="px-4 pt-3 pb-4">
          {renaming ? (
            <input
              autoFocus
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onBlur={handleRename}
              onKeyDown={e => {
                if (e.key === 'Enter') handleRename()
                if (e.key === 'Escape') { setNameInput(resume.name); setRenaming(false) }
              }}
              className="w-full text-[14px] font-semibold border-b-2 border-primary outline-none bg-transparent pb-0.5 text-on-background"
            />
          ) : (
            <button
              className="flex items-center gap-1 group/name w-full text-left"
              onClick={() => setRenaming(true)}
              title="Click to rename"
            >
              <span className="text-[14px] font-semibold text-on-background truncate">{resume.name}</span>
              <span
                className="material-symbols-outlined opacity-0 group-hover/name:opacity-50 transition-opacity shrink-0"
                style={{ fontSize: '13px' }}
              >
                edit
              </span>
            </button>
          )}

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-on-surface-variant">
              {TEMPLATE_LABELS[resume.template] ?? resume.template}
            </span>
            <span className="text-[11px] text-gray-300">·</span>
            <span className="text-[11px] text-on-surface-variant">{timeAgo(resume.updatedAt)}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-3">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>edit_document</span>
              Edit
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:text-primary hover:bg-primary/8 transition-colors"
              title="Version history"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>history</span>
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:text-error hover:bg-error/8 transition-colors"
              title="Delete resume"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
            </button>
          </div>
        </div>
      </div>

      {showHistory && (
        <VersionModal
          resumeId={resume.id}
          onRestore={data => { setShowHistory(false); onVersionRestore(data) }}
          onClose={() => setShowHistory(false)}
        />
      )}
      {showDelete && (
        <DeleteModal
          name={resume.name}
          onConfirm={() => { setShowDelete(false); deleteResume(resume.id); onDelete() }}
          onClose={() => setShowDelete(false)}
        />
      )}
    </>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-7">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)' }}
        >
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}
          >
            description
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-green-400 flex items-center justify-center shadow-sm">
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
        </div>
      </div>
      <h2 className="text-[20px] font-bold text-on-background mb-2">No resumes yet</h2>
      <p className="text-[14px] text-on-surface-variant max-w-xs mb-8 leading-relaxed">
        Build a tailored resume for each job in minutes. AI assists with every section.
      </p>
      <button
        onClick={onCreate}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[14px] text-white hover:opacity-90 active:scale-[0.98] transition-all"
        style={{
          background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)',
          boxShadow: '0 4px 16px rgba(0,63,177,0.25)',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
        Build My First Resume
      </button>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type TabId = 'resumes' | 'cover-letters' | 'jobs' | 'profile'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'resumes',       label: 'Resumes',       icon: 'description' },
  { id: 'cover-letters', label: 'Cover Letters',  icon: 'mail' },
  { id: 'jobs',          label: 'Jobs',           icon: 'work' },
  { id: 'profile',       label: 'Profile',        icon: 'person' },
]

export default function DashboardPage() {
  const navigate  = useNavigate()
  const { currentUser }                                       = useAuth()
  const { loadResumeData, setResumeId, setResumeName, resetBuilder } = useResumeStore()

  const [resumes,   setResumes]   = useState<ResumeListItem[]>([])
  const [search,    setSearch]    = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('resumes')

  useEffect(() => { setResumes(loadAllResumes()) }, [])

  const filtered = useMemo(
    () => search.trim()
      ? resumes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
      : resumes,
    [resumes, search],
  )

  function handleEdit(resume: ResumeListItem) {
    const data = loadResume(resume.id)
    if (data) { loadResumeData(data, resume.id, resume.name); navigate('/builder') }
  }

  function handleVersionRestore(resume: ResumeListItem, data: ResumeData) {
    loadResumeData(data, resume.id, resume.name)
    navigate('/builder')
  }

  function handleNewResume() {
    resetBuilder('modern-sidebar', 'primary')
    setResumeId(null)
    setResumeName('My Resume')
    navigate('/onboarding')
  }

  const userInitial = (currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase()
  const userName    = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>

      {/* ── Sticky top navigation ────────────────────────────────────────── */}
      <header
        className="bg-white sticky top-0 z-30"
        style={{ borderBottom: '1px solid #e8ecf0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14 gap-4">

            {/* Back + Logo */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => navigate(-1)}
                title="Go back"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/8 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              </button>
              <button onClick={() => navigate('/')} className="flex items-center gap-2">
                <span className="text-[18px] font-bold text-primary tracking-tight">ApplyAI</span>
              </button>
            </div>

            {/* Tab nav (desktop) */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {TABS.map(tab => {
                const active      = activeTab === tab.id
                const comingSoon  = tab.id === 'cover-letters'
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'jobs') { navigate('/jobs'); return }
                      if (!comingSoon) setActiveTab(tab.id)
                    }}
                    className={[
                      'relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors',
                      active
                        ? 'text-primary'
                        : comingSoon
                          ? 'text-gray-300 cursor-default'
                          : 'text-on-surface-variant hover:text-on-background hover:bg-gray-50',
                    ].join(' ')}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{tab.icon}</span>
                    {tab.label}
                    {tab.id === 'resumes' && resumes.length > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {resumes.length}
                      </span>
                    )}
                    {comingSoon && (
                      <span className="text-[9px] font-semibold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute bottom-[-1px] left-3 right-3 h-[2px] bg-primary rounded-full" />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Right side: New Resume + Avatar */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleNewResume}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>add</span>
                New Resume
              </button>
              {currentUser ? (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold select-none"
                  style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
                  title={currentUser.email ?? ''}
                >
                  {userInitial}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="text-[13px] font-medium text-on-surface-variant hover:text-primary transition-colors"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* ── RESUMES TAB ── */}
        {activeTab === 'resumes' && (
          <>
            {/* Page hero */}
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <h1 className="text-[22px] font-bold text-on-background">
                  {resumes.length === 0 ? 'Create your first resume' : `Welcome back, ${userName}`}
                </h1>
                <p className="text-[14px] text-on-surface-variant mt-0.5">
                  {resumes.length === 0
                    ? 'Build a tailored resume in minutes with AI assistance'
                    : `${resumes.length} resume${resumes.length !== 1 ? 's' : ''} saved on this device`}
                </p>
              </div>
              {/* Mobile "New" button */}
              <button
                onClick={handleNewResume}
                className="sm:hidden flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-semibold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>add</span>
                New
              </button>
            </div>

            {resumes.length === 0 ? (
              <EmptyState onCreate={handleNewResume} />
            ) : (
              <>
                {/* Search bar (shown when ≥ 3 resumes) */}
                {resumes.length >= 3 && (
                  <div className="relative mb-6 max-w-xs">
                    <span
                      className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                      style={{ fontSize: '17px' }}
                    >
                      search
                    </span>
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search resumes…"
                      className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-on-background placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-background"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Resume grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map(resume => (
                    <ResumeCard
                      key={resume.id}
                      resume={resume}
                      onEdit={() => handleEdit(resume)}
                      onDelete={() => setResumes(loadAllResumes())}
                      onVersionRestore={data => handleVersionRestore(resume, data)}
                    />
                  ))}

                  {/* Dashed "New Resume" card — hidden when search is active */}
                  {!search && (
                    <button
                      onClick={handleNewResume}
                      className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200"
                      style={{ height: '299px', borderColor: '#d1d5db' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#d1d5db')}
                    >
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-gray-100 group-hover:bg-primary/10 transition-colors">
                        <span
                          className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors"
                          style={{ fontSize: '24px' }}
                        >
                          add
                        </span>
                      </div>
                      <span className="text-[13px] font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
                        New Resume
                      </span>
                    </button>
                  )}
                </div>

                {/* No search results */}
                {filtered.length === 0 && search && (
                  <div className="text-center py-16">
                    <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#cbd5e1' }}>search_off</span>
                    <p className="text-[14px] text-on-surface-variant mt-3">
                      No resumes match "<strong className="text-on-background">{search}</strong>"
                    </p>
                    <button onClick={() => setSearch('')} className="mt-3 text-[13px] text-primary hover:underline">
                      Clear search
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── COVER LETTERS TAB (coming soon) ── */}
        {activeTab === 'cover-letters' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '32px' }}>mail</span>
            </div>
            <h2 className="text-[18px] font-bold text-on-background mb-2">Coming Soon</h2>
            <p className="text-[14px] text-on-surface-variant max-w-xs">
              AI-powered cover letters tailored to each job posting.
            </p>
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <div className="flex flex-col items-center justify-center py-16">
            {currentUser ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 w-full max-w-sm text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-[22px] font-bold mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
                >
                  {userInitial}
                </div>
                <h2 className="text-[18px] font-bold text-on-background">
                  {currentUser.displayName || 'User'}
                </h2>
                <p className="text-[13px] text-on-surface-variant mt-1">{currentUser.email}</p>
                <div className="mt-5 pt-5 border-t border-gray-100 flex justify-center gap-6">
                  <div>
                    <p className="text-[20px] font-bold text-on-background">{resumes.length}</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Resume{resumes.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#cbd5e1' }}>person</span>
                <p className="text-[14px] text-on-surface-variant mt-3 mb-4">Sign in to manage your profile</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
                >
                  Go to Home
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
