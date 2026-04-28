// FILE: src/components/resume-templates/GoogleStandard.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function GoogleStandard({ data }: TemplateProps) {
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
      {/* Name row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingBottom: '14px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '24px',
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
        </div>
        <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {contact.email    && <span>✉ {contact.email}</span>}
          {contact.phone    && <span>☎ {contact.phone}</span>}
          {contact.location && <span>⊙ {contact.location}</span>}
          {contact.linkedin && <span>in {contact.linkedin}</span>}
          {contact.website  && <span>↗ {contact.website}</span>}
        </div>
      </div>

      {summary && (
        <GSection accent={accent} hFont={hFont} label="Summary">
          <p style={{ color: '#475569', lineHeight: '1.7' }}>{summary}</p>
        </GSection>
      )}

      {work.some((w) => w.company || w.role) && (
        <GSection accent={accent} hFont={hFont} label="Experience">
          {work.map((w) => (
            <div key={w.id} style={{ marginBottom: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '2px',
                }}
              >
                <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{w.role || 'Role'}</p>
                <p style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {formatDateRange(w.startDate, w.endDate, w.current)}
                </p>
              </div>
              <p style={{ color: '#475569', fontSize: '11px', marginBottom: '6px' }}>{w.company}</p>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {w.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ listStyleType: 'disc', color: '#475569' }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </GSection>
      )}

      {education.some((e) => e.institution) && (
        <GSection accent={accent} hFont={hFont} label="Education">
          {education.map((e) => (
            <div
              key={e.id}
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}
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
        </GSection>
      )}

      {skills.length > 0 && (
        <GSection accent={accent} hFont={hFont} label="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skills.map((s) => (
              <span
                key={s.id}
                style={{
                  background: '#f1f5f9',
                  borderRadius: '4px',
                  padding: '2px 10px',
                  fontSize: '10px',
                  color: '#334155',
                }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </GSection>
      )}
    </div>
  )
}

function GSection({
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
          fontSize: '12px',
          color: '#1e293b',
          borderLeft: `3px solid ${accent}`,
          paddingLeft: '8px',
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
