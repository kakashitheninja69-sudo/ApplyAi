// FILE: src/components/resume-templates/AmazonResults.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function AmazonResults({ data }: TemplateProps) {
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
        padding: '48px 52px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#1e293b',
        background: '#fff',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: hFont,
              fontSize: '22px',
              fontWeight: 700,
              color: '#1e293b',
              margin: 0,
            }}
          >
            {contact.name || 'Your Name'}
          </h1>
          {contact.title && (
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
              {contact.title}
            </p>
          )}
          {contact.title && (
            <p style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>
              Principles-driven results
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right', fontSize: '10px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {contact.email    && <span>✉ {contact.email}</span>}
          {contact.phone    && <span>☎ {contact.phone}</span>}
          {contact.location && <span>⊙ {contact.location}</span>}
          {contact.linkedin && <span>in {contact.linkedin}</span>}
          {contact.website  && <span>↗ {contact.website}</span>}
        </div>
      </div>

      <div style={{ height: '2px', background: accent, marginBottom: '24px', marginTop: '8px' }} />

      {summary && (
        <ASection accent={accent} hFont={hFont} label="Professional Summary">
          <p style={{ color: '#475569', lineHeight: '1.7' }}>{summary}</p>
        </ASection>
      )}

      {work.some((w) => w.company || w.role) && (
        <ASection accent={accent} hFont={hFont} label="Leadership & Impact">
          {work.map((w) => (
            <div key={w.id} style={{ marginBottom: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{w.role || 'Role'}</p>
                <p style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {formatDateRange(w.startDate, w.endDate, w.current)}
                </p>
              </div>
              <p style={{ color: accent, fontWeight: 600, fontSize: '11px', marginBottom: '6px' }}>
                {w.company}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '4px' }}>
                {w.bullets.filter(Boolean).map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: '6px', color: '#475569' }}>
                    <span style={{ color: accent, flexShrink: 0 }}>▸</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ASection>
      )}

      {education.some((e) => e.institution) && (
        <ASection accent={accent} hFont={hFont} label="Education">
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
        </ASection>
      )}

      {skills.length > 0 && (
        <ASection accent={accent} hFont={hFont} label="Core Competencies">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skills.map((s) => (
              <span
                key={s.id}
                style={{
                  border: `1px solid ${accent}50`,
                  borderRadius: '3px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  color: '#334155',
                }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </ASection>
      )}
    </div>
  )
}

function ASection({
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
      <p
        style={{
          fontFamily: hFont,
          fontWeight: 700,
          fontSize: '11px',
          fontVariant: 'small-caps',
          letterSpacing: '0.08em',
          color: '#1e293b',
          textTransform: 'uppercase',
          borderBottom: `2px solid ${accent}`,
          paddingBottom: '4px',
          marginBottom: '12px',
        }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}
// ---END FILE---
