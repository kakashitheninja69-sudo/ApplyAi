import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '@/lib/firebase'
import { loadAllResumes, loadResume } from '@/lib/localResumes'
import { cn } from '@/lib/utils'
import type { User } from '@/lib/firebase'

type Tab = 'signup' | 'login'

const FORMSPREE_FORM_ID = 'mlgavpae'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, data, loadResumeData, setResumeId, setResumeName, setSavedResumes } = useResumeStore()
  const navigate = useNavigate()

  const [tab, setTab]           = useState<Tab>('signup')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [gLoading, setGLoading] = useState(false)

  // signup
  const [name,     setName]     = useState('')
  const [suEmail,  setSuEmail]  = useState('')
  const [suPass,   setSuPass]   = useState('')

  // login
  const [liEmail,  setLiEmail]  = useState('')
  const [liPass,   setLiPass]   = useState('')

  if (!isAuthModalOpen) return null

  function dismiss() {
    closeAuthModal()
    setError('')
  }

  // After auth: check localStorage resumes and route intelligently
  function goAfterAuth(user: User, isNewSignup: boolean) {
    closeAuthModal()
    if (isNewSignup) { navigate('/onboarding'); return }
    try {
      const resumes = loadAllResumes()
      setSavedResumes(resumes)
      if (resumes.length === 0) {
        navigate('/onboarding')
      } else if (resumes.length === 1) {
        const resumeData = loadResume(resumes[0].id)
        if (resumeData) {
          loadResumeData(resumeData, resumes[0].id, resumes[0].name)
          navigate('/builder')
        } else {
          navigate('/dashboard')
        }
      } else {
        navigate('/dashboard')
      }
    } catch {
      navigate('/builder')
    }
  }

  async function handleGoogle() {
    setError('')
    setGLoading(true)
    try {
      const user = await signInWithGoogle()
      goAfterAuth(user, false)
    } catch (e: any) {
      setError(friendlyError(e?.code))
    } finally {
      setGLoading(false)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Please enter your full name.'); return }
    if (suPass.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const user = await signUpWithEmail(name.trim(), suEmail, suPass)
      try {
        const fd = new FormData()
        fd.append('name', name); fd.append('email', suEmail); fd.append('source', 'applyai-signup')
        fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, { method: 'POST', body: fd })
      } catch { /* non-critical */ }
      goAfterAuth(user, true)
    } catch (e: any) {
      setError(friendlyError(e?.code))
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await signInWithEmail(liEmail, liPass)
      goAfterAuth(user, false)
    } catch (e: any) {
      setError(friendlyError(e?.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-violet-500 to-secondary" />

        <div className="p-8">
          {/* Logo + heading */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>ApplyAI</span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.3px' }}>
            {tab === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
            {tab === 'signup' ? '3 free AI credits included. No credit card.' : 'Sign in to continue building your resume.'}
          </p>

          {/* Tab switcher */}
          <div className="flex gap-0 mb-6 rounded-xl overflow-hidden border border-gray-200">
            {(['signup', 'login'] as Tab[]).map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }}
                className={cn(
                  'flex-1 py-2.5 text-sm font-semibold transition-all',
                  tab === t ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                )}>
                {t === 'signup' ? 'Sign Up' : 'Log In'}
              </button>
            ))}
          </div>

          {/* Google button */}
          <button onClick={handleGoogle} disabled={gLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all mb-4 font-medium text-sm text-gray-700 disabled:opacity-60"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            {gLoading ? (
              <span className="material-symbols-outlined animate-spin text-gray-400" style={{ fontSize: '18px' }}>refresh</span>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Sign Up form */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3">
              <AuthInput label="Full Name" type="text" placeholder="Alex Johnson" value={name} onChange={setName} autoFocus />
              <AuthInput label="Email" type="email" placeholder="alex@example.com" value={suEmail} onChange={setSuEmail} />
              <AuthInput label="Password" type="password" placeholder="Min 6 characters" value={suPass} onChange={setSuPass} />
              {error && <ErrorMsg msg={error} />}
              <SubmitButton loading={loading} label="Create Account" icon="person_add" />
              <p className="text-center text-xs text-gray-400 pt-1">
                Already have an account?{' '}
                <button type="button" onClick={() => { setTab('login'); setError('') }} className="text-primary font-semibold hover:underline">Log in</button>
              </p>
            </form>
          )}

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <AuthInput label="Email" type="email" placeholder="alex@example.com" value={liEmail} onChange={setLiEmail} autoFocus />
              <AuthInput label="Password" type="password" placeholder="Your password" value={liPass} onChange={setLiPass} />
              {error && <ErrorMsg msg={error} />}
              <SubmitButton loading={loading} label="Sign In" icon="login" />
              <p className="text-center text-xs text-gray-400 pt-1">
                Don't have an account?{' '}
                <button type="button" onClick={() => { setTab('signup'); setError('') }} className="text-primary font-semibold hover:underline">Sign up free</button>
              </p>
            </form>
          )}
        </div>

        {/* Close button */}
        <button onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
        </button>
      </div>
    </div>
  )
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function AuthInput({ label, value, onChange, type, placeholder, autoFocus }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; autoFocus?: boolean
}) {
  return (
    <div>
      <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '5px' }}>
        {label}
      </label>
      <input
        type={type ?? 'text'}
        placeholder={placeholder}
        value={value}
        autoFocus={autoFocus}
        onChange={e => onChange(e.target.value)}
        required
        style={{
          width: '100%', padding: '10px 12px', borderRadius: '10px', fontSize: '14px',
          border: '1.5px solid #e2e8f0', outline: 'none', transition: 'border 0.15s',
          background: '#fafafa', color: '#0f172a',
        }}
        onFocus={e => { e.target.style.borderColor = '#003fb1'; e.target.style.background = '#fff' }}
        onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#fafafa' }}
      />
    </div>
  )
}

function SubmitButton({ loading, label, icon }: { loading: boolean; label: string; icon: string }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 mt-1"
      style={{ background: 'linear-gradient(135deg, #003fb1 0%, #0055f5 100%)', boxShadow: '0 4px 14px rgba(0,63,177,0.35)' }}>
      {loading
        ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: '16px' }}>refresh</span>
        : <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      }
      {loading ? 'Please wait…' : label}
    </button>
  )
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-100">
      <span className="material-symbols-outlined text-red-500" style={{ fontSize: '15px', fontVariationSettings: "'FILL' 1" }}>error</span>
      <p style={{ fontSize: '12px', color: '#dc2626' }}>{msg}</p>
    </div>
  )
}

function friendlyError(code?: string): string {
  switch (code) {
    case 'auth/email-already-in-use':   return 'This email is already registered. Try logging in.'
    case 'auth/invalid-email':          return 'Please enter a valid email address.'
    case 'auth/weak-password':          return 'Password must be at least 6 characters.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':     return 'Incorrect email or password.'
    case 'auth/too-many-requests':      return 'Too many attempts. Please try again in a few minutes.'
    case 'auth/popup-closed-by-user':   return 'Sign-in window was closed. Please try again.'
    case 'auth/popup-blocked':          return 'Pop-up was blocked by your browser. Please allow pop-ups.'
    case 'auth/network-request-failed': return 'Network error. Check your connection and try again.'
    default: return 'Something went wrong. Please try again.'
  }
}
