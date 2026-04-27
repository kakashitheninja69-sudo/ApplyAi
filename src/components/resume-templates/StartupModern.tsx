import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function StartupModern({ data }: TemplateProps) {
  const accent = accentHex(data)
  const hFont  = headingFont(data)
  const { contact, work, education, skills, summary } = data

  const contactParts = [contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean)

  return (
    <div style={{ width: '794px', minHeight: '1123px', padding: '60px 64px', fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: '1.6', color: '#1e293b', background: '#fff' }}>
      {/* Name */}
      <h1 style={{ fontFamily: hFont, fontSize: '30px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.03em' }}>
        {contact.name || 'Your Name'}
      </h1>
      {contact.title && (
        <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, margin: '0 0 10px' }}>{contact.title}</p>
      )}
      {/* Accent underline */}
      <div style={{ width: '48px', height: '3px', background: accent, borderRadius: '2px', marginBottom: '16px' }} />
      {/* Contact */}
      {contactParts.length > 0 && (
        <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '48px', letterSpacing: '0.01em' }}>
          {contactParts.join('  ·  ')}
        </p>
      )}

      {summary && (
        <Sec label="About" accent={accent} hFont={hFont}>
          <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '11.5px' }}>{summary}</p>
        </Sec>
      )}

      {work.some(w => w.company || w.role) && (
        <Sec label="Experience" accent={accent} hFont={hFont}>
          {work.map(w => (
            <div key={w.id} style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 700, fontSize: '13px', fontFamily: hFont, color: '#0f172a' }}>{w.role || 'Role'}</p>
                <p style={{ fontSize: '10px', color: '#94a3b8' }}>{formatDateRange(w.startDate, w.endDate, w.current)}</p>
              </div>
              <p style={{ color: accent, fontSize: '11px', fontWeight: 600, marginBottom: '8px' }}>{w.company}</p>
              <ul style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {w.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ paddingLeft: '14px', position: 'relative', color: '#475569' }}>
                    <span style={{ position: 'absolute', left: 0, color: accent }}>▪</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Sec>
      )}

      {education.some(e => e.institution) && (
        <Sec label="Education" accent={accent} hFont={hFont}>
          {education.map(e => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <p style={{ fontWeight: 700, color: '#0f172a' }}>{e.institution}</p>
                <p style={{ color: '#64748b' }}>{[e.degree, e.field].filter(Boolean).join(', ')}{e.gpa ? ` · GPA ${e.gpa}` : ''}</p>
              </div>
              <p style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatDateRange(e.startDate, e.endDate, false)}</p>
            </div>
          ))}
        </Sec>
      )}

      {skills.length > 0 && (
        <Sec label="Skills" accent={accent} hFont={hFont}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skills.map(s => (
              <span key={s.id} style={{ background: '#f1f5f9', borderRadius: '6px', padding: '3px 10px', fontSize: '10px', color: '#334155', fontWeight: 500 }}>
                {s.name}
              </span>
            ))}
          </div>
        </Sec>
      )}
    </div>
  )
}

function Sec({ label, accent, hFont, children }: { label: string; accent: string; hFont: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      <p style={{ fontFamily: hFont, fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '16px' }}>
        {label}
      </p>
      {children}
    </div>
  )
}
