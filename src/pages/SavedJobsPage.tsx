import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/lib/firebase'
import { relativeTime, stripHtml } from '@/lib/jobApi'
import type { ApiJob } from '@/lib/jobApi'
import { getSavedJobs, unsaveJob } from '@/lib/savedJobs'
import AppDrawer from '@/components/layout/AppDrawer'

const LOGO_COLORS = [
  '#4285f4','#635bff','#ff5a5f','#0082fb','#e50914',
  '#f24e1e','#96bf48','#1a1a2e','#00b4d8','#7209b7',
  '#2ecc71','#e67e22','#e91e8c','#34495e','#16a085',
]

function SavedTopNav({ onMenuToggle }: { onMenuToggle: () => void }) {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-outline-variant h-16 flex items-center px-4 sm:px-6 gap-3">
      <button
        onClick={onMenuToggle}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>menu</span>
      </button>
      <button onClick={() => navigate('/')} className="text-[18px] font-bold text-primary tracking-tight font-h1">
        ApplyAI
      </button>
      <nav className="hidden md:flex items-center gap-1 ml-4">
        {[
          { label: 'Find Jobs',  path: '/jobs',       active: false },
          { label: 'Saved Jobs', path: '/saved-jobs', active: true  },
          { label: 'Resumes',    path: '/dashboard',  active: false },
        ].map(({ label, path, active }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={cn(
              'relative px-3 py-1.5 rounded-lg font-body-sm font-medium transition-all duration-200',
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
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[13px] hover:opacity-90 transition-opacity"
          >
            {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
          </button>
        ) : (
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[13px]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
          </button>
        )}
      </div>
    </header>
  )
}

function SavedJobCard({ job, onUnsave }: { job: ApiJob; onUnsave: () => void }) {
  const initial    = job.company[0]?.toUpperCase() ?? '?'
  const colorIdx   = Math.abs(job.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % LOGO_COLORS.length
  const logoColor  = LOGO_COLORS[colorIdx]
  const canOpen    = job.applyUrl && job.applyUrl !== '#'

  return (
    <div className="bg-white rounded-2xl border border-outline-variant p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <div
          onClick={() => canOpen && window.open(job.applyUrl, '_blank', 'noopener,noreferrer')}
          className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm', canOpen && 'cursor-pointer')}
          style={{ background: logoColor }}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                onClick={() => canOpen && window.open(job.applyUrl, '_blank', 'noopener,noreferrer')}
                className={cn('font-h2 text-[15px] font-bold text-on-background hover:text-primary transition-colors', canOpen && 'cursor-pointer hover:underline')}
              >
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="font-body-sm text-[13px] text-on-surface-variant font-medium">{job.company}</span>
                <span className="text-outline-variant">·</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '13px' }}>location_on</span>
                  <span className="font-body-sm text-[13px] text-on-surface-variant">{job.location}</span>
                </div>
                {job.remote && (
                  <>
                    <span className="text-outline-variant">·</span>
                    <span className="text-[11px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">Remote</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onUnsave}
              title="Remove from saved"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/8 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#003fb1', fontVariationSettings: "'FILL' 1" }}>bookmark</span>
            </button>
          </div>

          <p className="font-body-sm text-[13px] text-on-surface-variant mt-2 leading-relaxed line-clamp-2">
            {stripHtml(job.description).slice(0, 200)}
          </p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#dbe1ff', color: '#003fb1' }}>
              {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
            </span>
            {job.salary && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#dcfce7', color: '#15803d' }}>
                {job.salary}
              </span>
            )}
            {(job.tags ?? []).slice(0, 3).map(tag => (
              <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant">
                {tag}
              </span>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[11px] text-on-surface-variant">{relativeTime(job.postedAt)}</span>
              {canOpen && (
                <button
                  onClick={() => window.open(job.applyUrl, '_blank', 'noopener,noreferrer')}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>open_in_new</span>
                  Apply
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SavedJobsPage() {
  const navigate = useNavigate()
  const [jobs,       setJobs]       = useState<ApiJob[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setJobs(getSavedJobs())
  }, [])

  function handleUnsave(id: string) {
    unsaveJob(id)
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <SavedTopNav onMenuToggle={() => setDrawerOpen(true)} />
      <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full mb-3">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>bookmark</span>
              <span className="font-label-caps text-label-caps text-on-primary-fixed-variant uppercase tracking-widest text-[10px]">Saved Jobs</span>
            </div>
            <h1 className="font-h1 text-h1 text-on-background">Your saved jobs</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              {jobs.length > 0 ? `${jobs.length} job${jobs.length !== 1 ? 's' : ''} saved` : 'No saved jobs yet'}
            </p>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map(job => (
                <SavedJobCard key={job.id} job={job} onUnsave={() => handleUnsave(job.id)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '28px' }}>bookmark_border</span>
              </div>
              <h3 className="font-h2 text-[18px] font-bold text-on-background mb-2">No saved jobs yet</h3>
              <p className="font-body-sm text-on-surface-variant mb-6">
                Bookmark jobs from the search page to save them here.
              </p>
              <button
                onClick={() => navigate('/jobs')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-body-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span>
                Browse Jobs
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant z-40 flex">
        {[
          { icon: 'search',   label: 'Search',  path: '/jobs'       },
          { icon: 'bookmark', label: 'Saved',   path: '/saved-jobs', active: true },
          { icon: 'fact_check', label: 'Tracker', path: '/tracker'  },
          { icon: 'person',   label: 'Profile', path: '/dashboard'  },
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
    </div>
  )
}
