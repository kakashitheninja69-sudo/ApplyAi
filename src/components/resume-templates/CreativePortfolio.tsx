import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function CreativePortfolio({ data }: TemplateProps) {
  const accent = accentHex(data)
  const hFont  = headingFont(data)
  const { contact, work, education, skills, summary } = data

  const contactParts = [contact.email, contact.phone, contact.location].filter(Boolean)

  // Alternate opacities for chip variety
  const opacities = [1, 0.75, 0.55, 0.85, 0.65]

  return (
    <div style={{ width: '794px', minHeight: '1123px', fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: '1.5', color: '#1e293b', background: '#fff' }}>
      {/* Header block */}
      <div style={{ padding: '40px 48px 32px', borderBottom: `5px solid ${accent}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontFamily: hFont, fontSize: '26px', fontWeight: 800, color: accent, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              {contact.name || 'Your Name'}
            </h1>
            {contact.title && (
              <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', fontWeight: 500 }}>{contact.title}</p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            {contact.email    && <p style={{ fontSize: '10px', color: '#64748b', margin: '1px 0' }}>✉ {contact.email}</p>}
            {contact.phone    && <p style={{ fontSize: '10px', color: '#64748b', margin: '1px 0' }}>☎ {contact.phone}</p>}
            {contact.location && <p style={{ fontSize: '10px', color: '#64748b', margin: '1px 0' }}>⊙ {contact.location}</p>}
            {contact.linkedin && <p style={{ fontSize: '10px', color: accent,    margin: '1px 0' }}>in {contact.linkedin}</p>}
            {contact.website  && <p style={{ fontSize: '10px', color: accent,    margin: '1px 0' }}>↗ {contact.website}</p>}
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 48px' }}>
        {summary && (
          <CSec label="Profile" accent={accent} hFont={hFont}>
            <p style={{ color: '#475569', lineHeight: '1.75', fontSize: '11.5px' }}>{summary}</p>
          </CSec>
        )}

        {/* Skills — colourful chips */}
        {skills.length > 0 && (
          <CSec label="Expertise" accent={accent} hFont={hFont}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.map((s, i) => (
                <span key={s.id} style={{
                  background: accent + Math.round(opacities[i % opacities.length] * 25).toString(16).padStart(2, '0'),
                  color: accent,
                  border: `1px solid ${accent}40`,
                  borderRadius: '20px',
                  padding: '3px 11px',
                  fontSize: '10px',
                  fontWeight: 600,
                }}>
                  {s.name}
                </span>
              ))}
            </div>
          </CSec>
        )}

        {work.some(w => w.company || w.role) && (
          <CSec label="Experience" accent={accent} hFont={hFont}>
            {work.map(w => (
              <div key={w.id} style={{ marginBottom: '20px', paddingLeft: '14px', borderLeft: `3px solid ${accent}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{w.role || 'Role'}</p>
                  <p style={{ fontSize: '10px', color: '#94a3b8' }}>{formatDateRange(w.startDate, w.endDate, w.current)}</p>
                </div>
                <p style={{ color: accent, fontWeight: 600, fontSize: '11px', marginBottom: '5px' }}>{w.company}</p>
                <ul style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {w.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ listStyleType: 'disc', color: '#475569' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CSec>
        )}

        {education.some(e => e.institution) && (
          <CSec label="Education" accent={accent} hFont={hFont}>
            {education.map(e => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <p style={{ fontWeight: 700 }}>{e.institution}</p>
                  <p style={{ color: '#64748b' }}>{[e.degree, e.field].filter(Boolean).join(', ')}{e.gpa ? ` · GPA ${e.gpa}` : ''}</p>
                </div>
                <p style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatDateRange(e.startDate, e.endDate, false)}</p>
              </div>
            ))}
          </CSec>
        )}
      </div>
    </div>
  )
}

function CSec({ label, accent, hFont, children }: { label: string; accent: string; hFont: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{ width: '18px', height: '3px', background: accent, borderRadius: '2px', flexShrink: 0 }} />
        <p style={{ fontFamily: hFont, fontWeight: 700, fontSize: '12px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{label}</p>
        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
      </div>
      {children}
    </div>
  )
}
