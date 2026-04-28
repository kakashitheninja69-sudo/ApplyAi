import { useNavigate } from 'react-router-dom'
import Footer from '@/components/layout/Footer'
import { useResumeStore } from '@/store/resumeStore'
import { cn } from '@/lib/utils'

const STEPS = [
  { n: '01', label: 'Choose Template',   icon: 'design_services', done: true  },
  { n: '02', label: 'Contact Info',      icon: 'person',          done: true  },
  { n: '03', label: 'Work Experience',   icon: 'work',            done: true  },
  { n: '04', label: 'Education',         icon: 'school',          done: false, active: true },
  { n: '05', label: 'Skills',            icon: 'psychology',      done: false },
  { n: '06', label: 'AI Summary',        icon: 'auto_awesome',    done: false },
]

const COMPARISON = [
  { feature: 'AI Content Generation',   applyai: 'check', competitor: 'Standard Templates Only' },
  { feature: 'ATS Optimisation Score',  applyai: 'check', competitor: 'cancel' },
  { feature: 'Unlimited PDF Exports',   applyai: 'Free Forever', competitor: '$19.99 / Month' },
  { feature: 'JD Match Analysis',       applyai: 'check', competitor: 'cancel' },
  { feature: 'Real-time Live Edit',     applyai: 'check', competitor: 'Refresh Required' },
]

const TEAM = [
  { initials: 'JS', role: 'Co-founder & CEO',      bg: '#1a56db' },
  { initials: 'ML', role: 'Co-founder & CTO',      bg: '#7c3aed' },
  { initials: 'PR', role: 'Head of AI Research',   bg: '#059669' },
  { initials: 'KA', role: 'Lead Product Designer', bg: '#d97706' },
]

