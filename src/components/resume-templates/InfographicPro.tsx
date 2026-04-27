// FILE: src/components/resume-templates/InfographicPro.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

const PROFICIENCY = [90, 85, 80, 75, 70]

export default function InfographicPro({ data }: TemplateProps) {
  const accent = accentHex(data)
  const hFont = headingFont(data)
  const { contact, work, education, skills, summary } = data

  const displayedSkills = skills.slice(0, 5)

  return (
    <div
      style={{
        width: '794px',
        minHeight: '1123px',
        display: 'flex',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#1e293b',
        background: '#fff',
      }}
    >
      {/* Sidebar 220px */}
      <div
        style={{
          width: '220px',
          background: '#f8fafc',
          padding: '40px 20px',
          flexShrink: 0,
          borderRight: '1px solid #e2e8f0',
        }}
      >
        <h1
          style={{
            fontFamily: hFont,
            fontSize: '17px',
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 4px',
            lineHeight: 1.2,
          }}
        >
          {contact.name || 'Your Name'}
        </h1>
        {contact.title && (
          <p style={{ fontSize: '10px', color: accent, fontWeight: 600, marginBottom: '20px' }}>
            {contact.title}
          </p>
        )}

        {/* Contact */}
        <ISideSection accent={accent} label="Contact" />
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {contact.email && (
            <div style={{ fontSize: '9px', color: '#475569' }}>
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>Email: </span>
              <span style={{ wordBreak: 'break-all' }}>{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div style={{ fontSize: '9px', color: '#475569' }}>
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>Phone: </span>
              {contact.phone}
            </div>
          )}
          {contact.location && (
            <div style={{ fontSize: '9px', color: '#475569' }}>
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>Location: </span>
              {contact.location}
            </div>
          )}
          {contact.linkedin && (
            <div style={{ fontSize: '9px', color: '#475569' }}>
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>LinkedIn: </span>
              <span style={{ wordBreak: 'break-all' }}>{contact.linkedin}</span>
            </div>
          )}
          {contact.website && (
            <div style={{ fontSize: '9px', color: '#475569' }}>
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>Web: </span>
              <span style={{ wordBreak: 'break-all' }}>{contact.website}</span>
            </div>
          )}
        </div>

        {/* Skill bars */}
        {displayedSkills.length > 0 && (
          <>
            <ISideSection accent={accent} label="Skills" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {displayedSkills.map((s, i) => (
                <div key={s.id}>
                  <p style={{ fontSize: '9px', color: '#334155', fontWeight: 500, marginBottom: '3px' }}>
                    {s.name}
                  </p>
                  <div
                    style={{
                      height: '6px',
                      background: '#e2e8f0',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${PROFICIENCY[i] ?? 70}%`,
                        background: accent,
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Remaining skills as text */}
        {skills.length > 5 && (
          <>
            <ISideSection accent={accent} label="Other Skills" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
              {skills.slice(5).map((s) => (
                <span
                  key={s.id}
                  style={{
                    background: '#e2e8f0',
                    borderRadius: '3px',
                    padding: '2px 6px',
                    fontSize: '9px',
                    color: '#475569',
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '40px 36px' }}>
        {summary && (
          <ISection accent={accent} hFont={hFont} label="Profile">
            <p style={{ color: '#475569', lineHeight: '1.7' }}>{summary}</p>
          </ISection>
        )}

        {work.some((w) => w.company || w.role) && (
          <ISection accent={accent} hFont={hFont} label="Experience">
            {work.map((w) => (
              <div key={w.id} style={{ marginBottom: '18px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>
                    {w.role || 'Role'}
                  </p>
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
          </ISection>
        )}

        {education.some((e) => e.institution) && (
          <ISection accent={accent} hFont={hFont} label="Education">
            {education.map((e) => (
              <div
                key={e.id}
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}
              >
                <div>
                  <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{e.institution}</p>
                  <p style={{ color: '#64748b' }}>
                    {[e.degree, e.field].filter(Boolean).join(', ')}
                    {e.gpa ? ` — GPA ${e.gpa}` : ''}
                  </p>
                </div>
                <p style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {formatDateRange(e.startDate, e.endDate, false)}
                </p>
              </div>
            ))}
          </ISection>
        )}
      </div>
    </div>
  )
}

function ISideSection({ accent, label }: { accent: string; label: string }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <p
        style={{
          fontSize: '9px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontVariant: 'small-caps',
          color: accent,
          fontWeight: 700,
          marginBottom: '4px',
        }}
      >
        {label}
      </p>
      <div style={{ height: '1px', background: `${accent}30`, marginBottom: '8px' }} />
    </div>
  )
}

function ISection({
  accent,
  hFont,
  label,
  children,
}: {
  accent: string
  hFont: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <p
          style={{
            fontFamily: hFont,
            fontWeight: 700,
            fontSize: '12px',
            color: '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin: 0,
          }}
        >
          {label}
        </p>
        <div style={{ flex: 1, height: '1.5px', background: `${accent}40` }} />
      </div>
      {children}
    </div>
  )
}
// ---END FILE---
