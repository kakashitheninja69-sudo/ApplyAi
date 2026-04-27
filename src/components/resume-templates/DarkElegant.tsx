import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function DarkElegant({ data }: TemplateProps) {
  const accent = accentHex(data)
  const hFont  = headingFont(data)
  const { contact, work, education, skills, summary } = data

  return (
    <div style={{ width: '794px', minHeight: '1123px', display: 'flex', fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: '1.5', background: '#0f172a', color: '#e2e8f0' }}>
      {/* Dark sidebar */}
      <div style={{ width: '220px', background: '#1e293b', padding: '40px 22px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Avatar */}
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: accent + '30', border: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: accent, marginBottom: '16px' }}>
          {contact.name ? contact.name[0].toUpperCase() : '?'}
        </div>

        <h1 style={{ fontFamily: hFont, fontSize: '17px', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px', lineHeight: 1.2 }}>
          {contact.name || 'Your Name'}
        </h1>
        {contact.title && (
          <p style={{ fontSize: '10px', color: accent, fontWeight: 600, marginBottom: '24px' }}>{contact.title}</p>
        )}

        <DarkSec label="Contact" accent={accent}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
            {contact.email    && <DarkInfo label="Email" value={contact.email} />}
            {contact.phone    && <DarkInfo label="Phone" value={contact.phone} />}
            {contact.location && <DarkInfo label="Location" value={contact.location} />}
            {contact.linkedin && <DarkInfo label="LinkedIn" value={contact.linkedin} />}
            {contact.website  && <DarkInfo label="Web" value={contact.website} />}
          </div>
        </DarkSec>

        {skills.length > 0 && (
          <DarkSec label="Skills" accent={accent}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '20px' }}>
              {skills.map(s => (
                <span key={s.id} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '2px 7px', fontSize: '9px', color: '#cbd5e1', fontWeight: 500 }}>
                  {s.name}
                </span>
              ))}
            </div>
          </DarkSec>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '40px 36px' }}>
        {summary && (
          <DarkMainSec label="Summary" accent={accent} hFont={hFont}>
            <p style={{ color: '#94a3b8', lineHeight: '1.7' }}>{summary}</p>
          </DarkMainSec>
        )}

        {work.some(w => w.company || w.role) && (
          <DarkMainSec label="Experience" accent={accent} hFont={hFont}>
            {work.map(w => (
              <div key={w.id} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '13px', fontFamily: hFont, color: '#f1f5f9' }}>{w.role || 'Role'}</p>
                    <p style={{ color: accent, fontWeight: 600, fontSize: '11px' }}>{w.company}</p>
                  </div>
                  <p style={{ fontSize: '10px', color: '#475569', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {formatDateRange(w.startDate, w.endDate, w.current)}
                  </p>
                </div>
                <ul style={{ paddingLeft: '16px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {w.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ listStyleType: 'disc', color: '#94a3b8' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </DarkMainSec>
        )}

        {education.some(e => e.institution) && (
          <DarkMainSec label="Education" accent={accent} hFont={hFont}>
            {education.map(e => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#f1f5f9' }}>{e.institution}</p>
                  <p style={{ color: '#64748b' }}>{[e.degree, e.field].filter(Boolean).join(', ')}{e.gpa ? ` · GPA ${e.gpa}` : ''}</p>
                </div>
                <p style={{ fontSize: '10px', color: '#475569', whiteSpace: 'nowrap' }}>{formatDateRange(e.startDate, e.endDate, false)}</p>
              </div>
            ))}
          </DarkMainSec>
        )}
      </div>
    </div>
  )
}

function DarkSec({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, fontWeight: 700, marginBottom: '6px' }}>{label}</p>
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '10px' }} />
      {children}
    </div>
  )
}

function DarkMainSec({ label, accent, hFont, children }: { label: string; accent: string; hFont: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ fontFamily: hFont, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, fontWeight: 700, marginBottom: '4px' }}>{label}</p>
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '12px' }} />
      {children}
    </div>
  )
}

function DarkInfo({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ fontSize: '9px' }}>
      <span style={{ color: '#475569', fontWeight: 600 }}>{label}: </span>
      <span style={{ color: '#94a3b8', wordBreak: 'break-all' }}>{value}</span>
    </div>
  )
}
