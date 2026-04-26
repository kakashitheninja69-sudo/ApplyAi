import { useNavigate } from 'react-router-dom'
import TopNav from '@/components/layout/TopNav'
import Footer from '@/components/layout/Footer'
import { useResumeStore } from '@/store/resumeStore'

const FEATURES = [
  {
    icon: 'visibility',
    title: 'Real-time Live Preview',
    body: 'Every edit reflected instantly on a perfectly scaled A4 canvas as you type. No refreshes, no guessing.',
    span: 'md:col-span-6',
  },
  {
    icon: 'target',
    title: 'Job Description Matching',
    body: 'Paste a JD and our AI analyses keyword density and skill gaps, ensuring your resume passes every ATS gatekeeper.',
    span: 'md:col-span-6',
  },
]

const COMPARISON = [
  { feature: 'AI Content Generation',   applyai: 'check', competitor: 'Standard Templates Only' },
  { feature: 'ATS Optimization Score',  applyai: 'check', competitor: 'cancel' },
  { feature: 'Unlimited PDF Exports',   applyai: 'Free Forever', competitor: '$19.99 / Month' },
  { feature: 'JD Match Analysis',       applyai: 'check', competitor: 'cancel' },
  { feature: 'Real-time Live Edit',     applyai: 'check', competitor: 'Refresh Required' },
]

export default function LandingPage() {
  const navigate  = useNavigate()
  const openModal = useResumeStore((s) => s.openAuthModal)

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNav activeLink="home" />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-16">
        <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
          {/* Copy */}
          <div className="z-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full mb-6">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
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
              Free, AI-powered, and ATS-optimized. Leverage the same technology
              recruiters use to get your resume to the top of the pile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={openModal}
                className="ai-sparkle-button px-8 py-4 rounded-xl font-h2 text-lg flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  rocket_launch
                </span>
                Build My Resume Free
              </button>
              <button
                onClick={() => navigate('/builder')}
                className="px-8 py-4 rounded-xl border border-outline-variant font-h2 text-lg flex items-center justify-center gap-3 hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined">play_circle</span>
                Watch Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {['1','2','3'].map((n) => (
                  <div
                    key={n}
                    className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center"
                    style={{ zIndex: Number(n) }}
                  >
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>
                      person
                    </span>
                  </div>
                ))}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <span className="font-bold text-on-background">10,000+</span>{' '}
                professionals hired this month
              </p>
            </div>
          </div>

          {/* Mock Resume Card */}
          <div className="relative lg:h-[680px] flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-[460px] paper-shadow bg-white p-8 rounded-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="h-7 w-44 bg-gray-100 rounded mb-3" />
                <div className="h-3 w-full bg-gray-50 rounded mb-2" />
                <div className="h-3 w-2/3 bg-gray-50 rounded" />
              </div>
              <div className="space-y-6">
                <div>
                  <div className="h-4 w-28 bg-primary/10 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-2.5 w-full bg-gray-50 rounded" />
                    <div className="h-2.5 w-full bg-gray-50 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      <div className="h-2.5 w-5/6 bg-secondary-container rounded" />
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="h-4 w-36 bg-gray-100 rounded mb-4" />
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-6 bg-blue-50 rounded-full border border-blue-100" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating AI badge */}
              <div className="absolute -top-5 -right-5 bg-white p-3.5 rounded-xl shadow-xl border border-primary/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-primary uppercase tracking-widest leading-none mb-0.5">
                    AI Score
                  </p>
                  <p className="font-h2 text-sm font-bold">98 / 100</p>
                </div>
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
            {/* 6-Step Builder — wide card */}
            <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-xl border border-outline-variant hover:border-primary transition-colors group">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1">
                  <span className="material-symbols-outlined text-primary mb-4 block" style={{ fontSize: '36px' }}>
                    instant_mix
                  </span>
                  <h3 className="font-h2 text-h2 mb-4">6-Step Intelligent Builder</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                    From blank page to polished resume through a structured, AI-assisted narrative approach.
                  </p>
                  <ul className="space-y-3">
                    {['Contact & Profile Focus', 'Experience Storytelling', 'Skills & Impact Mapping'].map((item) => (
                      <li key={item} className="flex items-center gap-3 font-body-sm text-body-sm font-medium">
                        <span
                          className="material-symbols-outlined text-secondary"
                          style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}
                        >
                          check_circle
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 bg-surface rounded-lg p-6 relative overflow-hidden h-56 md:h-auto">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60" />
                  <div className="space-y-3 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    {[100, 75, 100, 50, 88, 60].map((w, i) => (
                      <div key={i} className="h-2 bg-primary/20 rounded" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Bullet Points */}
            <div className="col-span-12 lg:col-span-4 bg-primary-container text-white p-10 rounded-xl flex flex-col justify-between">
              <div>
                <span
                  className="material-symbols-outlined mb-4 block"
                  style={{ fontSize: '36px', fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <h3 className="font-h2 text-h2 mb-4">AI Bullet Points</h3>
                <p className="opacity-90 font-body-md text-body-md">
                  Transform vague job duties into high-impact, metric-driven achievements.
                </p>
              </div>
              <div className="mt-8 bg-white/10 p-4 rounded-lg border border-white/20">
                <p className="font-label-caps text-label-caps opacity-60 uppercase tracking-widest mb-1.5">Before</p>
                <p className="font-body-sm text-body-sm italic opacity-70 mb-3 line-through">
                  "Managed a team of five and sold software."
                </p>
                <p className="font-label-caps text-label-caps text-secondary-fixed uppercase tracking-widest mb-1.5">
                  After AI Enhancement
                </p>
                <p className="font-body-sm text-body-sm font-semibold">
                  "Spearheaded a 5-person team, driving 40% SaaS revenue growth in Q3."
                </p>
              </div>
            </div>

            {/* Two bottom cards */}
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`col-span-12 ${f.span} bg-white p-10 rounded-xl border border-outline-variant hover:border-primary transition-colors`}
              >
                <span className="material-symbols-outlined text-primary mb-4 block" style={{ fontSize: '36px' }}>
                  {f.icon}
                </span>
                <h3 className="font-h2 text-h2 mb-4">{f.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Comparison ── */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="font-h1 text-h1 mb-4">The Smarter Choice</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Compare ApplyAI with traditional builders.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-outline-variant">
            <table className="w-full border-collapse">
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
                        <span
                          className="material-symbols-outlined text-secondary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
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
          <div className="mt-16 bg-surface-container rounded-2xl p-12 flex flex-col items-center text-center">
            <h3 className="font-h1 text-h1 mb-4">Ready to land your dream job?</h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
              Join 200,000+ professionals who have upgraded their career narrative with ApplyAI.
            </p>
            <button
              onClick={openModal}
              className="ai-sparkle-button px-10 py-5 rounded-xl font-h2 text-xl flex items-center gap-3"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              Start Your Resume — Free
            </button>
            <p className="mt-4 font-body-sm text-body-sm text-on-surface-variant">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
