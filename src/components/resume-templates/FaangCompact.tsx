// FILE: src/components/resume-templates/FaangCompact.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function FaangCompact({ data }: TemplateProps) {
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
        padding: '28px 40px 28px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '10px',
        lineHeight: '1.4',
        color: '#1e293b',
        background: '#fff',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '10px' }}>
        <h1
          style={{
            fontFamily: hFont,
            fontSize: '18px',
            fontWeight: 700,
            color: '#1e293b',
            margin: 0,
          }}
        >
          {contact.name || 'Your Name'}
        </h1>
        {contact.title && (
          <p style={{ fontSize: '10px', color: '#64748b', marginTop: '1px', fontWeight: 500 }}>
            {contact.title}
          </p>
        )}
        {contactParts.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 12px', fontSize: '9px', color: '#64748b', marginTop: '3px' }}>
            {contact.email    && <span>✉ {contact.email}</span>}
            {contact.phone    && <span>☎ {contact.phone}</span>}
            {contact.location && <span>⊙ {contact.location}</span>}
            {contact.linkedin && <span>in {contact.linkedin}</span>}
            {contact.website  && <span>↗ {contact.website}</span>}
          </div>
        )}
      </div>

      {summary && (
        <FSection accent={accent} hFont={hFont} label="Summary">
          <p style={{ color: '#475569' }}>{summary}</p>
        </FSection>
      )}

      {work.some((w) => w.company || w.role) && (
        <FSection accent={accent} hFont={hFont} label="Experience">
          {work.map((w) => (
            <div key={w.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 700, fontSize: '10px', fontFamily: hFont }}>
                  {w.role || 'Role'}
                  {w.company ? (
                    <span style={{ fontWeight: 500, color: '#64748b' }}> — {w.company}</span>
                  ) : null}
                </p>
                <p style={{ fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {formatDateRange(w.startDate, w.endDate, w.current)}
                </p>
              </div>
              <ul
                style={{
                  paddingLeft: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  marginTop: '2px',
                }}
              >
                {w.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ listStyleType: 'disc', color: '#475569' }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </FSection>
      )}

      {education.some((e) => e.institution) && (
        <FSection accent={accent} hFont={hFont} label="Education">
          {education.map((e) => (
            <div
              key={e.id}
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}
            >
              <div>
                <span style={{ fontWeight: 700 }}>{e.institution}</span>
                <span style={{ color: '#64748b' }}>
                  {' — '}
                  {[e.degree, e.field].filter(Boolean).join(', ')}
                  {e.gpa ? ` · GPA ${e.gpa}` : ''}
                </span>
              </div>
              <p style={{ fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                {formatDateRange(e.startDate, e.endDate, false)}
              </p>
            </div>
          ))}
        </FSection>
      )}

      {skills.length > 0 && (
        <FSection accent={accent} hFont={hFont} label="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {skills.map((s) => (
              <span
                key={s.id}
                style={{
                  border: `1px solid #cbd5e1`,
                  borderRadius: '3px',
                  padding: '1px 6px',
                  fontSize: '9px',
                  color: '#334155',
                }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </FSection>
      )}
    </div>
  )
}

function FSection({
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
    <div style={{ marginBottom: '10px' }}>
      <p
        style={{
          fontFamily: hFont,
          fontWeight: 700,
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: '#1e293b',
          borderBottom: '1px solid #94a3b8',
          paddingBottom: '2px',
          marginBottom: '6px',
        }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}
// ---END FILE---
