import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { getSavedJobs } from '@/lib/savedJobs'

interface AppDrawerProps {
  isOpen:  boolean
  onClose: () => void
}

const NAV_ITEMS = [
  { icon: 'dashboard',    label: 'Dashboard',  path: '/dashboard'  },
  { icon: 'work_history', label: 'Job Search', path: '/jobs'       },
  { icon: 'bookmark',     label: 'Saved Jobs', path: '/saved-jobs' },
  { icon: 'description',  label: 'My Resumes', path: '/dashboard'  },
  { icon: 'fact_check',   label: 'Tracker',    path: '/tracker'    },
  { icon: 'mail',         label: 'Messages',   path: '/messages'   },
]

export default function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
  const navigate    = useNavigate()
  const { pathname } = useLocation()
  const savedCount  = getSavedJobs().length

  function goTo(path: string) {
    navigate(path)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 w-72 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-outline-variant shrink-0">
          <button
            onClick={() => goTo('/')}
            className="text-[18px] font-bold text-primary tracking-tight"
          >
            ApplyAI
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.path
            const badge  = item.path === '/saved-jobs' && savedCount > 0 ? savedCount : undefined
            return (
              <button
                key={item.label}
                onClick={() => goTo(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-150 text-left',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                )}
              >
                <span
                  className="material-symbols-outlined shrink-0"
                  style={{ fontSize: '22px', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="flex-1 text-[14px]">{item.label}</span>
                {badge !== undefined && (
                  <span className="text-[10px] font-bold text-white bg-primary px-1.5 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Boost card */}
        <div className="m-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
              rocket_launch
            </span>
          </div>
          <p className="font-body-sm font-bold text-on-background text-[13px] mb-1">Boost Visibility</p>
          <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed">
            Tailor your resume for each role and land more interviews.
          </p>
          <button
            onClick={() => goTo('/builder')}
            className="w-full py-2 rounded-lg text-[12px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
          >
            Personalise Resume
          </button>
        </div>
      </aside>
    </>
  )
}
