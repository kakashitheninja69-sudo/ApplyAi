// FILE: src/components/resume-templates/HealthcarePro.tsx
import type { TemplateProps } from './shared'
import { headingFont, formatDateRange } from './shared'

const TEAL = '#0d9488'
const TEAL_LIGHT = '#f0fdfa'

const CATEGORY_ICONS: Record<string, string> = {
  technical: '🔬 Technical',
  soft: '💊 Clinical',
  language: '🌍 Language',
  tool: '🛠 Tools',
}

export default function HealthcarePro({ data }: TemplateProps) {
  const hFont = headingFont(data)
  const { contact, work, education, skills, summary } = data

  const skillsByCategory: Record<string, typeof skills> = {
    technical: skills.filter((s) => s.category === 'technical'),
    soft: skills.filter((s) => s.category === 'soft'),
    language: skills.filter((s) => s.category === 'language'),
    tool: skills.filter((s) => s.category === 'tool'),
  }

  return (
    <div
      style={{
        width: '794px',
        minHeight: '1123px',
        padding: '48px 48px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#1e293b',
        background: '#fff',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: hFont,
              fontSize: '22px',
              fontWeight: 700,
              color: TEAL,
              margin: 0,
            }}
          >
            {contact.name || 'Your Name'}
          </h1>
          {contact.title && (
            <p style={{ fontSize: '12px', color: '#475569', marginTop: '3px', fontWeight: 500 }}>
              {contact.title}
            </p>
          )}
        </div>

        {/* Contact box */}
        <div
          style={{
            background: TEAL_LIGHT,
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '10px',
            color: '#0f766e',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minWidth: '200px',
          }}
        >
          {contact.email && <p style={{ margin: 0 }}>✉ {contact.email}</p>}
          {contact.phone && <p style={{ margin: 0 }}>📞 {contact.phone}</p>}
          {contact.location && <p style={{ margin: 0 }}>📍 {contact.location}</p>}
          {contact.linkedin && <p style={{ margin: 0 }}>🔗 {contact.linkedin}</p>}
          {contact.website && <p style={{ margin: 0 }}>🌐 {contact.website}</p>}
        </div>
      </div>

      {summary && (
        <HSection label="Professional Summary">
          <p style={{ color: '#475569', lineHeight: '1.7' }}>{summary}</p>
        </HSection>
      )}

      {work.some((w) => w.company || w.role) && (
        <HSection label="Clinical & Professional Experience">
          {work.map((w) => (
            <div key={w.id} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 700, fontSize: '12px', fontFamily: hFont }}>{w.role || 'Role'}</p>
                <p style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {formatDateRange(w.startDate, w.endDate, w.current)}
                </p>
              </div>
              <p style={{ color: TEAL, fontWeight: 600, fontSize: '11px', marginBottom: '5px' }}>
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
        </HSection>
      )}

      {education.some((e) => e.institution) && (
        <HSection label="Education & Credentials">
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
        </HSection>
      )}

      {skills.length > 0 && (
        <HSection label="Competencies">
          {Object.entries(skillsByCategory).map(([cat, list]) =>
            list.length > 0 ? (
              <div key={cat} style={{ marginBottom: '10px' }}>
                <p
                  style={{
                    fontSize: '10px',
                    color: TEAL,
                    fontWeight: 600,
                    marginBottom: '5px',
                  }}
                >
                  {CATEGORY_ICONS[cat] || cat}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {list.map((s) => (
                    <span
                      key={s.id}
                      style={{
                        background: TEAL_LIGHT,
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '10px',
                        color: '#0f766e',
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </HSection>
      )}
    </div>
  )
}

function HSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
        }}
      >
        <div style={{ width: '4px', height: '18px', background: TEAL, borderRadius: '2px', flexShrink: 0 }} />
        <p
          style={{
            fontWeight: 700,
            fontSize: '12px',
            color: TEAL,
            margin: 0,
          }}
        >
          {label}
        </p>
        <div style={{ flex: 1, height: '1px', background: `${TEAL}30` }} />
      </div>
      {children}
    </div>
  )
}
// ---END FILE---
