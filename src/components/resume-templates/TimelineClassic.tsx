// FILE: src/components/resume-templates/TimelineClassic.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function TimelineClassic({ data }: TemplateProps) {
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
        padding: '48px 48px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#1e293b',
        background: '#fff',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
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
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
            {contact.title}
          </p>
        )}
        {contactParts.length > 0 && (
          <p style={{ fontSize: '10px', color: '#64748b', marginTop: '5px' }}>
            {contactParts.join(' · ')}
          </p>
        )}
        <div style={{ height: '2px', background: accent, marginTop: '14px' }} />
      </div>

      {summary && (
        <div style={{ marginBottom: '24px' }}>
          <p
            style={{
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accent,
              marginBottom: '8px',
            }}
          >
            Summary
          </p>
          <p style={{ color: '#475569', lineHeight: '1.7' }}>{summary}</p>
        </div>
      )}

      {work.some((w) => w.company || w.role) && (
        <div style={{ marginBottom: '24px' }}>
          <p
            style={{
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accent,
              marginBottom: '16px',
            }}
          >
            Experience
          </p>

          {work.map((w, idx) => (
            <div key={w.id} style={{ display: 'flex', gap: '0', marginBottom: '20px' }}>
              {/* Date column */}
              <div
                style={{
                  width: '110px',
                  flexShrink: 0,
                  textAlign: 'right',
                  paddingRight: '16px',
                  paddingTop: '2px',
                  fontSize: '10px',
                  color: '#94a3b8',
                  lineHeight: '1.4',
                }}
              >
                {formatDateRange(w.startDate, w.endDate, w.current)}
              </div>

              {/* Timeline line + dot */}
              <div style={{ width: '24px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: accent,
                    flexShrink: 0,
                    marginTop: '2px',
                    zIndex: 1,
                  }}
                />
                {idx < work.length - 1 && (
                  <div
                    style={{
                      width: '2px',
                      flex: 1,
                      background: `${accent}30`,
                      marginTop: '4px',
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingLeft: '12px' }}>
                <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont, margin: 0 }}>
                  {w.role || 'Role'}
                </p>
                <p style={{ color: accent, fontWeight: 600, fontSize: '11px', margin: '2px 0 6px' }}>
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
            </div>
          ))}
        </div>
      )}

      {education.some((e) => e.institution) && (
        <div style={{ marginBottom: '22px' }}>
          <p
            style={{
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accent,
              marginBottom: '10px',
            }}
          >
            Education
          </p>
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
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <p
            style={{
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accent,
              marginBottom: '10px',
            }}
          >
            Skills
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {skills.map((s) => (
              <span
                key={s.id}
                style={{
                  border: `1px solid ${accent}50`,
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
        </div>
      )}
    </div>
  )
}
// ---END FILE---
