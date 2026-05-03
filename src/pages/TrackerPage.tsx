import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/lib/firebase'
import AppDrawer from '@/components/layout/AppDrawer'

// ── Storage ───────────────────────────────────────────────────────────────────

const TRACKER_KEY = 'applyai-tracker'

type Status = 'applied' | 'phone-screen' | 'interview' | 'offer' | 'rejected' | 'withdrawn'

interface TrackerEntry {
  id:          string
  jobTitle:    string
  company:     string
  status:      Status
  appliedDate: string
  url:         string
  notes:       string
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function loadEntries(): TrackerEntry[] {
  try { return JSON.parse(localStorage.getItem(TRACKER_KEY) ?? '[]') } catch { return [] }
}

function persistEntries(entries: TrackerEntry[]): void {
  localStorage.setItem(TRACKER_KEY, JSON.stringify(entries))
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<Status, { label: string; bg: string; color: string; icon: string }> = {
  'applied':      { label: 'Applied',      bg: '#dbe1ff', color: '#003fb1', icon: 'send'         },
  'phone-screen': { label: 'Phone Screen', bg: '#f3e8ff', color: '#7c3aed', icon: 'call'         },
  'interview':    { label: 'Interview',    bg: '#fef3c7', color: '#d97706', icon: 'groups'       },
  'offer':        { label: 'Offer',        bg: '#dcfce7', color: '#15803d', icon: 'star'         },
  'rejected':     { label: 'Rejected',     bg: '#fee2e2', color: '#dc2626', icon: 'cancel'       },
  'withdrawn':    { label: 'Withdrawn',    bg: '#f1f5f9', color: '#64748b', icon: 'block'        },
}

const LOGO_COLORS = [
  '#4285f4','#635bff','#ff5a5f','#0082fb','#e50914',
  '#f24e1e','#96bf48','#1a1a2e','#00b4d8','#7209b7',
]

// ── Sub-components ────────────────────────────────────────────────────────────

function TrackerTopNav({ onMenuToggle }: { onMenuToggle: () => void }) {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-outline-variant h-16 flex items-center px-4 sm:px-6 gap-3">
      <button
        onClick={onMenuToggle}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>menu</span>
      </button>
      <button onClick={() => navigate('/')} className="text-[18px] font-bold text-primary tracking-tight">
        ApplyAI
      </button>
      <nav className="hidden md:flex items-center gap-1 ml-4">
        {[
          { label: 'Job Search', path: '/jobs'       },
          { label: 'Saved Jobs', path: '/saved-jobs' },
          { label: 'Tracker',    path: '/tracker',   active: true },
        ].map(({ label, path, active }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={cn(
              'relative px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all',
              active ? 'text-primary bg-primary/8' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            )}
          >
            {label}
            {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />}
          </button>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        {currentUser ? (
          <button
            onClick={() => signOut()}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[13px] hover:opacity-90"
          >
            {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
          </button>
        ) : (
          <button onClick={() => navigate('/dashboard')} className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
          </button>
        )}
      </div>
    </header>
  )
}

interface AddFormProps {
  onAdd:    (entry: TrackerEntry) => void
  onCancel: () => void
}

function AddForm({ onAdd, onCancel }: AddFormProps) {
  const [jobTitle, setJobTitle]       = useState('')
  const [company,  setCompany]        = useState('')
  const [status,   setStatus]         = useState<Status>('applied')
  const [date,     setDate]           = useState(new Date().toISOString().slice(0, 10))
  const [url,      setUrl]            = useState('')
  const [notes,    setNotes]          = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!jobTitle.trim() || !company.trim()) return
    onAdd({ id: generateId(), jobTitle: jobTitle.trim(), company: company.trim(), status, appliedDate: date, url: url.trim(), notes: notes.trim() })
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[14px] text-on-background transition-all'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[17px] text-on-background">Add Application</h2>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Job Title *</label>
            <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Software Engineer" className={inputCls} required />
          </div>
          <div>
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Company *</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google" className={inputCls} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as Status)} className={inputCls}>
                {(Object.keys(STATUS_CONFIG) as Status[]).map(s => (
                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Date Applied</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Job URL</label>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className={inputCls} />
          </div>
          <div>
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Interview prep notes, contacts, etc." rows={3} className={cn(inputCls, 'resize-none')} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-[13px] font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
            >
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TrackerPage() {
  const navigate = useNavigate()
  const [entries,     setEntries]     = useState<TrackerEntry[]>([])
  const [showForm,    setShowForm]    = useState(false)
  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const [expandedId,  setExpandedId]  = useState<string | null>(null)

  useEffect(() => { setEntries(loadEntries()) }, [])

  function addEntry(entry: TrackerEntry) {
    const updated = [entry, ...entries]
    setEntries(updated)
    persistEntries(updated)
    setShowForm(false)
  }

  function updateStatus(id: string, status: Status) {
    const updated = entries.map(e => e.id === id ? { ...e, status } : e)
    setEntries(updated)
    persistEntries(updated)
  }

  function deleteEntry(id: string) {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    persistEntries(updated)
  }

  const stats = {
    total:     entries.length,
    active:    entries.filter(e => e.status === 'applied' || e.status === 'phone-screen').length,
    interview: entries.filter(e => e.status === 'interview').length,
    offers:    entries.filter(e => e.status === 'offer').length,
  }

  return (
    <div className="min-h-screen bg-background">
      <TrackerTopNav onMenuToggle={() => setDrawerOpen(true)} />
      <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full mb-3">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>fact_check</span>
                <span className="font-label-caps text-label-caps text-on-primary-fixed-variant uppercase tracking-widest text-[10px]">Job Tracker</span>
              </div>
              <h1 className="font-h1 text-h1 text-on-background">Application Tracker</h1>
              <p className="text-[14px] text-on-surface-variant mt-1">Track every application in one place</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-[13px] text-white transition-all hover:opacity-90 active:scale-[0.97] mt-2"
              style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)', boxShadow: '0 4px 14px rgba(0,63,177,0.3)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              Add
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Applied',   value: stats.total,     icon: 'send',    bg: '#dbe1ff', color: '#003fb1' },
              { label: 'In Progress',     value: stats.active,    icon: 'pending', bg: '#f3e8ff', color: '#7c3aed' },
              { label: 'Interviews',      value: stats.interview, icon: 'groups',  bg: '#fef3c7', color: '#d97706' },
              { label: 'Offers',          value: stats.offers,    icon: 'star',    bg: '#dcfce7', color: '#15803d' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-outline-variant p-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: stat.bg }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: stat.color, fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                </div>
                <p className="font-bold text-[22px] text-on-background">{stat.value}</p>
                <p className="text-[11px] text-on-surface-variant">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* List */}
          {entries.length > 0 ? (
            <div className="space-y-3">
              {entries.map((entry, i) => {
                const cfg      = STATUS_CONFIG[entry.status]
                const initial  = entry.company[0]?.toUpperCase() ?? '?'
                const logoColor = LOGO_COLORS[i % LOGO_COLORS.length]
                const expanded  = expandedId === entry.id
                const dateStr   = entry.appliedDate
                  ? new Date(entry.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'

                return (
                  <div key={entry.id} className="bg-white rounded-2xl border border-outline-variant overflow-hidden hover:shadow-md transition-all">
                    <div
                      className="flex items-center gap-4 p-4 cursor-pointer"
                      onClick={() => setExpandedId(expanded ? null : entry.id)}
                    >
                      {/* Logo */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-[15px] shrink-0"
                        style={{ background: logoColor }}
                      >
                        {initial}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[14px] text-on-background truncate">{entry.jobTitle}</p>
                        <p className="text-[12px] text-on-surface-variant">{entry.company} · {dateStr}</p>
                      </div>

                      {/* Status */}
                      <select
                        value={entry.status}
                        onChange={e => { e.stopPropagation(); updateStatus(entry.id, e.target.value as Status) }}
                        onClick={e => e.stopPropagation()}
                        className="text-[11px] font-bold px-2.5 py-1.5 rounded-full border-0 outline-none cursor-pointer shrink-0"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {(Object.keys(STATUS_CONFIG) as Status[]).map(s => (
                          <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                        ))}
                      </select>

                      {/* Chevron */}
                      <span
                        className="material-symbols-outlined text-on-surface-variant transition-transform shrink-0"
                        style={{ fontSize: '18px', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        expand_more
                      </span>
                    </div>

                    {/* Expanded */}
                    {expanded && (
                      <div className="px-4 pb-4 border-t border-outline-variant pt-4">
                        {entry.notes && (
                          <div className="mb-3">
                            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Notes</p>
                            <p className="text-[13px] text-on-surface-variant leading-relaxed">{entry.notes}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          {entry.url && (
                            <a
                              href={entry.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/20 text-[12px] font-bold text-primary hover:bg-primary/5 transition-colors"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                              View Job
                            </a>
                          )}
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-error/20 text-[12px] font-bold text-error hover:bg-error/5 transition-colors ml-auto"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '28px' }}>fact_check</span>
              </div>
              <h3 className="font-bold text-[18px] text-on-background mb-2">No applications yet</h3>
              <p className="text-[14px] text-on-surface-variant mb-6">Start tracking your job applications to stay organised.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-[13px] text-white hover:opacity-90 transition-all"
                  style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                  Add Application
                </button>
                <button
                  onClick={() => navigate('/jobs')}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-[13px] text-primary bg-primary/10 hover:bg-primary/15 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span>
                  Find Jobs
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant z-40 flex">
        {[
          { icon: 'search',      label: 'Search',  path: '/jobs'       },
          { icon: 'bookmark',    label: 'Saved',   path: '/saved-jobs' },
          { icon: 'fact_check',  label: 'Tracker', path: '/tracker', active: true },
          { icon: 'person',      label: 'Profile', path: '/dashboard'  },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn('flex-1 flex flex-col items-center justify-center py-3 gap-0.5', item.active ? 'text-primary' : 'text-on-surface-variant')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px', fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>

      {showForm && <AddForm onAdd={addEntry} onCancel={() => setShowForm(false)} />}
    </div>
  )
}
