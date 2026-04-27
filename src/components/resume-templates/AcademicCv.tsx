// FILE: src/components/resume-templates/AcademicCv.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function AcademicCv({ data }: TemplateProps) {
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
        padding: '52px 56px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        lineHeight: '1.7',
        color: '#1e293b',
        background: '#fff',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '8px' }}>
        <h1
          style={{
            fontFamily: hFont,
            fontSize: '22px',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
          }}
        >
          {contact.name || 'Your Name'}
        </h1>
        {contact.title && (
          <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px', fontWeight: 500 }}>
            {contact.title}
          </p>
        )}
        {contactParts.length > 0 && (
          <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
            {contactParts.join(' · ')}
          </p>
        )}
      </div>

      <div style={{ height: '2px', background: '#cbd5e1', marginBottom: '28px', marginTop: '12px' }} />

      {/* Education first */}
      {education.some((e) => e.institution) && (
        <AcSection accent={accent} hFont={hFont} label="Education">
          {education.map((e) => (
            <div key={e.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{e.institution}</p>
                  <p style={{ color: '#334155', fontSize: '11px' }}>
                    {[e.degree, e.field].filter(Boolean).join(', ')}
                  </p>
                  {e.gpa && (
                    <p style={{ color: '#64748b', fontSize: '10px' }}>GPA: {e.gpa}</p>
                  )}
                </div>
                <p style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {formatDateRange(e.startDate, e.endDate, false)}
                </p>
              </div>
            </div>
          ))}
        </AcSection>
      )}

      {summary && (
        <AcSection accent={accent} hFont={hFont} label="Research Interests & Summary">
          <p style={{ color: '#475569', lineHeight: '1.8', textAlign: 'justify' }}>{summary}</p>
        </AcSection>
      )}

      {work.some((w) => w.company || w.role) && (
        <AcSection accent={accent} hFont={hFont} label="Academic & Professional Experience">
          {work.map((w) => (
            <div key={w.id} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{w.role || 'Role'}</p>
                <p style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {formatDateRange(w.startDate, w.endDate, w.current)}
                </p>
              </div>
              <p style={{ color: accent, fontWeight: 600, fontSize: '11px', marginBottom: '6px' }}>
                {w.company}
              </p>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {w.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ listStyleType: 'disc', color: '#475569' }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </AcSection>
      )}

      {skills.length > 0 && (
        <AcSection accent={accent} hFont={hFont} label="Skills & Methods">
          <p style={{ color: '#475569' }}>{skills.map((s) => s.name).join(', ')}</p>
        </AcSection>
      )}
    </div>
  )
}

function AcSection({
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
    <div style={{ marginBottom: '24px' }}>
      <p
        style={{
          fontFamily: hFont,
          fontWeight: 700,
          fontSize: '12px',
          fontStyle: 'italic',
          color: accent,
          marginBottom: '10px',
          borderBottom: `1px solid ${accent}40`,
          paddingBottom: '4px',
        }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}
// ---END FILE---
