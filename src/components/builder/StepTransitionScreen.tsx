import { useEffect, useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import TemplateThumbnail from '@/components/resume-templates/TemplateThumbnail'

interface Props {
  fromStep: number
  toStep: number
  onContinue: () => void
}

const STEP_INFO = [
  { label: 'Template',             icon: 'palette',       color: '#7c3aed' },
  { label: 'Contact Info',         icon: 'contact_page',  color: '#003fb1' },
  { label: 'Work Experience',      icon: 'work_history',  color: '#006c4a' },
  { label: 'Education',            icon: 'school',        color: '#0d9488' },
  { label: 'Skills',               icon: 'psychology',    color: '#ea580c' },
  { label: 'Professional Summary', icon: 'description',   color: '#db2777' },
]

const DONE_MESSAGES: Record<number, { headline: string; tip: string }> = {
  1: {
    headline: 'Great choice!',
    tip: 'Your template is set. Now let\'s fill in your personal details.',
  },
  2: {
    headline: 'Contact info saved!',
    tip: 'Recruiters need to reach you — that\'s the most important step done.',
  },
  3: {
    headline: 'Work history added!',
    tip: 'That\'s the most-read section of any resume. Well done!',
  },
  4: {
    headline: 'Education complete!',
    tip: 'Just a couple of sections left — you\'re flying through this.',
  },
  5: {
    headline: 'Skills locked in!',
    tip: 'ATS engines look for keyword matches — great move adding those skills.',
  },
}

export default function StepTransitionScreen({ fromStep, toStep, onContinue }: Props) {
  const data    = useResumeStore(s => s.data)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 30)
    return () => clearTimeout(t)
  }, [])

  const done = DONE_MESSAGES[fromStep] ?? { headline: 'Nice work!', tip: 'Keep going.' }
  const next = STEP_INFO[toStep - 1]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      style={{ opacity: show ? 1 : 0, transition: 'opacity 0.25s ease' }}
    >
      <div className="flex items-center gap-16 max-w-4xl w-full px-8">

        {/* Left: message */}
        <div className="flex-1 max-w-md">
          {/* Check */}
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-7">
            <span
              className="material-symbols-outlined text-green-500"
              style={{ fontSize: '30px', fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>

          <h2 style={{ fontFamily: 'inherit', fontSize: '28px', fontWeight: 700, lineHeight: 1.2, marginBottom: '10px', color: '#0f172a' }}>
            {done.headline}
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.65', marginBottom: '32px' }}>
            {done.tip}
          </p>

          {/* Next-up card */}
          <div
            className="flex items-center gap-4 rounded-2xl px-5 py-4 mb-8"
            style={{ background: `${next.color}12`, border: `1px solid ${next.color}25` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: next.color }}
            >
              <span
                className="material-symbols-outlined text-white"
                style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
              >
                {next.icon}
              </span>
            </div>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: next.color, marginBottom: '2px' }}>
                Next Up
              </p>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{next.label}</p>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-sm hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ background: next.color, boxShadow: `0 6px 20px ${next.color}40` }}
          >
            Let's Go
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </button>

          {/* Step dots */}
          <div className="flex items-center gap-1.5 mt-8">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                style={{
                  height: '6px',
                  borderRadius: '3px',
                  transition: 'all 0.3s',
                  width: i + 1 < toStep ? '16px' : i + 1 === toStep ? '24px' : '16px',
                  background: i + 1 < toStep ? '#22c55e' : i + 1 === toStep ? next.color : '#e2e8f0',
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: resume thumbnail */}
        <div className="hidden lg:flex flex-col items-center gap-3 shrink-0">
          <div
            className="rounded-xl overflow-hidden"
            style={{ width: '200px', boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)' }}
          >
            <TemplateThumbnail templateId={data.template} accentColor={data.accentColor} />
          </div>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>
            Your Resume So Far
          </p>
        </div>

      </div>
    </div>
  )
}
