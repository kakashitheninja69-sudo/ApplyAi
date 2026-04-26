import { useNavigate } from 'react-router-dom'
import TopNav from '@/components/layout/TopNav'
import Footer from '@/components/layout/Footer'
import { useResumeStore } from '@/store/resumeStore'
import type { TemplateId } from '@/types/resume'

const TEMPLATES: {
  id: TemplateId
  label: string
  subtitle: string
  description: string
  tags: string[]
  preview: React.ReactNode
}[] = [
  {
    id: 'modern-sidebar',
    label: 'Modern Sidebar',
    subtitle: 'Creative & Tech Roles',
    description:
      'A vibrant two-column layout with a colored sidebar. Perfect for designers, engineers, and creative professionals who want to stand out.',
    tags: ['Tech', 'Creative', 'Startup'],
    preview: (
      <div className="w-full h-full bg-white flex rounded-sm overflow-hidden">
        <div className="w-1/3 bg-slate-700 p-3 space-y-3">
          <div className="w-10 h-10 rounded-full bg-white/25 mx-auto" />
          <div className="h-1.5 w-full bg-white/25 rounded" />
          <div className="h-1.5 w-3/4 bg-white/20 rounded" />
          <div className="pt-4 space-y-1.5">
            <div className="h-1 w-full bg-white/15 rounded" />
            <div className="h-1 w-full bg-white/15 rounded" />
            <div className="h-1 w-4/5 bg-white/15 rounded" />
          </div>
        </div>
        <div className="w-2/3 p-4 space-y-3">
          <div className="h-3 w-1/2 bg-blue-100 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
          <div className="pt-2 h-2 w-1/3 bg-slate-200 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'classic-professional',
    label: 'Classic Professional',
    subtitle: 'Corporate & Finance',
    description:
      'A clean, centred header with traditional section formatting. Trusted by recruiters in banking, law, consulting, and corporate environments.',
    tags: ['Finance', 'Law', 'Corporate'],
    preview: (
      <div className="w-full h-full bg-white p-5 space-y-4 rounded-sm">
        <div className="text-center space-y-1.5 pb-3 border-b border-slate-200">
          <div className="h-3 w-1/3 bg-blue-200 mx-auto rounded" />
          <div className="h-1.5 w-1/4 bg-slate-200 mx-auto rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-1/4 bg-slate-300 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-2/3 bg-slate-100 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-1/4 bg-slate-300 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'minimal-clean',
    label: 'Minimal Clean',
    subtitle: 'Modern & High Readability',
    description:
      'A two-column label-plus-content layout with maximum white space. Scores top marks with ATS systems and human reviewers alike.',
    tags: ['Product', 'Management', 'Any Industry'],
    preview: (
      <div className="w-full h-full bg-white p-5 space-y-4 rounded-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="h-4 w-2/5 bg-slate-400 rounded" />
          <div className="h-1.5 w-1/5 bg-slate-200 rounded" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-1/4 border-r border-slate-200 pr-3 flex-shrink-0">
              <div className="h-1.5 w-full bg-slate-300 rounded" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="h-1.5 w-full bg-slate-100 rounded" />
              <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'executive',
    label: 'Executive',
    subtitle: 'Leadership & C-Suite',
    description:
      'A commanding layout with an accent top bar and side panel. Designed to project authority and experience for senior leadership positions.',
    tags: ['Leadership', 'C-Suite', 'Director'],
    preview: (
      <div className="w-full h-full bg-white rounded-sm overflow-hidden">
        <div className="h-3 bg-blue-600 w-full" />
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1.5">
              <div className="h-4 w-36 bg-slate-800 rounded" />
              <div className="h-1.5 w-24 bg-slate-400 rounded" />
            </div>
            <div className="h-6 w-6 bg-slate-200 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-2 w-1/2 bg-slate-300 rounded" />
                <div className="h-1.5 w-full bg-slate-100 rounded" />
                <div className="h-1.5 w-full bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
]

export default function TemplatesPage() {
  const navigate = useNavigate()
  const { setTemplate, openAuthModal } = useResumeStore()

  function handleUseTemplate(id: TemplateId) {
    setTemplate(id)
    navigate('/builder')
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNav activeLink="templates" />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full mb-6">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>
              style
            </span>
            <span className="font-label-caps text-label-caps text-on-primary-fixed-variant uppercase tracking-widest">
              4 ATS-Optimised Templates
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-background mb-4">
            Choose Your <span className="text-primary">Template</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Every template is engineered for Applicant Tracking Systems and designed by career experts. Pick one and customise it in minutes.
          </p>
        </div>
      </section>

      {/* Template Grid */}
      <section className="py-20 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {TEMPLATES.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-outline-variant overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                {/* Preview thumbnail */}
                <div className="aspect-[3/4] bg-gray-50 p-6 relative overflow-hidden">
                  <div className="w-full h-full group-hover:scale-[1.03] transition-transform duration-500 paper-shadow">
                    {t.preview}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="font-h2 text-h2 text-on-background mb-1">{t.label}</h3>
                    <p className="font-body-sm text-body-sm text-primary font-semibold mb-3">{t.subtitle}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">{t.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {t.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUseTemplate(t.id)}
                    className="w-full py-3 rounded-xl bg-primary text-white font-body-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      edit_document
                    </span>
                    Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
              Not sure which to pick? Our AI will recommend the best template for your industry.
            </p>
            <button
              onClick={openAuthModal}
              className="ai-sparkle-button px-8 py-4 rounded-xl font-h2 text-lg inline-flex items-center gap-3"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              Get AI Recommendation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
