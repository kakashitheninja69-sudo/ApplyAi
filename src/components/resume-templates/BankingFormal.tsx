// FILE: src/components/resume-templates/BankingFormal.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function BankingFormal({ data }: TemplateProps) {
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
        padding: '56px 48px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        lineHeight: '1.6',
        color: '#1e293b',
        background: '#fff',
      }}
    >
      {/* Centered Name */}
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <h1
          style={{
            fontFamily: hFont,
            fontSize: '20px',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          {contact.name || 'Your Name'}
        </h1>
        {contact.title && (
          <p
            style={{
              fontSize: '12px',
              color: '#334155',
              marginTop: '4px',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            {contact.title}
          </p>
        )}
      </div>

      {/* Triple divider */}
      <div style={{ marginTop: '10px', marginBottom: '6px' }}>
        <div style={{ height: '2px', background: '#0f172a' }} />
        <div style={{ height: '3px' }} />
        <div style={{ height: '1px', background: accent }} />
        <div style={{ height: '3px' }} />
        <div style={{ height: '2px', background: '#0f172a' }} />
      </div>

      {/* Contact centered */}
      {contactParts.length > 0 && (
        <p style={{ textAlign: 'center', fontSize: '10px', color: '#475569', marginBottom: '20px', marginTop: '8px' }}>
          {contactParts.join('  ·  ')}
        </p>
      )}

      {summary && (
        <BSection accent={accent} hFont={hFont} label="Professional Summary">
          <p style={{ color: '#475569', lineHeight: '1.7', textAlign: 'justify' }}>{summary}</p>
        </BSection>
      )}

      {work.some((w) => w.company || w.role) && (
        <BSection accent={accent} hFont={hFont} label="Professional Experience">
          {work.map((w) => (
            <div key={w.id} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{w.role || 'Role'}</p>
                <p style={{ fontSize: '10px', color: '#64748b' }}>
                  {formatDateRange(w.startDate, w.endDate, w.current)}
                </p>
              </div>
              <p style={{ color: '#334155', fontStyle: 'italic', fontSize: '11px', marginBottom: '6px' }}>
                {w.company}
              </p>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {w.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ listStyleType: 'disc', color: '#475569' }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </BSection>
      )}

      {education.some((e) => e.institution) && (
        <BSection accent={accent} hFont={hFont} label="Education">
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
              <p style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap' }}>
                {formatDateRange(e.startDate, e.endDate, false)}
              </p>
            </div>
          ))}
        </BSection>
      )}

      {skills.length > 0 && (
        <BSection accent={accent} hFont={hFont} label="Skills & Competencies">
          <p style={{ color: '#475569' }}>{skills.map((s) => s.name).join(', ')}</p>
        </BSection>
      )}
    </div>
  )
}

function BSection({
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
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <p
          style={{
            fontFamily: hFont,
            fontWeight: 700,
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#0f172a',
            margin: '0 0 4px 0',
          }}
        >
          {label}
        </p>
        <div style={{ height: '1px', background: '#cbd5e1' }} />
      </div>
      {children}
    </div>
  )
}
// ---END FILE---
