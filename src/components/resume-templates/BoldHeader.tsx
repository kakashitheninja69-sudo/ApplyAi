// FILE: src/components/resume-templates/BoldHeader.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function BoldHeader({ data }: TemplateProps) {
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
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#1e293b',
        background: '#fff',
      }}
    >
      {/* Bold accent header band */}
      <div
        style={{
          width: '100%',
          height: '80px',
          background: accent,
          display: 'flex',
          alignItems: 'center',
          padding: '0 48px',
          gap: '20px',
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: hFont,
              fontSize: '22px',
              fontWeight: 700,
              color: '#fff',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {contact.name || 'Your Name'}
          </h1>
          {contact.title && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', margin: '2px 0 0' }}>
              {contact.title}
            </p>
          )}
        </div>
        {contactParts.length > 0 && (
          <p
            style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'right',
              lineHeight: '1.7',
              margin: 0,
              flexShrink: 0,
            }}
          >
            {contactParts.join('  ·  ')}
          </p>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '36px 48px' }}>
        {summary && (
          <BHSection accent={accent} hFont={hFont} label="Summary">
            <p style={{ color: '#475569', lineHeight: '1.7' }}>{summary}</p>
          </BHSection>
        )}

        {work.some((w) => w.company || w.role) && (
          <BHSection accent={accent} hFont={hFont} label="Experience">
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
                <p style={{ color: accent, fontWeight: 600, fontSize: '11px', marginBottom: '5px' }}>
                  {w.company}
                </p>
                <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {w.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ listStyleType: 'disc', color: '#475569' }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </BHSection>
        )}

        {education.some((e) => e.institution) && (
          <BHSection accent={accent} hFont={hFont} label="Education">
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
          </BHSection>
        )}

        {skills.length > 0 && (
          <BHSection accent={accent} hFont={hFont} label="Skills">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.map((s) => (
                <span
                  key={s.id}
                  style={{
                    background: `${accent}15`,
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '10px',
                    color: '#334155',
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </BHSection>
        )}
      </div>
    </div>
  )
}

function BHSection({
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
          color: accent,
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
