// FILE: src/components/resume-templates/CompactElite.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function CompactElite({ data }: TemplateProps) {
  const accent = accentHex(data)
  const hFont = headingFont(data)
  const { contact, work, education, skills, summary } = data

  const skillsByCategory: Record<string, typeof skills> = {
    Technical: skills.filter((s) => s.category === 'technical'),
    Tools: skills.filter((s) => s.category === 'tool'),
    Soft: skills.filter((s) => s.category === 'soft'),
    Languages: skills.filter((s) => s.category === 'language'),
  }

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
        padding: '20px 24px 20px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '10px',
        lineHeight: '1.4',
        color: '#1e293b',
        background: '#fff',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '8px' }}>
        <h1
          style={{
            fontFamily: hFont,
            fontSize: '16px',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
          }}
        >
          {contact.name || 'Your Name'}
        </h1>
        {contact.title && (
          <p style={{ fontSize: '10px', color: '#475569', marginTop: '1px', fontWeight: 500 }}>
            {contact.title}
          </p>
        )}
        {contactParts.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 12px', fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
            {contact.email    && <span>✉ {contact.email}</span>}
            {contact.phone    && <span>☎ {contact.phone}</span>}
            {contact.location && <span>⊙ {contact.location}</span>}
            {contact.linkedin && <span>in {contact.linkedin}</span>}
            {contact.website  && <span>↗ {contact.website}</span>}
          </div>
        )}
      </div>

      {summary && (
        <ElSection label="Summary">
          <p style={{ color: '#475569', margin: 0 }}>{summary}</p>
        </ElSection>
      )}

      {work.some((w) => w.company || w.role) && (
        <ElSection label="Experience">
          {work.map((w) => (
            <div key={w.id} style={{ marginBottom: '4px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <p style={{ fontWeight: 700, margin: 0 }}>
                  {w.role || 'Role'}
                  {w.company ? (
                    <span style={{ fontWeight: 500, color: accent }}> · {w.company}</span>
                  ) : null}
                </p>
                <p style={{ fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap', margin: 0 }}>
                  {formatDateRange(w.startDate, w.endDate, w.current)}
                </p>
              </div>
              <ul style={{ paddingLeft: '14px', margin: '2px 0 0' }}>
                {w.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ listStyleType: 'disc', color: '#475569', marginBottom: '2px' }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ElSection>
      )}

      {education.some((e) => e.institution) && (
        <ElSection label="Education">
          {education.map((e) => (
            <div
              key={e.id}
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}
            >
              <p style={{ margin: 0 }}>
                <strong>{e.institution}</strong>{' '}
                <span style={{ color: '#64748b' }}>
                  {[e.degree, e.field].filter(Boolean).join(', ')}
                  {e.gpa ? ` · GPA ${e.gpa}` : ''}
                </span>
              </p>
              <p style={{ fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap', margin: 0 }}>
                {formatDateRange(e.startDate, e.endDate, false)}
              </p>
            </div>
          ))}
        </ElSection>
      )}

      {skills.length > 0 && (
        <ElSection label="Skills">
          {Object.entries(skillsByCategory).map(([cat, list]) =>
            list.length > 0 ? (
              <p key={cat} style={{ margin: '0 0 2px' }}>
                <strong style={{ color: '#475569' }}>{cat}:</strong>{' '}
                <span style={{ color: '#475569' }}>{list.map((s) => s.name).join(', ')}</span>
              </p>
            ) : null
          )}
        </ElSection>
      )}
    </div>
  )
}

function ElSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <p
        style={{
          fontWeight: 700,
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: '#0f172a',
          borderBottom: '0.5px solid #94a3b8',
          paddingBottom: '2px',
          marginBottom: '4px',
        }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}
// ---END FILE---
