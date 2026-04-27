// FILE: src/components/resume-templates/MetaImpact.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function MetaImpact({ data }: TemplateProps) {
  const accent = accentHex(data)
  const hFont = headingFont(data)
  const { contact, work, education, skills, summary } = data

  const skillsByCategory: Record<string, typeof skills> = {
    Technical: skills.filter((s) => s.category === 'technical'),
    Tools: skills.filter((s) => s.category === 'tool'),
    Soft: skills.filter((s) => s.category === 'soft'),
    Languages: skills.filter((s) => s.category === 'language'),
  }

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
      {/* Top accent bar */}
      <div
        style={{
          width: '100%',
          height: '48px',
          background: accent,
          display: 'flex',
          alignItems: 'center',
          padding: '0 40px',
          gap: '16px',
        }}
      >
        <h1
          style={{
            fontFamily: hFont,
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff',
            margin: 0,
          }}
        >
          {contact.name || 'Your Name'}
        </h1>
        {contact.title && (
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
            {contact.title}
          </p>
        )}
      </div>

      {/* Body: 60/40 split */}
      <div style={{ display: 'flex', minHeight: '1075px' }}>
        {/* Left: Experience + Summary (60%) */}
        <div style={{ width: '60%', padding: '32px 32px 32px 40px' }}>
          {summary && (
            <MSection accent={accent} label="Summary">
              <p style={{ color: '#475569', lineHeight: '1.7' }}>{summary}</p>
            </MSection>
          )}

          {work.some((w) => w.company || w.role) && (
            <MSection accent={accent} label="Experience">
              {work.map((w) => (
                <div key={w.id} style={{ marginBottom: '18px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>
                      {w.role || 'Role'}
                    </p>
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
            </MSection>
          )}

          {education.some((e) => e.institution) && (
            <MSection accent={accent} label="Education">
              {education.map((e) => (
                <div key={e.id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>
                      {e.institution}
                    </p>
                    <p style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {formatDateRange(e.startDate, e.endDate, false)}
                    </p>
                  </div>
                  <p style={{ color: '#64748b' }}>
                    {[e.degree, e.field].filter(Boolean).join(', ')}
                    {e.gpa ? ` — GPA ${e.gpa}` : ''}
                  </p>
                </div>
              ))}
            </MSection>
          )}
        </div>

        {/* Right: Contact + Skills (40%) */}
        <div
          style={{
            width: '40%',
            padding: '32px 36px 32px 28px',
            borderLeft: `1px solid #e2e8f0`,
          }}
        >
          <MSection accent={accent} label="Contact">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '10px', color: '#475569' }}>
              {contact.email && <p style={{ margin: 0 }}>{contact.email}</p>}
              {contact.phone && <p style={{ margin: 0 }}>{contact.phone}</p>}
              {contact.location && <p style={{ margin: 0 }}>{contact.location}</p>}
              {contact.linkedin && <p style={{ margin: 0 }}>{contact.linkedin}</p>}
              {contact.website && <p style={{ margin: 0 }}>{contact.website}</p>}
            </div>
          </MSection>

          {skills.length > 0 && (
            <MSection accent={accent} label="Skills">
              {Object.entries(skillsByCategory).map(([cat, list]) =>
                list.length > 0 ? (
                  <div key={cat} style={{ marginBottom: '12px' }}>
                    <p
                      style={{
                        fontSize: '9px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#94a3b8',
                        marginBottom: '5px',
                        fontWeight: 600,
                      }}
                    >
                      {cat}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {list.map((s) => (
                        <span
                          key={s.id}
                          style={{
                            background: `${accent}15`,
                            borderRadius: '3px',
                            padding: '2px 7px',
                            fontSize: '10px',
                            color: '#334155',
                          }}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </MSection>
          )}
        </div>
      </div>
    </div>
  )
}

function MSection({
  accent,
  label,
  children,
}: {
  accent: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <p
        style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: accent,
          fontWeight: 700,
          marginBottom: '8px',
        }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}
// ---END FILE---
