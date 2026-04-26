import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import { suggestSkills } from '@/lib/ai'
import type { Skill } from '@/types/resume'

const CATEGORIES: { id: Skill['category']; label: string; icon: string; color: string; bg: string }[] = [
  { id: 'technical', label: 'Technical',   icon: 'code',       color: '#1a56db', bg: 'rgba(26,86,219,0.08)'  },
  { id: 'soft',      label: 'Soft Skills', icon: 'people',     color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { id: 'language',  label: 'Languages',   icon: 'translate',  color: '#059669', bg: 'rgba(5,150,105,0.08)'  },
  { id: 'tool',      label: 'Tools',       icon: 'build',      color: '#d97706', bg: 'rgba(217,119,6,0.08)'  },
]

const ATS_TARGET = 12

export default function Step5Skills() {
  const { data, addSkill, removeSkill, spendCredit } = useResumeStore()
  const [input, setInput]               = useState('')
  const [activeCategory, setActiveCategory] = useState<Skill['category']>('technical')
  const [suggestions, setSuggestions]   = useState<string[]>([])
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [removingIds, setRemovingIds]   = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory)!
  const byCategory = (cat: Skill['category']) => data.skills.filter((s) => s.category === cat)

  function handleAdd(name = input.trim()) {
    if (!name) return
    if (data.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return
    addSkill(name, activeCategory)
    setInput('')
    setSuggestions((prev) => prev.filter((s) => s !== name))
    inputRef.current?.focus()
  }

  function handleRemove(id: string) {
    setRemovingIds((prev) => new Set(prev).add(id))
    setTimeout(() => {
      removeSkill(id)
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 170)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAdd()
    }
    if (e.key === 'Backspace' && !input) {
      const list = byCategory(activeCategory)
      const last = list[list.length - 1]
      if (last) handleRemove(last.id)
    }
  }

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

  const totalSkills = data.skills.length
  const atsProgress = Math.min((totalSkills / ATS_TARGET) * 100, 100)
  const atsColor =
    totalSkills >= ATS_TARGET ? '#059669' :
    totalSkills >= 6          ? '#d97706' : '#1a56db'

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h2 className="font-h2 text-h2 mb-1">Skills</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Add skills for your target role. Press Enter or comma to add each one.
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

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => {
          const count   = byCategory(cat.id).length
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl font-body-sm font-semibold transition-all duration-200 border',
                isActive
                  ? 'text-white border-transparent shadow-md'
                  : 'bg-white text-on-surface-variant border-outline-variant hover:border-primary/40 hover:text-on-surface'
              )}
              style={isActive ? { background: cat.color, boxShadow: `0 4px 12px ${cat.color}33` } : {}}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '16px', fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {cat.icon}
              </span>
              {cat.label}
              {count > 0 && (
                <span
                  className="ml-0.5 rounded-full w-5 h-5 text-[11px] font-bold flex items-center justify-center"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.25)' : `${cat.color}18`,
                    color:      isActive ? 'white' : cat.color,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tag input area */}
      <div
        className="skill-input-glow bg-white rounded-2xl border border-outline-variant transition-all duration-200 overflow-hidden"
        style={{ '--active-color': activeCat.color } as React.CSSProperties}
      >
        {/* Active category label */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100"
          style={{ background: activeCat.bg }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '15px', color: activeCat.color, fontVariationSettings: "'FILL' 1" }}
          >
            {activeCat.icon}
          </span>
          <span className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: activeCat.color }}>
            {activeCat.label}
          </span>
        </div>

        {/* Skill chips */}
        <div className="p-3 flex flex-wrap gap-2 min-h-[52px]">
          {byCategory(activeCategory).map((skill) => (
            <SkillChip
              key={skill.id}
              name={skill.name}
              color={activeCat.color}
              isRemoving={removingIds.has(skill.id)}
              onRemove={() => handleRemove(skill.id)}
            />
          ))}

          {/* Inline input */}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.replace(',', ''))}
            onKeyDown={handleKeyDown}
            placeholder={
              byCategory(activeCategory).length === 0
                ? `Type a ${activeCat.label.toLowerCase()} skill and press Enter…`
                : 'Add another…'
            }
            className="flex-1 min-w-[140px] bg-transparent outline-none font-body-sm text-body-sm text-on-surface placeholder:text-outline py-1 px-1"
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50/50">
          <span className="font-body-sm text-[11px] text-on-surface-variant">
            {byCategory(activeCategory).length} in this category
          </span>
          <button
            onClick={handleAISuggest}
            disabled={suggestLoading}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body-sm text-[12px] font-semibold shrink-0 transition-all duration-200',
              suggestLoading
                ? 'bg-surface-container text-outline cursor-not-allowed'
                : 'ai-sparkle-button text-white'
            )}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '14px',
                fontVariationSettings: "'FILL' 1",
                animation: suggestLoading ? 'spin 1s linear infinite' : 'sparkleFloat 2s ease-in-out infinite',
              }}
            >
              {suggestLoading ? 'hourglass_empty' : 'auto_awesome'}
            </span>
            {suggestLoading ? 'Thinking…' : 'AI Suggest'}
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1", animation: 'sparkleFloat 2s ease-in-out infinite' }}
            >
              auto_awesome
            </span>
            <p className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest">
              AI Suggestions — click to add
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={s}
                onClick={() => handleAdd(s)}
                className="suggestion-slide-in flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-primary/40 text-primary font-body-sm text-body-sm font-medium hover:bg-primary/5 hover:border-primary hover:scale-105 active:scale-95 transition-all duration-150"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All skills breakdown */}
      {data.skills.length > 0 && (
        <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant">
          <p className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest mb-4">
            All Skills ({data.skills.length})
          </p>
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const list = byCategory(cat.id)
              if (list.length === 0) return null
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '13px', color: cat.color, fontVariationSettings: "'FILL' 1" }}
                    >
                      {cat.icon}
                    </span>
                    <span className="font-label-caps text-[10px] uppercase tracking-widest font-bold" style={{ color: cat.color }}>
                      {cat.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map((skill) => (
                      <SkillChip
                        key={skill.id}
                        name={skill.name}
                        color={cat.color}
                        isRemoving={removingIds.has(skill.id)}
                        onRemove={() => handleRemove(skill.id)}
                        compact
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Skill Chip ─────────────────────────────────────────────── */
interface SkillChipProps {
  name: string
  color: string
  isRemoving: boolean
  onRemove: () => void
  compact?: boolean
}

function SkillChip({ name, color, isRemoving, onRemove, compact = false }: SkillChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-lg font-medium select-none group',
        compact ? 'text-[11px] px-2.5 py-0.5' : 'text-[13px] px-3 py-1.5',
        isRemoving ? 'skill-pop-out' : 'skill-pop-in'
      )}
      style={{
        background: `${color}14`,
        border: `1.5px solid ${color}30`,
        color,
      }}
    >
      {name}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full flex items-center justify-center opacity-50 hover:opacity-100 hover:bg-black/10 transition-all duration-150"
        style={{ width: compact ? '14px' : '16px', height: compact ? '14px' : '16px' }}
        aria-label={`Remove ${name}`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: compact ? '11px' : '13px' }}>close</span>
      </button>
    </span>
  )
}