export default function LandingPage() {
  const navigate  = useNavigate()
  const openAuthModal = useResumeStore((s) => s.openAuthModal)
  const data          = useResumeStore((s) => s.data)
  const currentStep   = useResumeStore((s) => s.currentStep)
  const hasResume     = !!data.contact.name

  return (
    <div className="min-h-screen bg-background text-on-background">

      {/* ── Resume continuation banner ── */}
      {hasResume && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-5 py-3.5 rounded-2xl shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #003fb1 0%, #0055f5 100%)', minWidth: '340px', maxWidth: '480px' }}
        >
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>description</span>
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '1px' }}>
              Resume in progress
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {data.contact.name} · Step {currentStep} of 6
            </p>
          </div>
          <button
            onClick={() => navigate('/builder')}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            Continue
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </button>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-16">
        <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
          {/* Copy */}
          <div className="z-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full mb-6">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span className="font-label-caps text-label-caps text-on-primary-fixed-variant uppercase tracking-widest">
                Next-Gen Resume Builder
              </span>
            </div>

            <h1 className="font-display-lg text-display-lg text-on-background mb-6 leading-tight">
              Create a professional,{' '}
              <span className="text-primary">tailored resume</span>{' '}
              in under 5 minutes.
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
              Free, AI-powered, and ATS-optimized. Leverage the same technology recruiters use to get your resume to the top of the pile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={openAuthModal} className="ai-sparkle-button px-8 py-4 rounded-xl font-h2 text-lg flex items-center justify-center gap-3">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                Build My Resume Free
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4 flex-wrap">
              <div className="flex -space-x-2">
                {['#1a56db','#7c3aed','#059669'].map((c, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-xs" style={{ background: c, zIndex: i }}>
                    {['A','M','K'][i]}
                  </div>
                ))}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <span className="font-bold text-on-background">10,000+</span> professionals hired this month
              </p>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-yellow-400" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
                <span className="font-body-sm text-body-sm text-on-surface-variant ml-1">4.9 / 5</span>
              </div>
            </div>
          </div>

          {/* Mock Resume Card */}
          <div className="relative lg:h-[680px] flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10 w-full max-w-[460px] paper-shadow bg-white p-8 rounded-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Template preview */}
              <div className="flex gap-4 mb-5 pb-5 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary text-lg">A</span>
                </div>
                <div>
                  <div className="h-4 w-32 bg-gray-900 rounded mb-1.5" />
                  <div className="h-2.5 w-24 bg-primary/30 rounded" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="h-2 w-20 bg-primary/20 rounded mb-2.5" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-full bg-gray-100 rounded" />
                    <div className="h-2 w-5/6 bg-gray-100 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                      <div className="h-2 w-4/5 bg-primary/10 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                      <div className="h-2 w-3/4 bg-primary/10 rounded" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="h-2 w-16 bg-primary/20 rounded mb-2.5" />
                  <div className="grid grid-cols-3 gap-1.5">
                    {['React','TypeScript','Figma','Python','SQL','AWS'].map((s) => (
                      <div key={s} className="h-5 bg-primary/8 rounded-full border border-primary/15 flex items-center justify-center">
                        <span className="text-[9px] text-primary font-semibold">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating AI badge */}
              <div className="absolute -top-5 -right-5 bg-white p-3 rounded-xl shadow-xl border border-primary/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <div>
                  <p className="font-label-caps text-[9px] text-primary uppercase tracking-widest leading-none mb-0.5">AI Score</p>
                  <p className="font-h2 text-sm font-black">98 / 100</p>
                </div>
              </div>
              {/* ATS badge */}
              <div className="absolute -bottom-4 -left-4 bg-secondary px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                <span className="material-symbols-outlined text-white" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="font-label-caps text-[10px] text-white uppercase tracking-wider font-bold">ATS Optimised</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bento ── */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="font-h1 text-h1 mb-4">The Intelligent Career Suite</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Precision tools designed to eliminate friction from your job search.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* 6-Step Builder */}
            <div className="col-span-12 lg:col-span-7 bg-white p-8 rounded-2xl border border-outline-variant hover:border-primary/40 hover:shadow-lg transition-all duration-300 group">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <span className="material-symbols-outlined text-primary mb-3 block" style={{ fontSize: '32px' }}>instant_mix</span>
                  <h3 className="font-h2 text-h2 mb-3">6-Step Intelligent Builder</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-5">
                    From blank page to polished resume through a structured, AI-assisted narrative approach.
                  </p>
                  <button onClick={() => navigate('/builder')} className="flex items-center gap-1.5 font-body-sm font-semibold text-primary hover:gap-2.5 transition-all duration-200">
                    Try the builder
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                  </button>
                </div>

                {/* Step list visualization */}
                <div className="flex-1 space-y-2">
                  {STEPS.map((s) => (
                    <div
                      key={s.n}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                        s.done   ? 'bg-secondary/8' :
                        s.active ? 'bg-primary/8 ring-1 ring-primary/25' : 'bg-gray-50'
                      )}
                    >
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold',
                        s.done   ? 'bg-secondary text-white' :
                        s.active ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                      )}>
                        {s.done
                          ? <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>check</span>
                          : s.n}
                      </div>
                      <span className={cn(
                        'font-body-sm text-[13px]',
                        s.done   ? 'text-secondary font-medium' :
                        s.active ? 'text-primary font-semibold' : 'text-gray-400'
                      )}>
                        {s.label}
                      </span>
                      {s.active && (
                        <span className="ml-auto text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          In progress
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Bullet Points */}
            <div className="col-span-12 lg:col-span-5 bg-primary-container text-white p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined mb-3 block" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h3 className="font-h2 text-h2 mb-3">AI Bullet Points</h3>
                <p className="opacity-90 font-body-md text-body-md">
                  Transform vague job duties into high-impact, metric-driven achievements instantly.
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <div className="bg-white/10 p-4 rounded-xl border border-white/15">
                  <p className="font-label-caps text-[10px] opacity-60 uppercase tracking-widest mb-1">Before</p>
                  <p className="font-body-sm text-sm italic opacity-70 line-through">"Managed a team and sold software."</p>
                </div>
                <div className="bg-white/15 p-4 rounded-xl border border-white/25">
                  <p className="font-label-caps text-[10px] text-secondary-fixed uppercase tracking-widest mb-1">After AI</p>
                  <p className="font-body-sm text-sm font-semibold">"Led 5-person team, driving 40% SaaS revenue growth in Q3 2024."</p>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="col-span-12 md:col-span-6 bg-white p-8 rounded-2xl border border-outline-variant hover:border-primary/40 hover:shadow-lg transition-all duration-300">
              <span className="material-symbols-outlined text-primary mb-3 block" style={{ fontSize: '32px' }}>visibility</span>
              <h3 className="font-h2 text-h2 mb-3">Real-time Live Preview</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-5">
                Every keystroke reflected instantly on a pixel-perfect A4 canvas. No refresh, no guessing.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-label-caps text-[10px] text-green-600 uppercase tracking-wider font-bold">Live</span>
                </div>
                {[100, 70, 100, 55, 85].map((w, i) => (
                  <div key={i} className="h-2 bg-primary/15 rounded" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>

            {/* JD Matching */}
            <div className="col-span-12 md:col-span-6 bg-white p-8 rounded-2xl border border-outline-variant hover:border-primary/40 hover:shadow-lg transition-all duration-300">
              <span className="material-symbols-outlined text-primary mb-3 block" style={{ fontSize: '32px' }}>target</span>
              <h3 className="font-h2 text-h2 mb-3">Job Description Matching</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-5">
                Paste any JD and our AI scores keyword density, identifies gaps, and tailors your resume to pass every ATS gate.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '87%' }} />
                </div>
                <span className="font-bold text-secondary text-sm font-mono">87%</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant">match</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Story */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full mb-6">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>groups</span>
              <span className="font-label-caps text-label-caps text-on-primary-fixed-variant uppercase tracking-widest">About ApplyAI</span>
            </div>
            <h2 className="font-h1 text-h1 mb-6">Built by job seekers,<br />for job seekers.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-5">
              We founded ApplyAI after watching hundreds of qualified candidates fail ATS screening — not because they lacked skills, but because their resumes weren't optimised.
            </p>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
              Our mission: give every professional — regardless of budget — access to the same career tools that executives pay thousands for.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '200K+', label: 'Resumes Built'  },
                { value: '98%',   label: 'ATS Pass Rate'  },
                { value: '4.9★',  label: 'User Rating'    },
              ].map((s) => (
                <div key={s.label} className="text-center p-4 rounded-xl bg-surface-container-low border border-outline-variant">
                  <p className="font-h1 text-2xl font-black text-primary mb-1">{s.value}</p>
                  <p className="font-body-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Team grid */}
          <div>
            <p className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest mb-6">Meet the team</p>
            <div className="grid grid-cols-2 gap-4">
              {TEAM.map((member) => (
                <div key={member.initials} className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant hover:border-primary/30 hover:shadow-md transition-all duration-200">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg"
                    style={{ background: member.bg }}
                  >
                    {member.initials}
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant">{member.role}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/15 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>diversity_3</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                We're a remote-first team of <strong>12 people</strong> across 6 countries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Comparison ── */}
      <section id="pricing" className="py-24 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="font-h1 text-h1 mb-4">The Smarter Choice</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Compare ApplyAI with traditional builders.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-outline-variant">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-surface-container-low">
                  <th className="text-left py-5 px-6 font-h2 text-h2">Features</th>
                  <th className="text-center py-5 px-6 font-h2 text-h2 text-primary">ApplyAI</th>
                  <th className="text-center py-5 px-6 font-h2 text-h2 opacity-40">Competitors</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-50 hover:bg-surface-container-low transition-colors">
                    <td className="py-5 px-6 font-body-md font-semibold text-on-background">{row.feature}</td>
                    <td className="text-center py-5 px-6">
                      {row.applyai === 'check' ? (
                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      ) : (
                        <span className="font-body-sm font-bold text-secondary">{row.applyai}</span>
                      )}
                    </td>
                    <td className="text-center py-5 px-6">
                      {row.competitor === 'cancel' ? (
                        <span className="material-symbols-outlined text-error">cancel</span>
                      ) : (
                        <span className="font-body-sm text-on-surface-variant italic">{row.competitor}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 bg-white rounded-2xl p-12 flex flex-col items-center text-center border border-outline-variant">
            <h3 className="font-h1 text-h1 mb-4">Ready to land your dream job?</h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
              Join 200,000+ professionals who have upgraded their career narrative with ApplyAI.
            </p>
            <button onClick={openAuthModal} className="ai-sparkle-button px-10 py-5 rounded-xl font-h2 text-xl flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Start Your Resume — Free
            </button>
            <p className="mt-4 font-body-sm text-body-sm text-on-surface-variant">
              3 free AI credits included. No credit card required.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
