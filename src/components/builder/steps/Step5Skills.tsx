import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import { suggestSkills } from '@/lib/ai'
import type { Skill } from '@/types/resume'

const CATEGORIES: { id: Skill['category']; label: string; icon: string }[] = [
  { id: 'technical', label: 'Technical',  icon: 'code' },
  { id: 'soft',      label: 'Soft Skills', icon: 'people' },
  { id: 'language',  label: 'Languages',  icon: 'translate' },
  { id: 'tool',      label: 'Tools',       icon: 'build' },
]

export default function Step5Skills() {
  const { data, addSkill, removeSkill } = useResumeStore()
  const [input, setInput]         = useState('')
  const [activeCategory, setActiveCategory] = useState<Skill['category']>('technical')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggestLoading, setSuggestLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleAdd(name = input.trim()) {
    if (!name) return
    if (data.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return
    addSkill(name, activeCategory)
    setInput('')
    setSuggestions((prev) => prev.filter((s) => s !== name))
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
    if (e.key === 'Backspace' && !input) {
      const last = data.skills.findLast((s) => s.category === activeCategory)
      if (last) removeSkill(last.id)
    }
  }

  async function handleAISuggest() {
    setSuggestLoading(true)
    try {
      const existing = data.skills.map((s) => s.name)
      const title    = data.contact.title || 'professional'
      const result   = await suggestSkills(title, existing)
      setSuggestions(result)
    } finally {
      setSuggestLoading(false)
    }
  }

  const byCategory = (cat: Skill['category']) => data.skills.filter((s) => s.category === cat)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-h2 text-h2 mb-1">Skills</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Add skills relevant to your target role. Press Enter or comma to add each one.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg font-body-sm text-body-sm font-medium transition-all',
              activeCategory === cat.id
                ? 'bg-primary text-white'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            )}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{cat.icon}</span>
            {cat.label}
            {byCategory(cat.id).length > 0 && (
              <span className={cn(
                'ml-1 rounded-full w-5 h-5 text-[11px] font-bold flex items-center justify-center',
                activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
              )}>
                {byCategory(cat.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tag input */}
      <div className="bg-white rounded-xl border border-outline-variant p-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <div className="flex flex-wrap gap-2 mb-3">
          {byCategory(activeCategory).map((skill) => (
            <Badge
              key={skill.id}
              variant="secondary"
              onRemove={() => removeSkill(skill.id)}
              className="text-[13px] py-1 px-3"
            >
              {skill.name}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.replace(',', ''))}
            onKeyDown={handleKeyDown}
            placeholder={`Add ${CATEGORIES.find((c) => c.id === activeCategory)?.label.toLowerCase()} skill…`}
            className="flex-1 bg-transparent outline-none font-body-sm text-body-sm text-on-surface placeholder:text-outline"
          />
          <button
            onClick={handleAISuggest}
            disabled={suggestLoading}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-semibold shrink-0 transition-all',
              suggestLoading ? 'bg-surface-container text-outline' : 'ai-sparkle-button text-white'
            )}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
            >
              {suggestLoading ? 'hourglass_empty' : 'auto_awesome'}
            </span>
            {suggestLoading ? 'Suggesting…' : 'AI Suggest'}
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="animate-fade-in">
          <p className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest mb-3">
            AI Suggestions — click to add
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleAdd(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-primary/40 text-primary font-body-sm text-body-sm font-medium hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All skills overview */}
      {data.skills.length > 0 && (
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant">
          <p className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest mb-3">
            All skills ({data.skills.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="outline"
                onRemove={() => removeSkill(skill.id)}
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <p className="font-body-sm text-body-sm text-on-surface-variant">
        <span className="font-semibold">{data.skills.length}</span> skills added · Aim for 8–14 for best ATS performance.
      </p>
    </div>
  )
}
