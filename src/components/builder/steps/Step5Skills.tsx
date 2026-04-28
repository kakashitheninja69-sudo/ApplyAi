import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import { suggestSkills } from '@/lib/ai'
import type { Skill } from '@/types/resume'

const CATEGORIES: { id: Skill['category']; label: string; icon: string; color: string; bg: string; border: string; placeholder: string }[] = [
  {
    id: 'technical', label: 'Technical Skills', icon: 'code',
    color: '#1a56db', bg: 'rgba(26,86,219,0.06)', border: 'rgba(26,86,219,0.2)',
    placeholder: 'React, TypeScript, Python, AWS…',
  },
  {
    id: 'soft', label: 'Soft Skills', icon: 'people',
    color: '#7c3aed', bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.2)',
    placeholder: 'Leadership, Communication, Problem-solving…',
  },
  {
    id: 'language', label: 'Languages', icon: 'translate',
    color: '#059669', bg: 'rgba(5,150,105,0.06)', border: 'rgba(5,150,105,0.2)',
    placeholder: 'English, Hindi, Spanish…',
  },
  {
    id: 'tool', label: 'Tools & Software', icon: 'build',
    color: '#d97706', bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.2)',
    placeholder: 'Figma, Jira, Docker, Notion…',
  },
]

const ATS_TARGET = 12

// ── Per-category skill input section ─────────────────────────────────────────
function CategorySection({ cat }: { cat: typeof CATEGORIES[number] }) {
  const { data, addSkill, removeSkill, spendCredit } = useResumeStore()
  const [input, setInput]         = useState('')
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)

  const skills = data.skills.filter((s) => s.category === cat.id)

  function handleAdd(name = input.trim()) {
    if (!name) return
    if (data.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return
    addSkill(name, cat.id)
    setInput('')
    inputRef.current?.focus()
  }

  function handleRemove(id: string) {
    setRemovingIds((prev) => new Set(prev).add(id))
    setTimeout(() => {
      removeSkill(id)
      setRemovingIds((prev) => { const n = new Set(prev); n.delete(id); return n })
    }, 150)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAdd() }
    if (e.key === 'Backspace' && !input && skills.length > 0) {
      handleRemove(skills[skills.length - 1].id)
    }
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: cat.border, background: '#fff' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: cat.bg, borderBottom: `1px solid ${cat.border}` }}
      >
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '16px', color: cat.color, fontVariationSettings: "'FILL' 1" }}
          >
            {cat.icon}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: cat.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {cat.label}
          </span>
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-bold"
          style={{ background: `${cat.color}18`, color: cat.color }}
        >
          {skills.length}
        </span>
      </div>

      {/* Tag chips + inline input */}
      <div
        className="flex flex-wrap gap-2 p-3 min-h-[52px] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {skills.map((skill) => (
          <span
            key={skill.id}
            className={cn(
              'inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[13px] font-medium select-none',
              removingIds.has(skill.id) ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            )}
            style={{
              background: `${cat.color}12`,
              border: `1.5px solid ${cat.color}28`,
              color: cat.color,
              transition: 'opacity 0.15s, transform 0.15s',
            }}
          >
            {skill.name}
            <button
              onClick={(e) => { e.stopPropagation(); handleRemove(skill.id) }}
              className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
              style={{ lineHeight: 1 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value.replace(',', ''))}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) handleAdd() }}
          placeholder={skills.length === 0 ? cat.placeholder : 'Add more…'}
          className="flex-1 min-w-[140px] bg-transparent outline-none text-[13px] text-on-surface placeholder:text-outline py-1 px-1"
        />
      </div>

      {/* Hint */}
      <div
        className="px-3 py-1.5 border-t"
        style={{ borderColor: cat.border, background: `${cat.bg}` }}
      >
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
          Press <kbd className="px-1 py-0.5 rounded bg-white border border-gray-200 text-[10px]">Enter</kbd> or{' '}
          <kbd className="px-1 py-0.5 rounded bg-white border border-gray-200 text-[10px]">,</kbd> to add · Backspace to remove last
        </span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Step5Skills() {
  const { data, spendCredit } = useResumeStore()
  const [suggestions, setSuggestions]   = useState<string[]>([])
  const [suggestCat, setSuggestCat]     = useState<Skill['category']>('technical')
  const [suggestLoading, setSuggestLoading] = useState(false)
  const { addSkill } = useResumeStore()

  const totalSkills = data.skills.length
  const atsProgress = Math.min((totalSkills / ATS_TARGET) * 100, 100)
  const atsColor =
    totalSkills >= ATS_TARGET ? '#059669' :
    totalSkills >= 6          ? '#d97706' : '#1a56db'

  async function handleAISuggest() {
    if (!spendCredit()) return
    setSuggestLoading(true)
    setSuggestions([])
    try {
      const existing = data.skills.map((s) => s.name)
      const title    = data.contact.title || 'professional'
      const result   = await suggestSkills(title, existing)
      setSuggestions(result)
    } finally {
      setSuggestLoading(false)
    }
  }

  function handleAddSuggestion(name: string) {
    if (!data.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      addSkill(name, suggestCat)
    }
    setSuggestions((prev) => prev.filter((s) => s !== name))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-h2 text-h2 mb-1">Skills</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Add skills for your target role. Each category has its own section — type and press Enter to add.
        </p>
      </div>

      {/* ATS meter */}
      <div className="bg-white rounded-2xl border border-outline-variant p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '16px', color: atsColor, fontVariationSettings: "'FILL' 1" }}
            >
              {totalSkills >= ATS_TARGET ? 'verified' : 'track_changes'}
            </span>
            <span className="font-body-sm font-semibold text-on-background">ATS Readiness</span>
          </div>
          <span className="font-body-sm font-bold" style={{ color: atsColor }}>
            {totalSkills} / {ATS_TARGET} skills
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${atsProgress}%`, background: atsColor }}
          />
        </div>
        <p className="font-body-sm text-[11px] text-on-surface-variant mt-1.5">
          {totalSkills >= ATS_TARGET
            ? 'Great — your skill set is well-optimised for ATS screening.'
            : `Add ${ATS_TARGET - totalSkills} more skill${ATS_TARGET - totalSkills === 1 ? '' : 's'} to hit the recommended minimum.`}
        </p>
      </div>

      {/* 4 separate category sections */}
      {CATEGORIES.map((cat) => (
        <CategorySection key={cat.id} cat={cat} />
      ))}

      {/* AI Suggest */}
      <div className="bg-white rounded-2xl border border-outline-variant p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-body-sm font-semibold text-on-background mb-0.5">AI Skill Suggestions</p>
            <p className="text-[12px] text-on-surface-variant">
              Add to:{' '}
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSuggestCat(cat.id)}
                  className="mr-2 font-semibold transition-colors"
                  style={{ color: suggestCat === cat.id ? cat.color : '#94a3b8' }}
                >
                  {cat.label.split(' ')[0]}
                </button>
              ))}
            </p>
          </div>
          <button
            onClick={handleAISuggest}
            disabled={suggestLoading}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl font-body-sm text-[13px] font-semibold transition-all',
              suggestLoading ? 'bg-surface-container text-outline cursor-wait' : 'ai-sparkle-button text-white'
            )}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
            >
              {suggestLoading ? 'hourglass_empty' : 'auto_awesome'}
            </span>
            {suggestLoading ? 'Thinking…' : 'AI Suggest'}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleAddSuggestion(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-primary/40 text-primary font-body-sm text-[13px] font-medium hover:bg-primary/5 hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
