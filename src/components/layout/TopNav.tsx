import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/lib/firebase'

interface TopNavProps {
  variant?: 'default' | 'builder'
}

export default function TopNav({ variant = 'default' }: TopNavProps) {
  const navigate      = useNavigate()
  const location      = useLocation()
  const openAuthModal = useResumeStore((s) => s.openAuthModal)
  const credits       = useResumeStore((s) => s.credits)
  const { currentUser } = useAuth()

  // Auto-detect active link from current path
  const activeLink: 'home' | 'templates' | 'pricing' | 'about' =
    location.pathname === '/templates' ? 'templates' : 'home'

  function handleLogoClick() {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  function handleNavClick(link: 'home' | 'templates' | 'pricing' | 'about') {
    if (link === 'home') {
      navigate('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (link === 'templates') {
      navigate('/templates')
    } else if (link === 'about') {
      const tryScroll = () => {
        const el = document.getElementById('about')
        if (el) { el.scrollIntoView({ behavior: 'smooth' }); return true }
        return false
      }
      if (!tryScroll()) { navigate('/'); setTimeout(tryScroll, 350) }
    } else if (link === 'pricing') {
      const tryScroll = () => {
        const el = document.getElementById('pricing')
        if (el) { el.scrollIntoView({ behavior: 'smooth' }); return true }
        return false
      }
      if (!tryScroll()) { navigate('/'); setTimeout(tryScroll, 350) }
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-200">
      <div className="flex justify-between items-center px-8 h-16 w-full max-w-[1920px] mx-auto">
        {/* Brand + Nav */}
        <div className="flex items-center gap-10">
          <button
            onClick={handleLogoClick}
            className="text-xl font-h1 font-bold tracking-tight text-primary hover:opacity-80 transition-opacity"
          >
            ApplyAI
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {(['home', 'templates', 'about', 'pricing'] as const).map((link) => {
              const isActive = activeLink === link && variant !== 'builder'
              return (
                <button
                  key={link}
                  onClick={() => handleNavClick(link)}
                  className={cn(
                    'relative px-3 py-1.5 rounded-lg font-body-sm font-medium capitalize transition-all duration-200',
                    isActive
                      ? 'text-primary bg-primary/8'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  )}
                >
                  {link}
                  {/* Active underline indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Credits badge — shown when user has used some */}
          {credits < 3 && (
            <div className={cn(
              'hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold',
              credits === 0
                ? 'bg-error/10 text-error'
                : 'bg-primary/10 text-primary'
            )}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>
                toll
              </span>
              {credits} credit{credits !== 1 ? 's' : ''} left
            </div>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Avatar pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-bold">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="font-body-sm text-[13px] font-medium text-on-surface hidden sm:block max-w-[120px] truncate">
                  {currentUser.displayName || currentUser.email}
                </span>
              </div>

              {/* My Resumes button */}
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-body-sm text-[13px] font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #003fb1 0%, #0055f5 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(0,63,177,0.25)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px', fontVariationSettings: "'FILL' 1" }}>folder_open</span>
                <span className="hidden sm:inline">My Resumes</span>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
              </button>

              <button
                onClick={() => signOut()}
                className="font-body-sm text-[12px] font-medium text-on-surface-variant hover:text-error transition-colors px-2 py-1.5"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <button onClick={openAuthModal} className="font-body-sm font-medium text-on-surface-variant hover:text-primary transition-colors px-4 py-2">
                Login
              </button>
              <button onClick={openAuthModal} className="ai-sparkle-button px-5 py-2 rounded-lg font-body-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
