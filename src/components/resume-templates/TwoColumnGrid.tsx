// FILE: src/components/resume-templates/TwoColumnGrid.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function TwoColumnGrid({ data }: TemplateProps) {
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
      {/* Full-width header */}
      <div
        style={{
          padding: '36px 36px 20px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
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
      </div>

      {/* Two column body */}
      <div style={{ display: 'flex', minHeight: '1000px' }}>
        {/* Left column 38% */}
        <div style={{ width: '38%', padding: '24px 24px 24px 36px' }}>
          <ColSection accent={accent} label="Contact">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '10px', color: '#475569' }}>
              {contact.email && <p style={{ margin: 0 }}>✉ {contact.email}</p>}
              {contact.phone && <p style={{ margin: 0 }}>📞 {contact.phone}</p>}
              {contact.location && <p style={{ margin: 0 }}>📍 {contact.location}</p>}
              {contact.linkedin && <p style={{ margin: 0, wordBreak: 'break-all' }}>🔗 {contact.linkedin}</p>}
              {contact.website && <p style={{ margin: 0, wordBreak: 'break-all' }}>🌐 {contact.website}</p>}
            </div>
          </ColSection>

          {skills.length > 0 && (
            <ColSection accent={accent} label="Skills">
              {Object.entries(skillsByCategory).map(([cat, list]) =>
                list.length > 0 ? (
                  <div key={cat} style={{ marginBottom: '12px' }}>
                    <p
                      style={{
                        fontSize: '9px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#94a3b8',
                        fontWeight: 600,
                        marginBottom: '5px',
                      }}
                    >
                      {cat}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {list.map((s) => (
                        <span
                          key={s.id}
                          style={{
                            border: `1px solid ${accent}50`,
                            borderRadius: '3px',
                            padding: '2px 6px',
                            fontSize: '9px',
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
            </ColSection>
          )}

          {education.some((e) => e.institution) && (
            <ColSection accent={accent} label="Education">
              {education.map((e) => (
                <div key={e.id} style={{ marginBottom: '12px' }}>
                  <p style={{ fontWeight: 700, fontSize: '11px', fontFamily: hFont }}>{e.institution}</p>
                  <p style={{ color: '#64748b', fontSize: '10px' }}>
                    {[e.degree, e.field].filter(Boolean).join(', ')}
                    {e.gpa ? ` · GPA ${e.gpa}` : ''}
                  </p>
                  <p style={{ fontSize: '9px', color: '#94a3b8' }}>
                    {formatDateRange(e.startDate, e.endDate, false)}
                  </p>
                </div>
              ))}
            </ColSection>
          )}
        </div>

        {/* Right column 62% */}
        <div
          style={{
            width: '62%',
            padding: '24px 36px 24px 28px',
            borderLeft: '1px solid #e2e8f0',
          }}
        >
          {summary && (
            <ColSection accent={accent} label="Summary">
              <p style={{ color: '#475569', lineHeight: '1.7' }}>{summary}</p>
            </ColSection>
          )}

          {work.some((w) => w.company || w.role) && (
            <ColSection accent={accent} label="Experience">
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
            </ColSection>
          )}
        </div>
      </div>
    </div>
  )
}

function ColSection({ accent, label, children }: { accent: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <p
        style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: accent,
          fontWeight: 700,
          borderBottom: `1px solid ${accent}40`,
          paddingBottom: '3px',
          marginBottom: '10px',
        }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}
// ---END FILE---
