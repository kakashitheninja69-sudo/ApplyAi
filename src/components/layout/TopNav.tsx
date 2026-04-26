import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'

interface TopNavProps {
  activeLink?: 'home' | 'templates' | 'pricing'
  variant?: 'default' | 'builder'
}

export default function TopNav({ activeLink = 'home', variant = 'default' }: TopNavProps) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const openAuthModal = useResumeStore((s) => s.openAuthModal)

  function handleNavClick(link: 'home' | 'templates' | 'pricing') {
    if (link === 'home') {
      navigate('/')
    } else if (link === 'templates') {
      navigate('/templates')
    } else if (link === 'pricing') {
      if (location.pathname === '/') {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/')
      }
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-200">
      <div className="flex justify-between items-center px-8 h-16 w-full max-w-[1920px] mx-auto">
        {/* Brand + Nav */}
        <div className="flex items-center gap-10">
          <button
            onClick={() => navigate('/')}
            className="text-xl font-h1 font-bold tracking-tight text-primary hover:opacity-80 transition-opacity"
          >
            ApplyAI
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {(['home', 'templates', 'pricing'] as const).map((link) => (
              <button
                key={link}
                onClick={() => handleNavClick(link)}
                className={cn(
                  'font-body-sm font-medium tracking-tight capitalize transition-colors',
                  activeLink === link && variant !== 'builder'
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary'
                )}
              >
                {link}
              </button>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={openAuthModal}
            className="font-body-sm font-medium text-on-surface-variant hover:text-primary transition-colors px-4 py-2"
          >
            Login
          </button>
          <button
            onClick={openAuthModal}
            className="ai-sparkle-button px-5 py-2 rounded-lg font-body-sm font-semibold flex items-center gap-2"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            Get Started
          </button>
        </div>
      </div>
    </header>
  )
}
