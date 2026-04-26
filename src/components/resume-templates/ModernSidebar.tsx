import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function ModernSidebar({ data }: TemplateProps) {
  const accent  = accentHex(data)
  const hFont   = headingFont(data)
  const { contact, work, education, skills, summary } = data

  const skillsByCategory = {
    technical: skills.filter((s) => s.category === 'technical'),
    soft:      skills.filter((s) => s.category === 'soft'),
    language:  skills.filter((s) => s.category === 'language'),
    tool:      skills.filter((s) => s.category === 'tool'),
  }

  return (
    <div
      style={{
        width: '794px', minHeight: '1123px', display: 'flex',
        fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: '1.5',
        color: '#1e293b', background: '#fff',
      }}
    >
      {/* Sidebar */}
      <div style={{ width: '240px', background: accent, padding: '36px 24px', color: '#fff', flexShrink: 0 }}>
        {/* Avatar placeholder */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)', margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
        }}>
          {contact.name ? contact.name[0].toUpperCase() : '?'}
        </div>

        <h1 style={{ fontFamily: hFont, fontSize: '18px', fontWeight: 700, lineHeight: 1.2, marginBottom: '6px', textAlign: 'center', color: '#fff' }}>
          {contact.name || 'Your Name'}
        </h1>
        <p style={{ fontSize: '11px', opacity: 0.85, textAlign: 'center', marginBottom: '28px', fontWeight: 500 }}>
          {contact.title || 'Professional Title'}
        </p>

        {/* Contact */}
        <Section accent="#fff" font={hFont} label="Contact" light />
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {contact.email    && <Info icon="✉" value={contact.email} />}
          {contact.phone    && <Info icon="📞" value={contact.phone} />}
          {contact.location && <Info icon="📍" value={contact.location} />}
          {contact.linkedin && <Info icon="🔗" value={contact.linkedin} />}
          {contact.website  && <Info icon="🌐" value={contact.website} />}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <>
            <Section accent="#fff" font={hFont} label="Skills" light />
            {Object.entries(skillsByCategory).map(([cat, list]) =>
              list.length > 0 ? (
                <div key={cat} style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7, marginBottom: '6px', fontWeight: 600 }}>
                    {cat}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {list.map((s) => (
                      <span
                        key={s.id}
                        style={{
                          background: 'rgba(255,255,255,0.2)', borderRadius: '4px',
                          padding: '2px 7px', fontSize: '10px', fontWeight: 500,
                        }}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '40px 32px' }}>
        {summary && (
          <>
            <Section accent={accent} font={hFont} label="Professional Summary" />
            <p style={{ marginBottom: '24px', color: '#475569', lineHeight: '1.7' }}>{summary}</p>
          </>
        )}

        {work.some((w) => w.company || w.role) && (
          <>
            <Section accent={accent} font={hFont} label="Experience" />
            {work.map((w) => (
              <div key={w.id} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '13px', fontFamily: hFont }}>{w.role || 'Role'}</p>
                    <p style={{ color: accent, fontWeight: 600, fontSize: '11px' }}>{w.company}</p>
                  </div>
                  <p style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {formatDateRange(w.startDate, w.endDate, w.current)}
                  </p>
                </div>
                <ul style={{ marginTop: '6px', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {w.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ color: '#475569', listStyleType: 'disc' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}

        {education.some((e) => e.institution) && (
          <>
            <Section accent={accent} font={hFont} label="Education" />
            {education.map((e) => (
              <div key={e.id} style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '13px', fontFamily: hFont }}>{e.institution}</p>
                  <p style={{ color: '#64748b', fontSize: '11px' }}>
                    {[e.degree, e.field].filter(Boolean).join(' · ')}
                    {e.gpa ? ` · GPA ${e.gpa}` : ''}
                  </p>
                </div>
                <p style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {formatDateRange(e.startDate, e.endDate, false)}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function Section({ accent, font, label, light = false }: { accent: string; font: string; label: string; light?: boolean }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <p style={{ fontFamily: font, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: light ? 'rgba(255,255,255,0.7)' : accent, marginBottom: '6px' }}>
        {label}
      </p>
      <div style={{ height: '1.5px', background: light ? 'rgba(255,255,255,0.25)' : `${accent}33`, marginBottom: '12px' }} />
    </div>
  )
}

function Info({ icon, value }: { icon: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '10px', opacity: 0.9 }}>
      <span style={{ opacity: 0.8 }}>{icon}</span>
      <span style={{ wordBreak: 'break-all' }}>{value}</span>
    </div>
  )
}
