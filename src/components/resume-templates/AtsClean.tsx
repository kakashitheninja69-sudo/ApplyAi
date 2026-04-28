// FILE: src/components/resume-templates/AtsClean.tsx
import type { TemplateProps } from './shared'
import { accentHex, headingFont, formatDateRange } from './shared'

export default function AtsClean({ data }: TemplateProps) {
  const hFont = headingFont(data)
  const { contact, work, education, skills, summary } = data

  const skillsByCategory: Record<string, typeof skills> = {
    Technical: skills.filter((s) => s.category === 'technical'),
    Soft: skills.filter((s) => s.category === 'soft'),
    Language: skills.filter((s) => s.category === 'language'),
    Tool: skills.filter((s) => s.category === 'tool'),
  }

  const contactParts = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedin,
    contact.website,
  ].filter(Boolean)

  return (
    <div
      style={{
        width: '794px',
        minHeight: '1123px',
        padding: '56px 56px 48px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#000',
        background: '#fff',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1
          style={{
            fontFamily: hFont,
            fontSize: '22px',
            fontWeight: 700,
            color: '#000',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          {contact.name || 'Your Name'}
        </h1>
        {contact.title && (
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#000', marginTop: '2px' }}>
            {contact.title}
          </p>
        )}
        {contactParts.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 14px', fontSize: '10px', color: '#000', marginTop: '6px' }}>
            {contact.email    && <span>✉ {contact.email}</span>}
            {contact.phone    && <span>☎ {contact.phone}</span>}
            {contact.location && <span>⊙ {contact.location}</span>}
            {contact.linkedin && <span>in {contact.linkedin}</span>}
            {contact.website  && <span>↗ {contact.website}</span>}
          </div>
        )}
      </div>

      {summary && (
        <SectionBlock label="Summary">
          <p style={{ color: '#000' }}>{summary}</p>
        </SectionBlock>
      )}

      {work.some((w) => w.company || w.role) && (
        <SectionBlock label="Experience">
          {work.map((w) => (
            <div key={w.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: 700, fontSize: '11px', color: '#000' }}>
                  {w.role || 'Role'}{w.company ? `, ${w.company}` : ''}
                </p>
                <p style={{ fontSize: '10px', color: '#000' }}>
                  {formatDateRange(w.startDate, w.endDate, w.current)}
                </p>
              </div>
              <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                {w.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ listStyleType: 'disc', color: '#000', marginBottom: '2px' }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </SectionBlock>
      )}

      {education.some((e) => e.institution) && (
        <SectionBlock label="Education">
          {education.map((e) => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <p style={{ fontWeight: 700, color: '#000' }}>{e.institution}</p>
                <p style={{ color: '#000' }}>
                  {[e.degree, e.field].filter(Boolean).join(', ')}
                  {e.gpa ? ` — GPA ${e.gpa}` : ''}
                </p>
              </div>
              <p style={{ fontSize: '10px', color: '#000', whiteSpace: 'nowrap' }}>
                {formatDateRange(e.startDate, e.endDate, false)}
              </p>
            </div>
          ))}
        </SectionBlock>
      )}

      {skills.length > 0 && (
        <SectionBlock label="Skills">
          {Object.entries(skillsByCategory).map(([cat, list]) =>
            list.length > 0 ? (
              <p key={cat} style={{ marginBottom: '4px', color: '#000' }}>
                <strong>{cat}:</strong> {list.map((s) => s.name).join(', ')}
              </p>
            ) : null
          )}
        </SectionBlock>
      )}
    </div>
  )
}

function SectionBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <p
        style={{
          fontWeight: 700,
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: '#000',
          borderBottom: '1px solid #000',
          paddingBottom: '3px',
          marginBottom: '10px',
        }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}
// ---END FILE---
