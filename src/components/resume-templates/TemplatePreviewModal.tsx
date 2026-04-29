import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import { ACCENT_COLORS, cn } from '@/lib/utils'
import TemplateThumbnail from './TemplateThumbnail'
import type { TemplateId, AccentColor } from '@/types/resume'

export interface TemplatePreviewEntry {
  id: TemplateId
  label: string
  subtitle: string
  description: string
  tags: string[]
  defaultAccent: AccentColor
  badge?: string
  features?: string[]
}

interface Props {
  template: TemplatePreviewEntry | null
  initialAccent?: AccentColor
  onClose: () => void
}

export default function TemplatePreviewModal({ template, initialAccent, onClose }: Props) {
  const navigate     = useNavigate()
  const resetBuilder = useResumeStore(s => s.resetBuilder)
  const [accent,      setAccent]      = useState<AccentColor>(initialAccent ?? template?.defaultAccent ?? 'primary')
  const [show,        setShow]        = useState(false)
  const [fullPreview, setFullPreview] = useState(false)

  useEffect(() => {
    if (template) {
      setAccent(initialAccent ?? template.defaultAccent)
      const t = setTimeout(() => setShow(true), 20)
      return () => clearTimeout(t)
    } else {
      setShow(false)
      setFullPreview(false)
    }
  }, [template, initialAccent])

  useEffect(() => {
    if (template) document.body.style.overflow = 'hidden'
    else          document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [template])

  // Close full preview on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullPreview) setFullPreview(false)
        else onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullPreview, onClose])

  if (!template) return null

  const hex = ACCENT_COLORS[accent]?.hex ?? '#003fb1'

  function handleUse() {
    resetBuilder(template!.id, accent)
    navigate('/builder')
  }

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  return createPortal(
    <>
      {/* ── Main preview modal ── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        style={{
          background: show ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
          transition: 'background 0.25s ease',
        }}
        onClick={handleBackdrop}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl flex overflow-hidden w-full"
          style={{
            maxWidth: '900px',
            maxHeight: '90vh',
            opacity:   show ? 1 : 0,
            transform: show ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Left: live preview */}
          <div className="hidden sm:flex flex-col w-72 xl:w-80 shrink-0 bg-gray-50 relative">
            {/* Accent top strip */}
            <div style={{ height: '3px', background: hex, flexShrink: 0 }} />

            {/* Scrollable thumbnail */}
            <div className="flex-1 overflow-y-auto">
              <TemplateThumbnail templateId={template.id} accentColor={accent} eager />
            </div>

            {/* Zoom button — sticky at bottom of left panel */}
            <button
              onClick={() => setFullPreview(true)}
              className="flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold transition-all shrink-0"
              style={{
                background: `${hex}12`,
                color: hex,
                borderTop: `1px solid ${hex}25`,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>zoom_in</span>
              Full Preview
            </button>
          </div>

          {/* Right: info */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between px-7 pt-7 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {template.badge && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ background: template.badge === 'ATS #1' ? '#059669' : '#f59e0b' }}
                    >
                      {template.badge}
                    </span>
                  )}
                  <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{template.label}</h2>
                </div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: hex }}>{template.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0 ml-4"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#64748b' }}>close</span>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 px-7 py-5 flex flex-col gap-5">
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>{template.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {template.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full"
                    style={{ background: `${hex}15`, color: hex, border: `1px solid ${hex}28` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Features */}
              {template.features && template.features.length > 0 && (
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '10px' }}>
                    Features
                  </p>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {template.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-500" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                        <span style={{ fontSize: '12px', color: '#475569' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Colour swatches */}
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '10px' }}>
                  Accent Colour
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {(Object.entries(ACCENT_COLORS) as [AccentColor, { hex: string; label: string }][]).map(([key, val]) => (
                    <button
                      key={key}
                      title={val.label}
                      onClick={() => setAccent(key)}
                      className={cn('rounded-full transition-all duration-150 hover:scale-110')}
                      style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: val.hex,
                        outline: accent === key ? `2px solid ${val.hex}` : 'none',
                        outlineOffset: '3px',
                        transform: accent === key ? 'scale(1.2)' : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="px-7 py-5 border-t border-gray-100">
              <button
                onClick={handleUse}
                className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 text-sm hover:opacity-90 active:scale-[0.98] transition-all"
                style={{ background: hex, boxShadow: `0 6px 20px ${hex}40` }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>edit_document</span>
                Use This Template
              </button>
              <p className="text-center mt-2" style={{ fontSize: '11px', color: '#94a3b8' }}>
                You can switch templates anytime inside the builder
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full-size lightbox ── */}
      {fullPreview && (
        <div
          className="fixed inset-0 z-[60] flex flex-col"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={() => setFullPreview(false)}
        >
          {/* Lightbox toolbar */}
          <div
            className="flex items-center justify-between px-6 py-3 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: hex }} />
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{template.label}</span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>Full Preview</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleUse}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-[13px] font-bold transition-all hover:opacity-90"
                style={{ background: hex }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px', fontVariationSettings: "'FILL' 1" }}>edit_document</span>
                Use This Template
              </button>
              <button
                onClick={() => setFullPreview(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            </div>
          </div>

          {/* Scrollable full-size template */}
          <div
            className="flex-1 overflow-y-auto flex justify-center py-8 px-4"
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '794px', maxWidth: '100%' }}>
              <div
                style={{
                  boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <TemplateThumbnail
                  templateId={template.id}
                  accentColor={accent}
                  eager
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  )
}
