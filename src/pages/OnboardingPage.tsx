import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import { useAuth } from '@/contexts/AuthContext'
import { ACCENT_COLORS, cn } from '@/lib/utils'
import TemplateThumbnail from '@/components/resume-templates/TemplateThumbnail'
import type { TemplateId, AccentColor, TypographyStyle } from '@/types/resume'

// ── Template categories shown in onboarding ───────────────────────────────────
const TEMPLATE_PICKS: {
  id: TemplateId
  label: string
  tag: string
  tagColor: string
  description: string
  icon: string
}[] = [
  {
    id: 'ats-clean',
    label: 'ATS-Friendly',
    tag: 'Most Hired',
    tagColor: '#059669',
    description: 'Passes every ATS scanner. Safe for any job application.',
    icon: 'verified',
  },
  {
    id: 'google-standard',
    label: 'FANG / Tech',
    tag: 'Google · Meta · Amazon',
    tagColor: '#003fb1',
    description: 'Used by engineers at top tech companies.',
    icon: 'code',
  },
  {
    id: 'modern-sidebar',
    label: 'Modern',
    tag: 'Startup & Creative',
    tagColor: '#7c3aed',
    description: 'Colourful sidebar layout that stands out.',
    icon: 'auto_awesome',
  },
  {
    id: 'minimal-clean',
    label: 'Minimal',
    tag: 'Clean & Simple',
    tagColor: '#0d9488',
    description: 'Maximum white space. High readability.',
    icon: 'article',
  },
  {
    id: 'executive',
    label: 'Executive',
    tag: 'Leadership & C-Suite',
    tagColor: '#1e293b',
    description: 'Commands authority for senior positions.',
    icon: 'business_center',
  },
  {
    id: 'creative-portfolio',
    label: 'Creative',
    tag: 'Designers & Artists',
    tagColor: '#db2777',
    description: 'Personality-forward with colour accents.',
    icon: 'palette',
  },
]

const FONT_OPTIONS: { id: TypographyStyle; label: string; sample: string; subtitle: string; fontFamily: string }[] = [
  { id: 'corporate-sans',  label: 'Modern Sans',    sample: 'Aa', subtitle: 'Bold & professional', fontFamily: 'Manrope, sans-serif' },
  { id: 'classic-serif',   label: 'Classic Serif',  sample: 'Aa', subtitle: 'Elegant & timeless',  fontFamily: 'Newsreader, serif' },
  { id: 'modern-rounded',  label: 'DM Sans',         sample: 'Aa', subtitle: 'Friendly & clean',    fontFamily: 'DM Sans, sans-serif' },
  { id: 'executive-serif', label: 'Executive',       sample: 'Aa', subtitle: 'Polished & senior',   fontFamily: 'Lora, serif' },
]

