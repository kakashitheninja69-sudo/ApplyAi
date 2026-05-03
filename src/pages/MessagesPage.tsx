import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/lib/firebase'
import AppDrawer from '@/components/layout/AppDrawer'

function MessagesTopNav({ onMenuToggle }: { onMenuToggle: () => void }) {
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
      <div className="ml-auto flex items-center gap-2">
        {currentUser ? (
          <button onClick={() => signOut()} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[13px] hover:opacity-90">
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

// Sample placeholder conversations
const SAMPLE_CONVERSATIONS = [
  { id: '1', name: 'Stripe Recruiting', avatar: 'S', color: '#635bff', preview: 'We reviewed your application for the Data Analyst role…', time: '2d ago', unread: true  },
  { id: '2', name: 'Google Careers',    avatar: 'G', color: '#4285f4', preview: 'Thank you for applying to Software Engineer at Google…', time: '1w ago', unread: false },
  { id: '3', name: 'Shopify HR',        avatar: 'S', color: '#96bf48', preview: 'Your application has been received and is under review.', time: '2w ago', unread: false },
]

export default function MessagesPage() {
  const navigate    = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selected,   setSelected]   = useState<string | null>(null)

  const conversation = SAMPLE_CONVERSATIONS.find(c => c.id === selected)

  return (
    <div className="min-h-screen bg-background">
      <MessagesTopNav onMenuToggle={() => setDrawerOpen(true)} />
      <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full mb-3">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>mail</span>
              <span className="font-label-caps text-label-caps text-on-primary-fixed-variant uppercase tracking-widest text-[10px]">Messages</span>
            </div>
            <h1 className="font-h1 text-h1 text-on-background">Inbox</h1>
            <p className="text-[14px] text-on-surface-variant mt-1">Recruiter messages and application updates</p>
          </div>

          <div className="bg-white rounded-3xl border border-outline-variant overflow-hidden">
            {/* Coming soon banner */}
            <div className="px-5 py-4 border-b border-outline-variant flex items-center gap-3 bg-primary/5">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>construction</span>
              <div>
                <p className="text-[13px] font-bold text-primary">Recruiter Messaging — Coming Soon</p>
                <p className="text-[11px] text-on-surface-variant">Direct messaging with recruiters will be available in the next update.</p>
              </div>
            </div>

            {/* Placeholder list */}
            <div className="divide-y divide-outline-variant">
              {SAMPLE_CONVERSATIONS.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv.id === selected ? null : conv.id)}
                  className={cn(
                    'w-full flex items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-container',
                    conv.id === selected && 'bg-primary/5'
                  )}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[15px] shrink-0"
                    style={{ background: conv.color }}
                  >
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn('text-[14px] truncate', conv.unread ? 'font-bold text-on-background' : 'font-medium text-on-surface-variant')}>
                        {conv.name}
                      </p>
                      <span className="text-[11px] text-on-surface-variant shrink-0">{conv.time}</span>
                    </div>
                    <p className="text-[12px] text-on-surface-variant truncate mt-0.5">{conv.preview}</p>
                  </div>
                  {conv.unread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Expanded message */}
            {conversation && (
              <div className="border-t border-outline-variant px-5 py-5 bg-surface-container-low">
                <p className="text-[13px] font-bold text-on-background mb-2">{conversation.name}</p>
                <p className="text-[13px] text-on-surface-variant leading-relaxed">
                  {conversation.preview} This is a placeholder preview. Full recruiter messaging is coming soon — you'll be able to reply directly from ApplyAI.
                </p>
                <div className="mt-4 flex gap-2">
                  <div className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant bg-white text-[13px] text-on-surface-variant">
                    Reply coming soon…
                  </div>
                  <button
                    disabled
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white opacity-40"
                    style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col items-center text-center">
            <p className="text-[13px] text-on-surface-variant mb-4">
              Want recruiter messages? Apply to more jobs to increase your chances.
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-[13px] text-white hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span>
              Find & Apply to Jobs
            </button>
          </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant z-40 flex">
        {[
          { icon: 'search',   label: 'Search',   path: '/jobs'       },
          { icon: 'bookmark', label: 'Saved',    path: '/saved-jobs' },
          { icon: 'fact_check', label: 'Tracker', path: '/tracker'   },
          { icon: 'mail',     label: 'Messages', path: '/messages', active: true },
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
