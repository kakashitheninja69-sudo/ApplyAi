import { useNavigate } from 'react-router-dom'

const LINKS: { label: string; path: string }[] = [
  { label: 'Privacy',   path: '/privacy' },
  { label: 'Terms',     path: '/terms' },
  { label: 'Support',   path: '/support' },
  { label: 'API',       path: '/api' },
]

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="w-full border-t border-gray-100 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center py-8 px-8 max-w-[1920px] mx-auto gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-h1 text-lg font-black text-primary">ApplyAI</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © 2025 ApplyAI. Precision Career Tools.
          </p>
        </div>

        <div className="flex items-center gap-8">
          {LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/support')}
            aria-label="Email"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>alternate_email</span>
          </button>
          <button
            onClick={() => navigate('/api')}
            aria-label="API"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>code</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
