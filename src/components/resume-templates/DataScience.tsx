import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function DataScience({ data }: TemplateProps) {
  const accent = accentHex(data)
  const hFont  = headingFont(data)
  const { contact, work, education, skills, summary } = data

  const technical = skills.filter(s => s.category === 'technical')
  const tools     = skills.filter(s => s.category === 'tool')
  const soft      = skills.filter(s => s.category === 'soft')
  const language  = skills.filter(s => s.category === 'language')

  const contactParts = [contact.email, contact.phone, contact.location, contact.linkedin].filter(Boolean)

  return (
    <div style={{ width: '794px', minHeight: '1123px', fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: '1.5', color: '#1e293b', background: '#fff' }}>
      {/* Header */}
      <div style={{ background: '#0f172a', padding: '32px 48px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: hFont, fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
              {contact.name || 'Your Name'}
            </h1>
            {contact.title && (
              <p style={{ fontSize: '12px', color: accent, fontWeight: 600 }}>{contact.title}</p>
            )}
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {contact.email    && <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>✉ {contact.email}</p>}
            {contact.phone    && <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>☎ {contact.phone}</p>}
            {contact.location && <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>⊙ {contact.location}</p>}
            {contact.linkedin && <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>in {contact.linkedin}</p>}
            {contact.website  && <p style={{ fontSize: '10px', color: accent,    margin: 0 }}>↗ {contact.website}</p>}
          </div>
        </div>
      </div>

      {/* Tech stack grid */}
      {(technical.length > 0 || tools.length > 0) && (
        <div style={{ background: '#f8fafc', padding: '16px 48px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            {technical.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 1 }}>
                <p style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, width: '100%', marginBottom: '4px' }}>▮▮▮ Technical</p>
                {technical.map(s => (
                  <span key={s.id} style={{ background: accent + '18', color: accent, border: `1px solid ${accent}30`, borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 500 }}>{s.name}</span>
                ))}
              </div>
            )}
            {tools.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 1 }}>
                <p style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, width: '100%', marginBottom: '4px' }}>▮▮▮ Tools</p>
                {tools.map(s => (
                  <span key={s.id} style={{ background: '#e2e8f0', color: '#475569', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 500 }}>{s.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: '28px 48px' }}>
        {summary && (
          <DSec label="Profile" accent={accent} hFont={hFont}>
            <p style={{ color: '#475569', lineHeight: '1.7' }}>{summary}</p>
          </DSec>
        )}

        {work.some(w => w.company || w.role) && (
          <DSec label="Industry Experience" accent={accent} hFont={hFont}>
            {work.map(w => (
              <div key={w.id} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{w.role || 'Role'}</p>
                    <p style={{ color: accent, fontWeight: 600, fontSize: '11px' }}>{w.company}</p>
                  </div>
                  <p style={{ fontSize: '10px', color: '#94a3b8' }}>{formatDateRange(w.startDate, w.endDate, w.current)}</p>
                </div>
                <ul style={{ paddingLeft: '16px', marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {w.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ listStyleType: 'disc', color: '#475569' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </DSec>
        )}

        <div style={{ display: 'flex', gap: '32px' }}>
          {education.some(e => e.institution) && (
            <div style={{ flex: 1 }}>
              <DSec label="Education" accent={accent} hFont={hFont}>
                {education.map(e => (
                  <div key={e.id} style={{ marginBottom: '10px' }}>
                    <p style={{ fontWeight: 700 }}>{e.institution}</p>
                    <p style={{ color: '#64748b' }}>{[e.degree, e.field].filter(Boolean).join(', ')}</p>
                    {e.gpa && <p style={{ color: '#94a3b8', fontSize: '10px' }}>GPA {e.gpa}</p>}
                    <p style={{ color: '#94a3b8', fontSize: '10px' }}>{formatDateRange(e.startDate, e.endDate, false)}</p>
                  </div>
                ))}
              </DSec>
            </div>
          )}
          {(soft.length > 0 || language.length > 0) && (
            <div style={{ flex: 1 }}>
              {soft.length > 0 && (
                <DSec label="Soft Skills" accent={accent} hFont={hFont}>
                  <p style={{ color: '#475569' }}>{soft.map(s => s.name).join(', ')}</p>
                </DSec>
              )}
              {language.length > 0 && (
                <DSec label="Languages" accent={accent} hFont={hFont}>
                  <p style={{ color: '#475569' }}>{language.map(s => s.name).join(', ')}</p>
                </DSec>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DSec({ label, accent, hFont, children }: { label: string; accent: string; hFont: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <p style={{ fontFamily: hFont, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, margin: 0 }}>{label}</p>
        <div style={{ flex: 1, height: '1px', background: `${accent}25`, marginLeft: '10px' }} />
      </div>
      {children}
    </div>
  )
}
