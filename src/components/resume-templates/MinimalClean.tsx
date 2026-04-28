import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function MinimalClean({ data }: TemplateProps) {
  const accent = accentHex(data)
  const hFont  = headingFont(data)
  const { contact, work, education, skills, summary } = data

  return (
    <div style={{ width: '794px', minHeight: '1123px', padding: '52px 56px', fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: '1.6', color: '#1e293b', background: '#fff' }}>
      {/* Header — name left, contact right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '24px', borderBottom: `2px solid ${accent}` }}>
        <div>
          <h1 style={{ fontFamily: hFont, fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', margin: 0 }}>
            {contact.name || 'Your Name'}
          </h1>
          {contact.title && (
            <p style={{ fontSize: '14px', color: accent, fontWeight: 600, marginTop: '4px' }}>{contact.title}</p>
          )}
        </div>
        <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
          {contact.email    && <span>✉ {contact.email}</span>}
          {contact.phone    && <span>☎ {contact.phone}</span>}
          {contact.location && <span>⊙ {contact.location}</span>}
          {contact.linkedin && <span>in {contact.linkedin}</span>}
          {contact.website  && <span>↗ {contact.website}</span>}
        </div>
      </div>

      {/* Two-column body: narrow label | wide content */}
      {summary && (
        <TwoColRow label="Summary" accent={accent} font={hFont}>
          <p style={{ color: '#475569', lineHeight: '1.7' }}>{summary}</p>
        </TwoColRow>
      )}

      {work.some((w) => w.company || w.role) && (
        <TwoColRow label="Experience" accent={accent} font={hFont}>
          {work.map((w) => (
            <div key={w.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{w.role || 'Role'}</p>
                <p style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {formatDateRange(w.startDate, w.endDate, w.current)}
                </p>
              </div>
              <p style={{ color: accent, fontWeight: 600, marginBottom: '4px', fontSize: '11px' }}>{w.company}</p>
              <ul style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {w.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ color: '#475569', listStyleType: 'disc' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </TwoColRow>
      )}

      {education.some((e) => e.institution) && (
        <TwoColRow label="Education" accent={accent} font={hFont}>
          {education.map((e) => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{e.institution}</p>
                <p style={{ color: '#64748b', fontSize: '11px' }}>
                  {[e.degree, e.field].filter(Boolean).join(', ')}
                </p>
              </div>
              <p style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                {formatDateRange(e.startDate, e.endDate, false)}
              </p>
            </div>
          ))}
        </TwoColRow>
      )}

      {skills.length > 0 && (
        <TwoColRow label="Skills" accent={accent} font={hFont}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skills.map((s) => (
              <span key={s.id} style={{ fontSize: '10px', fontWeight: 500, color: '#334155', padding: '2px 8px', borderRadius: '3px', background: `${accent}12`, border: `1px solid ${accent}25` }}>
                {s.name}
              </span>
            ))}
          </div>
        </TwoColRow>
      )}
    </div>
  )
}

function TwoColRow({ label, accent, font, children }: { label: string; accent: string; font: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
      <div style={{ width: '110px', paddingTop: '2px', borderRight: `2px solid ${accent}30`, paddingRight: '16px', flexShrink: 0 }}>
        <p style={{ fontFamily: font, fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: accent }}>
          {label}
        </p>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}
