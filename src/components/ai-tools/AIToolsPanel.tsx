import { useState } from 'react'
import { cn } from '@/lib/utils'
import JDMatcher     from './JDMatcher'
import CoverLetterGen from './CoverLetterGen'
import InterviewPrep  from './InterviewPrep'

type Tool = 'jd' | 'cover' | 'interview'

const TOOLS: { id: Tool; label: string; icon: string; description: string }[] = [
  { id: 'jd',       label: 'JD Match',       icon: 'target',     description: 'Keyword gap analysis' },
  { id: 'cover',    label: 'Cover Letter',   icon: 'edit_note',  description: 'AI-personalised draft' },
  { id: 'interview', label: 'Interview Prep', icon: 'psychology', description: '7 role-specific questions' },
]

export default function AIToolsPanel() {
  const [active, setActive] = useState<Tool>('jd')

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span className="font-body-sm font-semibold text-on-surface">AI Career Tools</span>
        </div>
        {/* Tool selector */}
        <div className="flex gap-2">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActive(tool.id)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 transition-all duration-200',
                active === tool.id
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-outline-variant text-on-surface-variant hover:border-primary/30 hover:bg-surface-container-low'
              )}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '20px', fontVariationSettings: active === tool.id ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tool.icon}
              </span>
              <span className="font-body-sm text-[11px] font-semibold leading-tight text-center">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {active === 'jd'       && <JDMatcher />}
        {active === 'cover'    && <CoverLetterGen />}
        {active === 'interview' && <InterviewPrep />}
      </div>
    </div>
  )
}
