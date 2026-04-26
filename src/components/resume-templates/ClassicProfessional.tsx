import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function ClassicProfessional({ data }: TemplateProps) {
  const accent = accentHex(data)
  const hFont  = headingFont(data)
  const { contact, work, education, skills, summary } = data

  return (
    <div style={{ width: '794px', minHeight: '1123px', padding: '56px 56px 48px', fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: '1.6', color: '#1e293b', background: '#fff' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${accent}`, paddingBottom: '20px', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: hFont, fontSize: '28px', fontWeight: 700, color: accent, margin: 0, letterSpacing: '-0.02em' }}>
          {contact.name || 'Your Name'}
        </h1>
        {contact.title && (
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{contact.title}</p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '10px', fontSize: '10px', color: '#64748b' }}>
          {contact.email    && <span>✉ {contact.email}</span>}
          {contact.phone    && <span>📞 {contact.phone}</span>}
          {contact.location && <span>📍 {contact.location}</span>}
          {contact.linkedin && <span>🔗 {contact.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <Section accent={accent} font={hFont} label="Professional Summary">
          <p style={{ color: '#475569', lineHeight: '1.7' }}>{summary}</p>
        </Section>
      )}

      {/* Experience */}
      {work.some((w) => w.company || w.role) && (
        <Section accent={accent} font={hFont} label="Professional Experience">
          {work.map((w) => (
            <div key={w.id} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontFamily: hFont, fontWeight: 700, fontSize: '13px' }}>{w.role || 'Role'}</p>
                <p style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {formatDateRange(w.startDate, w.endDate, w.current)}
                </p>
              </div>
              <p style={{ color: accent, fontWeight: 600, fontSize: '11px', marginBottom: '4px' }}>{w.company}</p>
              <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {w.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ color: '#475569', listStyleType: 'disc' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.some((e) => e.institution) && (
        <Section accent={accent} font={hFont} label="Education">
          {education.map((e) => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <p style={{ fontFamily: hFont, fontWeight: 700, fontSize: '12px' }}>{e.institution}</p>
                <p style={{ color: '#64748b', fontSize: '11px' }}>
                  {[e.degree, e.field].filter(Boolean).join(', ')}
                  {e.gpa ? ` — GPA ${e.gpa}` : ''}
                </p>
              </div>
              <p style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                {formatDateRange(e.startDate, e.endDate, false)}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section accent={accent} font={hFont} label="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skills.map((s) => (
              <span key={s.id} style={{ border: `1px solid ${accent}40`, borderRadius: '4px', padding: '2px 8px', fontSize: '10px', color: '#334155', fontWeight: 500 }}>
                {s.name}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({ accent, font, label, children }: { accent: string; font: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <p style={{ fontFamily: font, fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: accent, whiteSpace: 'nowrap' }}>
          {label}
        </p>
        <div style={{ flex: 1, height: '1px', background: `${accent}30` }} />
      </div>
      {children}
    </div>
  )
}
