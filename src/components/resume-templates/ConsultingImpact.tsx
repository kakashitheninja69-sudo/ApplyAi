// FILE: src/components/resume-templates/ConsultingImpact.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function ConsultingImpact({ data }: TemplateProps) {
  const accent = accentHex(data)
  const hFont = headingFont(data)
  const { contact, work, education, skills, summary } = data

  const contactParts = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedin,
    contact.website,
  ].filter(Boolean)

  return (
    <div
      style={{
        width: '794px',
        minHeight: '1123px',
        padding: '52px 64px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        lineHeight: '1.6',
        color: '#1e293b',
        background: '#fff',
      }}
    >
      {/* Centered Header */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h1
          style={{
            fontFamily: hFont,
            fontSize: '20px',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
            letterSpacing: '0.01em',
          }}
        >
          {contact.name || 'Your Name'}
        </h1>
        {contact.title && (
          <p style={{ fontSize: '12px', color: '#475569', marginTop: '3px', fontWeight: 500 }}>
            {contact.title}
          </p>
        )}
        {contactParts.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2px 14px', fontSize: '10px', color: '#64748b', marginTop: '6px' }}>
            {contact.email    && <span>✉ {contact.email}</span>}
            {contact.phone    && <span>☎ {contact.phone}</span>}
            {contact.location && <span>⊙ {contact.location}</span>}
            {contact.linkedin && <span>in {contact.linkedin}</span>}
            {contact.website  && <span>↗ {contact.website}</span>}
          </div>
        )}
      </div>

      {/* Double-rule divider */}
      <div style={{ marginBottom: '24px', marginTop: '12px' }}>
        <div style={{ height: '2px', background: '#0f172a' }} />
        <div style={{ height: '3px' }} />
        <div style={{ height: '0.5px', background: accent }} />
      </div>

      {summary && (
        <CSection accent={accent} hFont={hFont} label="Executive Summary">
          <p style={{ color: '#475569', lineHeight: '1.7', textAlign: 'justify' }}>{summary}</p>
        </CSection>
      )}

      {work.some((w) => w.company || w.role) && (
        <CSection accent={accent} hFont={hFont} label="Professional Experience">
          {work.map((w) => (
            <div key={w.id} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{w.role || 'Role'}</p>
                <p style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {formatDateRange(w.startDate, w.endDate, w.current)}
                </p>
              </div>
              <p style={{ color: '#475569', fontSize: '11px', fontStyle: 'italic', marginBottom: '6px' }}>
                {w.company}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {w.bullets.filter(Boolean).map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', color: '#475569' }}>
                    <span style={{ flexShrink: 0, color: '#64748b' }}>–</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CSection>
      )}

      {education.some((e) => e.institution) && (
        <CSection accent={accent} hFont={hFont} label="Education">
          {education.map((e) => (
            <div
              key={e.id}
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{e.institution}</p>
                <p style={{ color: '#64748b' }}>
                  {[e.degree, e.field].filter(Boolean).join(', ')}
                  {e.gpa ? ` — GPA ${e.gpa}` : ''}
                </p>
              </div>
              <p style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                {formatDateRange(e.startDate, e.endDate, false)}
              </p>
            </div>
          ))}
        </CSection>
      )}

      {skills.length > 0 && (
        <CSection accent={accent} hFont={hFont} label="Core Competencies">
          <p style={{ color: '#475569' }}>{skills.map((s) => s.name).join(' · ')}</p>
        </CSection>
      )}
    </div>
  )
}

function CSection({
  accent,
  hFont,
  label,
  children,
}: {
  accent: string
  hFont: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <p
          style={{
            fontFamily: hFont,
            fontWeight: 600,
            fontSize: '11px',
            fontVariant: 'small-caps',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#0f172a',
            display: 'inline-block',
            margin: 0,
          }}
        >
          {label}
        </p>
        <div style={{ height: '1px', background: accent, marginTop: '4px' }} />
      </div>
      {children}
    </div>
  )
}
// ---END FILE---
