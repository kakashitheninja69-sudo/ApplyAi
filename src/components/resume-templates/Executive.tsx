import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function Executive({ data }: TemplateProps) {
  const accent = accentHex(data)
  const hFont  = headingFont(data)
  const { contact, work, education, skills, summary } = data

  const technical = skills.filter((s) => s.category === 'technical' || s.category === 'tool')
  const soft      = skills.filter((s) => s.category === 'soft' || s.category === 'language')

  return (
    <div style={{ width: '794px', minHeight: '1123px', fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: '1.6', color: '#1e293b', background: '#fff' }}>
      {/* Accent top bar */}
      <div style={{ height: '6px', background: accent, width: '100%' }} />

      {/* Header */}
      <div style={{ padding: '36px 52px 28px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontFamily: hFont, fontSize: '30px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', margin: 0 }}>
              {contact.name || 'Your Name'}
            </h1>
            {contact.title && (
              <p style={{ fontSize: '14px', fontWeight: 600, color: accent, marginTop: '4px' }}>{contact.title}</p>
            )}
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {contact.email    && <span>✉ {contact.email}</span>}
            {contact.phone    && <span>📞 {contact.phone}</span>}
            {contact.location && <span>📍 {contact.location}</span>}
            {contact.linkedin && <span>🔗 {contact.linkedin}</span>}
          </div>
        </div>
      </div>

      {/* Body: 2 column */}
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Main col */}
        <div style={{ flex: '1 1 0', padding: '32px 36px 32px 52px' }}>
          {summary && (
            <>
              <SectionHead label="Executive Profile" accent={accent} font={hFont} />
              <p style={{ color: '#475569', lineHeight: '1.75', marginBottom: '24px' }}>{summary}</p>
            </>
          )}

          {work.some((w) => w.company || w.role) && (
            <>
              <SectionHead label="Career History" accent={accent} font={hFont} />
              {work.map((w) => (
                <div key={w.id} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderLeft: `3px solid ${accent}`, paddingLeft: '10px' }}>
                    <div>
                      <p style={{ fontFamily: hFont, fontWeight: 700, fontSize: '13px' }}>{w.role || 'Role'}</p>
                      <p style={{ color: '#64748b', fontWeight: 600 }}>{w.company}</p>
                    </div>
                    <p style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {formatDateRange(w.startDate, w.endDate, w.current)}
                    </p>
                  </div>
                  <ul style={{ marginTop: '6px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {w.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} style={{ color: '#475569', listStyleType: 'disc' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Side col */}
        <div style={{ width: '220px', padding: '32px 32px 32px 20px', borderLeft: '1px solid #f1f5f9', background: '#fafbff', flexShrink: 0 }}>
          {education.some((e) => e.institution) && (
            <>
              <SideHead label="Education" accent={accent} font={hFont} />
              {education.map((e) => (
                <div key={e.id} style={{ marginBottom: '14px' }}>
                  <p style={{ fontWeight: 700, fontSize: '11px', fontFamily: hFont }}>{e.institution}</p>
                  <p style={{ color: '#64748b', fontSize: '10px' }}>
                    {[e.degree, e.field].filter(Boolean).join(', ')}
                  </p>
                  {e.gpa && <p style={{ color: '#94a3b8', fontSize: '10px' }}>GPA {e.gpa}</p>}
                  <p style={{ color: '#94a3b8', fontSize: '10px' }}>
                    {formatDateRange(e.startDate, e.endDate, false)}
                  </p>
                </div>
              ))}
            </>
          )}

          {technical.length > 0 && (
            <>
              <SideHead label="Core Competencies" accent={accent} font={hFont} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
                {technical.map((s) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, display: 'inline-block', flexShrink: 0 }} />
                    {s.name}
                  </div>
                ))}
              </div>
            </>
          )}

          {soft.length > 0 && (
            <>
              <SideHead label="Leadership Skills" accent={accent} font={hFont} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {soft.map((s) => (
                  <span key={s.id} style={{ fontSize: '9px', fontWeight: 500, padding: '2px 6px', borderRadius: '3px', border: `1px solid ${accent}30`, color: '#475569' }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SectionHead({ label, accent, font }: { label: string; accent: string; font: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <p style={{ fontFamily: font, fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.07em', color: accent }}>
        {label}
      </p>
      <div style={{ height: '2px', background: `${accent}25`, width: '40px', marginTop: '4px' }} />
    </div>
  )
}

function SideHead({ label, accent, font }: { label: string; accent: string; font: string }) {
  return (
    <p style={{ fontFamily: font, fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: accent, marginBottom: '10px', marginTop: '20px' }}>
      {label}
    </p>
  )
}