export default function OnboardingPage() {
  const navigate       = useNavigate()
  const { currentUser } = useAuth()
  const { resetBuilder, setTypography } = useResumeStore()

  const [step,     setStep]     = useState<1 | 2>(1)
  const [template, setTemplate] = useState<TemplateId>('ats-clean')
  const [accent,   setAccent]   = useState<AccentColor>('primary')
  const [font,     setFont]     = useState<TypographyStyle>('corporate-sans')

  const firstName = currentUser?.displayName?.split(' ')[0] || 'there'

  function handleStart() {
    resetBuilder(template, accent)
    setTypography(font)
    navigate('/builder')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">

      {/* Top bar */}
      <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <span style={{ fontSize: '18px', fontWeight: 800, color: '#003fb1', letterSpacing: '-0.5px' }}>ApplyAI</span>
        <div className="flex items-center gap-2">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  width: '24px', height: '24px',
                  background: step >= s ? '#003fb1' : '#e2e8f0',
                  color:      step >= s ? '#fff'    : '#94a3b8',
                }}
              >
                {step > s ? '✓' : s}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: step === s ? '#0f172a' : '#94a3b8' }}>
                {s === 1 ? 'Choose Template' : 'Customise'}
              </span>
              {s < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>
        <div style={{ width: '80px' }} />
      </div>

      {/* ── STEP 1: Choose Template ── */}
      {step === 1 && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

          {/* Left: choices */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-12">
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.5px' }}>
              Hi {firstName}, choose your style
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '32px' }}>
              Pick a template that fits the job you're going for. You can change it anytime.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {TEMPLATE_PICKS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    'text-left p-4 rounded-2xl border-2 transition-all duration-200 hover:shadow-md bg-white',
                    template === t.id
                      ? 'border-primary shadow-md'
                      : 'border-gray-100 hover:border-gray-200'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${t.tagColor}15` }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: t.tagColor, fontVariationSettings: "'FILL' 1" }}>
                        {t.icon}
                      </span>
                    </div>
                    {template === t.id && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-white" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>check</span>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{t.label}</p>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: t.tagColor, marginBottom: '6px' }}>{t.tag}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right: live preview */}
          <div className="hidden lg:flex flex-col w-[340px] shrink-0 bg-white border-l border-gray-100 p-6">
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px' }}>
              Live Preview
            </p>
            <div className="rounded-xl overflow-hidden shadow-xl flex-1" style={{ maxHeight: '520px' }}>
              <TemplateThumbnail templateId={template} accentColor={accent} />
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '12px' }}>
              {TEMPLATE_PICKS.find(t => t.id === template)?.label} template
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 2: Customise ── */}
      {step === 2 && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

          {/* Left: customisation */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-12">
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.5px' }}>
              Make it yours
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '36px' }}>
              Choose a colour and font style. You can always change these later.
            </p>

            {/* Colour */}
            <div className="mb-10">
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Accent Colour
              </p>
              <div className="flex flex-wrap gap-3">
                {(Object.entries(ACCENT_COLORS) as [AccentColor, { hex: string; label: string }][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setAccent(key)}
                    title={val.label}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div
                      className="w-10 h-10 rounded-full transition-all duration-150"
                      style={{
                        backgroundColor: val.hex,
                        outline:      accent === key ? `3px solid ${val.hex}` : 'none',
                        outlineOffset: '3px',
                        transform:    accent === key ? 'scale(1.15)' : 'scale(1)',
                        boxShadow:    accent === key ? `0 4px 12px ${val.hex}50` : 'none',
                      }}
                    />
                    <span style={{ fontSize: '10px', fontWeight: 600, color: accent === key ? '#0f172a' : '#94a3b8' }}>
                      {val.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font */}
            <div className="mb-10">
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Font Style
              </p>
              <div className="grid grid-cols-2 gap-3">
                {FONT_OPTIONS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFont(f.id)}
                    className={cn(
                      'text-left py-4 px-4 rounded-2xl border-2 transition-all bg-white',
                      font === f.id ? 'border-primary shadow-md' : 'border-gray-100 hover:border-gray-200'
                    )}
                  >
                    <p
                      style={{
                        fontSize:   '28px',
                        fontFamily: f.fontFamily,
                        fontWeight: 700,
                        color:      font === f.id ? '#003fb1' : '#94a3b8',
                        marginBottom: '4px',
                        lineHeight: 1,
                      }}
                    >
                      {f.sample}
                    </p>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: font === f.id ? '#0f172a' : '#64748b' }}>{f.label}</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{f.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: live preview */}
          <div className="hidden lg:flex flex-col w-[340px] shrink-0 bg-white border-l border-gray-100 p-6">
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px' }}>
              Live Preview
            </p>
            <div className="rounded-xl overflow-hidden shadow-xl flex-1" style={{ maxHeight: '520px' }}>
              <TemplateThumbnail templateId={template} accentColor={accent} />
            </div>
            <div
              className="mt-3 px-3 py-2 rounded-lg text-center"
              style={{ background: `${ACCENT_COLORS[accent]?.hex}12`, color: ACCENT_COLORS[accent]?.hex }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600 }}>
                {ACCENT_COLORS[accent]?.label} · {FONT_OPTIONS.find(f => f.id === font)?.label ?? 'Modern Sans'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="bg-white border-t border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
        {step === 2 ? (
          <button onClick={() => setStep(1)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            Back
          </button>
        ) : (
          <div />
        )}

        {step === 1 ? (
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #003fb1 0%, #0055f5 100%)', boxShadow: '0 4px 14px rgba(0,63,177,0.3)' }}
          >
            Next — Customise
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-10 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #003fb1 0%, #0055f5 100%)', boxShadow: '0 6px 20px rgba(0,63,177,0.35)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            Start Building My Resume
          </button>
        )}
      </div>
    </div>
  )
}
