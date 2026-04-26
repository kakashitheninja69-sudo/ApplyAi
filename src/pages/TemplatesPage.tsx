import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '@/components/layout/TopNav'
import Footer from '@/components/layout/Footer'
import { useResumeStore } from '@/store/resumeStore'
import { ACCENT_COLORS, cn } from '@/lib/utils'
import TemplateThumbnail from '@/components/resume-templates/TemplateThumbnail'
import type { TemplateId, AccentColor } from '@/types/resume'

const TEMPLATES: {
  id: TemplateId
  label: string
  subtitle: string
  description: string
  tags: string[]
  defaultAccent: AccentColor
}[] = [
  {
    id: 'modern-sidebar',
    label: 'Modern Sidebar',
    subtitle: 'Creative & Tech Roles',
    description: 'Vibrant two-column layout with a full-height colored sidebar. Stands out while remaining ATS-compatible.',
    tags: ['Tech', 'Creative', 'Startup'],
    defaultAccent: 'primary',
  },
  {
    id: 'classic-professional',
    label: 'Classic Professional',
    subtitle: 'Corporate & Finance',
    description: 'Centred header with traditional section formatting. Trusted by recruiters in banking, law, and consulting.',
    tags: ['Finance', 'Law', 'Corporate'],
    defaultAccent: 'slate',
  },
  {
    id: 'minimal-clean',
    label: 'Minimal Clean',
    subtitle: 'Modern & High Readability',
    description: 'Two-column label-plus-content layout with maximum white space. Scores top marks with ATS systems.',
    tags: ['Product', 'Management', 'Any Industry'],
    defaultAccent: 'teal',
  },
  {
    id: 'executive',
    label: 'Executive',
    subtitle: 'Leadership & C-Suite',
    description: 'Commanding layout with an accent top bar and side panel. Projects authority for senior positions.',
    tags: ['Leadership', 'C-Suite', 'Director'],
    defaultAccent: 'primary',
  },
]

export default function TemplatesPage() {
  const navigate = useNavigate()
  const { setTemplate, setAccentColor } = useResumeStore()

  // Per-card selected accent colour (defaults to each template's natural colour)
  const [cardAccents, setCardAccents] = useState<Record<TemplateId, AccentColor>>({
    'modern-sidebar':       'primary',
    'classic-professional': 'slate',
    'minimal-clean':        'teal',
    'executive':            'primary',
  })

  function handleUseTemplate(id: TemplateId) {
    setTemplate(id)
    setAccentColor(cardAccents[id])
    navigate('/builder')
  }

  function setCardAccent(id: TemplateId, color: AccentColor) {
    setCardAccents((prev) => ({ ...prev, [id]: color }))
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNav />

      {/* Hero */}
      <section className="pt-28 pb-14 bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full mb-5">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '15px' }}>style</span>
            <span className="font-label-caps text-label-caps text-on-primary-fixed-variant uppercase tracking-widest">
              4 ATS-Optimised Templates
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-background mb-4">
            Choose Your <span className="text-primary">Template</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Every template is engineered for Applicant Tracking Systems. Pick one, choose your colour, and customise it in minutes — no sign-up required.
          </p>
        </div>
      </section>

      {/* Template Grid */}
      <section className="py-16 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {TEMPLATES.map((t) => {
              const accent = cardAccents[t.id]
              const accentHex = ACCENT_COLORS[accent].hex

              return (
                <div
                  key={t.id}
                  className="group bg-white rounded-2xl border border-outline-variant overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  style={{ '--card-accent': accentHex } as React.CSSProperties}
                >
                  {/* Thumbnail with hover overlay */}
                  <div className="relative overflow-hidden bg-gray-50 cursor-pointer" onClick={() => handleUseTemplate(t.id)}>
                    <TemplateThumbnail templateId={t.id} accentColor={accent} />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0">
                        <div className="bg-white text-on-background font-body-sm font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
                            preview
                          </span>
                          Use This Template
                        </div>
                      </div>
                    </div>

                    {/* Top accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
                      style={{ background: accentHex }}
                    />
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-h2 text-[15px] font-bold text-on-background">{t.label}</h3>
                          <p className="font-body-sm text-[12px] font-semibold mt-0.5" style={{ color: accentHex }}>
                            {t.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-2 mb-3 leading-relaxed">{t.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {t.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: `${accentHex}15`, color: accentHex, border: `1px solid ${accentHex}25` }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Color swatches */}
                      <div className="mb-4">
                        <p className="font-label-caps text-[9px] uppercase tracking-widest text-on-surface-variant mb-2">Colour</p>
                        <div className="flex flex-wrap gap-2">
                          {(Object.entries(ACCENT_COLORS) as [AccentColor, { hex: string; label: string }][]).map(([key, { hex, label }]) => (
                            <button
                              key={key}
                              title={label}
                              onClick={() => setCardAccent(t.id, key)}
                              className={cn(
                                'w-6 h-6 rounded-full transition-all duration-150 hover:scale-110',
                                accent === key && 'ring-2 ring-offset-1 scale-110'
                              )}
                              style={{
                                backgroundColor: hex,
                                outline: accent === key ? `2px solid ${hex}` : 'none',
                                outlineOffset: '2px',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => handleUseTemplate(t.id)}
                      className="w-full py-2.5 rounded-xl font-body-sm text-[13px] font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                      style={{ background: accentHex, boxShadow: `0 4px 12px ${accentHex}40` }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit_document</span>
                      Use This Template
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom note */}
          <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-12">
            You can switch templates at any time inside the builder — your content is always preserved.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
