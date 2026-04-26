import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const FORMSPREE_FORM_ID = 'mlgavpae'

interface StoredUser {
  name: string
  email: string
  username: string
  passwordHash: string
}

function hashPassword(pw: string) {
  return btoa(encodeURIComponent(pw + '__applyai__'))
}

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem('applyai_users') || '[]') } catch { return [] }
}

function saveUser(u: StoredUser) {
  const users = getUsers()
  users.push(u)
  localStorage.setItem('applyai_users', JSON.stringify(users))
  localStorage.setItem('applyai_current_user', JSON.stringify(u))
}

function loginUser(identifier: string, password: string): StoredUser | null {
  const hash = hashPassword(password)
  const user = getUsers().find(
    (u) => (u.username === identifier || u.email === identifier) && u.passwordHash === hash
  ) ?? null
  if (user) localStorage.setItem('applyai_current_user', JSON.stringify(user))
  return user
}

type Tab = 'signup' | 'login'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useResumeStore()
  const navigate = useNavigate()

  const [tab, setTab] = useState<Tab>('signup')

  // Sign-up state
  const [su, setSu] = useState({ name: '', email: '', username: '', password: '', confirm: '' })
  const [suError, setSuError] = useState('')
  const [suLoading, setSuLoading] = useState(false)
  const [suDone, setSuDone] = useState(false)

  // Login state
  const [li, setLi] = useState({ identifier: '', password: '' })
  const [liError, setLiError] = useState('')
  const [liLoading, setLiLoading] = useState(false)

  function handleClose(open: boolean) {
    if (!open) closeAuthModal()
  }

  function goToBuilder() {
    closeAuthModal()
    navigate('/builder')
  }

  function switchTab(t: Tab) {
    setTab(t)
    setSuError('')
    setLiError('')
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setSuError('')
    const { name, email, username, password, confirm } = su

    if (!name || !email || !username || !password || !confirm) {
      setSuError('All fields are required.')
      return
    }
    if (password.length < 6) {
      setSuError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setSuError('Passwords do not match.')
      return
    }

    const users = getUsers()
    if (users.some((u) => u.username === username)) {
      setSuError('Username already taken — choose another.')
      return
    }
    if (users.some((u) => u.email === email)) {
      setSuError('An account with this email already exists. Try logging in.')
      return
    }

    setSuLoading(true)
    saveUser({ name, email, username, passwordHash: hashPassword(password) })

    // Fire-and-forget lead capture
    try {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('email', email)
      fd.append('username', username)
      fd.append('source', 'applyai-signup')
      await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, { method: 'POST', body: fd })
    } catch { /* non-critical */ }

    setSuLoading(false)
    setSuDone(true)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLiError('')
    const { identifier, password } = li

    if (!identifier || !password) {
      setLiError('Please fill in all fields.')
      return
    }
    setLiLoading(true)
    const user = loginUser(identifier, password)
    setLiLoading(false)

    if (!user) {
      setLiError('Incorrect username / email or password.')
      return
    }
    goToBuilder()
  }

  // ── Success screen ──
  if (suDone) {
    return (
      <Dialog open={isAuthModalOpen} onOpenChange={handleClose}>
        <DialogContent className="text-center">
          <div className="py-6">
            <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-5">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h3 className="font-h2 text-h2 mb-2">Account created!</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Welcome, <strong>{su.name}</strong>. Your free account is ready — no credit card needed.
            </p>
            <Button onClick={goToBuilder} size="lg" className="w-full">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                rocket_launch
              </span>
              Continue to Builder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-fixed rounded-xl flex items-center justify-center flex-shrink-0">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              {tab === 'signup' ? 'Free Account' : 'Welcome Back'}
            </span>
          </div>
          <DialogTitle>
            {tab === 'signup' ? 'Create your free account' : 'Sign in to ApplyAI'}
          </DialogTitle>
          <DialogDescription>
            {tab === 'signup'
              ? '3 free resume builds per month. No credit card, ever.'
              : 'Continue building your career narrative.'}
          </DialogDescription>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-surface-container rounded-xl mt-1 mb-4">
          {(['signup', 'login'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={cn(
                'flex-1 py-2 rounded-lg font-body-sm font-semibold transition-all duration-200',
                tab === t
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              {t === 'signup' ? 'Sign Up' : 'Log In'}
            </button>
          ))}
        </div>

        {/* ── Sign Up Form ── */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="su-name">Full Name</Label>
              <Input
                id="su-name"
                placeholder="Alex Johnson"
                value={su.name}
                onChange={(e) => setSu((p) => ({ ...p, name: e.target.value }))}
                autoFocus
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="su-email">Email Address</Label>
              <Input
                id="su-email"
                type="email"
                placeholder="alex@example.com"
                value={su.email}
                onChange={(e) => setSu((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="su-username">Username</Label>
              <Input
                id="su-username"
                placeholder="alex_j"
                value={su.username}
                onChange={(e) =>
                  setSu((p) => ({
                    ...p,
                    username: e.target.value.replace(/\s/g, '_').toLowerCase(),
                  }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="su-pass">Password</Label>
                <Input
                  id="su-pass"
                  type="password"
                  placeholder="Min 6 chars"
                  value={su.password}
                  onChange={(e) => setSu((p) => ({ ...p, password: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="su-confirm">Confirm</Label>
                <Input
                  id="su-confirm"
                  type="password"
                  placeholder="Repeat password"
                  value={su.confirm}
                  onChange={(e) => setSu((p) => ({ ...p, confirm: e.target.value }))}
                  required
                />
              </div>
            </div>

            {suError && (
              <p className="font-body-sm text-body-sm text-error">{suError}</p>
            )}

            <Button type="submit" disabled={suLoading} size="lg" className="w-full mt-1">
              {suLoading ? (
                <>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ animation: 'spin 1s linear infinite' }}
                  >
                    refresh
                  </span>
                  Creating account…
                </>
              ) : (
                <>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    person_add
                  </span>
                  Create Account
                </>
              )}
            </Button>

            <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('login')}
                className="text-primary hover:underline font-semibold"
              >
                Log in
              </button>
            </p>
          </form>
        )}

        {/* ── Login Form ── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="li-id">Username or Email</Label>
              <Input
                id="li-id"
                placeholder="alex_j or alex@example.com"
                value={li.identifier}
                onChange={(e) => setLi((p) => ({ ...p, identifier: e.target.value }))}
                autoFocus
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="li-pass">Password</Label>
              <Input
                id="li-pass"
                type="password"
                placeholder="Your password"
                value={li.password}
                onChange={(e) => setLi((p) => ({ ...p, password: e.target.value }))}
                required
              />
            </div>

            {liError && (
              <p className="font-body-sm text-body-sm text-error">{liError}</p>
            )}

            <Button type="submit" disabled={liLoading} size="lg" className="w-full mt-1">
              {liLoading ? (
                <>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ animation: 'spin 1s linear infinite' }}
                  >
                    refresh
                  </span>
                  Signing in…
                </>
              ) : (
                <>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    login
                  </span>
                  Sign In
                </>
              )}
            </Button>

            <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('signup')}
                className="text-primary hover:underline font-semibold"
              >
                Sign up free
              </button>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
