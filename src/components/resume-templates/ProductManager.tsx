import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

function hasMetric(text: string) {
  return /\d|%/.test(text)
}

export default function ProductManager({ data }: TemplateProps) {
  const accent = accentHex(data)
  const hFont  = headingFont(data)
  const { contact, work, education, skills, summary } = data

  const technical = skills.filter(s => s.category === 'technical')
  const soft      = skills.filter(s => s.category === 'soft' || s.category === 'tool')

  const contactParts = [contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean)

  return (
    <div style={{ width: '794px', minHeight: '1123px', fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: '1.5', color: '#1e293b', background: '#fff' }}>
      {/* Header strip */}
      <div style={{ background: '#eff6ff', padding: '28px 48px 24px', borderBottom: `3px solid ${accent}` }}>
        <h1 style={{ fontFamily: hFont, fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 3px' }}>
          {contact.name || 'Your Name'}
        </h1>
        {contact.title && (
          <p style={{ fontSize: '13px', color: accent, fontWeight: 700, margin: '0 0 10px' }}>{contact.title}</p>
        )}
        <p style={{ fontSize: '10px', color: '#64748b' }}>{contactParts.join('  ·  ')}</p>
      </div>

      <div style={{ padding: '28px 48px' }}>
        {summary && (
          <PMSec label="Executive Summary" accent={accent} hFont={hFont}>
            <p style={{ color: '#475569', lineHeight: '1.75' }}>{summary}</p>
          </PMSec>
        )}

        {work.some(w => w.company || w.role) && (
          <PMSec label="Product Experience" accent={accent} hFont={hFont}>
            {work.map(w => (
              <div key={w.id} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '13px', fontFamily: hFont, color: '#0f172a' }}>{w.role || 'Role'}</p>
                    <p style={{ color: accent, fontWeight: 600 }}>{w.company}</p>
                  </div>
                  <p style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatDateRange(w.startDate, w.endDate, w.current)}</p>
                </div>
                {/* Metric callout chips for bullets with numbers */}
                {w.bullets.filter(b => b && hasMetric(b)).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: '6px 0' }}>
                    {w.bullets.filter(b => b && hasMetric(b)).slice(0, 3).map((b, i) => (
                      <span key={i} style={{ background: accent + '15', color: accent, border: `1px solid ${accent}30`, borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 600 }}>
                        {b.length > 50 ? b.slice(0, 47) + '…' : b}
                      </span>
                    ))}
                  </div>
                )}
                <ul style={{ paddingLeft: '16px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {w.bullets.filter(b => b && !hasMetric(b)).map((b, i) => (
                    <li key={i} style={{ listStyleType: 'disc', color: '#475569' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </PMSec>
        )}

        <div style={{ display: 'flex', gap: '32px' }}>
          {education.some(e => e.institution) && (
            <div style={{ flex: 1 }}>
              <PMSec label="Education" accent={accent} hFont={hFont}>
                {education.map(e => (
                  <div key={e.id} style={{ marginBottom: '8px' }}>
                    <p style={{ fontWeight: 700 }}>{e.institution}</p>
                    <p style={{ color: '#64748b' }}>{[e.degree, e.field].filter(Boolean).join(', ')}{e.gpa ? ` · GPA ${e.gpa}` : ''}</p>
                    <p style={{ color: '#94a3b8', fontSize: '10px' }}>{formatDateRange(e.startDate, e.endDate, false)}</p>
                  </div>
                ))}
              </PMSec>
            </div>
          )}
          <div style={{ flex: 1 }}>
            {technical.length > 0 && (
              <PMSec label="Product & Tech Skills" accent={accent} hFont={hFont}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {technical.map(s => (
                    <span key={s.id} style={{ background: '#f1f5f9', borderRadius: '5px', padding: '2px 8px', fontSize: '10px', color: '#334155', fontWeight: 500 }}>{s.name}</span>
                  ))}
                </div>
              </PMSec>
            )}
            {soft.length > 0 && (
              <PMSec label="Leadership & Tools" accent={accent} hFont={hFont}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {soft.map(s => (
                    <span key={s.id} style={{ background: '#f1f5f9', borderRadius: '5px', padding: '2px 8px', fontSize: '10px', color: '#334155', fontWeight: 500 }}>{s.name}</span>
                  ))}
                </div>
              </PMSec>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PMSec({ label, accent, hFont, children }: { label: string; accent: string; hFont: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ width: '3px', height: '14px', background: accent, marginRight: '8px', borderRadius: '2px', flexShrink: 0 }} />
        <p style={{ fontFamily: hFont, fontWeight: 700, fontSize: '12px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{label}</p>
        <div style={{ flex: 1, height: '1px', background: '#e2e8f0', marginLeft: '10px' }} />
      </div>
      {children}
    </div>
  )
}
