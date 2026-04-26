import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import { generateSummary } from '@/lib/ai'

export default function Step6Summary() {
  const { data, setSummary, spendCredit } = useResumeStore()
  const [loading, setLoading]       = useState(false)
  const [options, setOptions]       = useState<string[]>([])
  const [selected, setSelected]     = useState<number | null>(null)

  const charCount = data.summary.length
  const wordCount = data.summary.trim().split(/\s+/).filter(Boolean).length

  async function handleGenerate() {
    if (!spendCredit()) return
    setLoading(true)
    setOptions([])
    setSelected(null)
    try {
      const topSkills     = data.skills.slice(0, 6).map((s) => s.name)
      const yearsExp      = data.work.length
      const results = await generateSummary({
        name:            data.contact.name,
        title:           data.contact.title,
        yearsExperience: yearsExp,
        topSkills,
      })
      setOptions(results)
    } finally {
      setLoading(false)
    }
  }

  function pickOption(idx: number, text: string) {
    setSelected(idx)
    setSummary(text)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-h2 text-h2 mb-1">Professional summary</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          A 2–4 sentence snapshot of your career. This is the first thing recruiters read — make it count.
        </p>
      </div>

      {/* Main textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary">Your Summary</Label>
          <span className="font-body-sm text-body-sm text-outline">
            {wordCount} words · {charCount} chars
          </span>
        </div>
        <Textarea
          id="summary"
          placeholder="Results-driven professional with 5+ years…"
          value={data.summary}
          onChange={(e) => setSummary(e.target.value)}
          className="min-h-[140px] text-body-md leading-relaxed"
        />
      </div>

      {/* AI Generate */}
      <div className="space-y-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={cn(
            'w-full flex items-center justify-center gap-3 py-4 rounded-xl font-h2 text-body-md font-semibold transition-all',
            loading ? 'bg-surface-container text-outline cursor-wait' : 'ai-sparkle-button text-white'
          )}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '20px',
              fontVariationSettings: "'FILL' 1",
              animation: loading ? 'spin 1.5s linear infinite' : 'none',
            }}
          >
            {loading ? 'hourglass_empty' : 'auto_awesome'}
          </span>
          {loading ? 'Generating 3 options…' : 'Generate with AI'}
        </button>

        {loading && (
          <div className="space-y-3 animate-fade-in">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-surface-container shimmer-bg" />
            ))}
          </div>
        )}

        {options.length > 0 && !loading && (
          <div className="space-y-3 animate-fade-in">
            <p className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest">
              Pick an option — or edit freely above
            </p>
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => pickOption(idx, opt)}
                className={cn(
                  'w-full text-left p-5 rounded-xl border-2 transition-all duration-200',
                  selected === idx
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant hover:border-primary/50 bg-white'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all',
                      selected === idx ? 'border-primary bg-primary' : 'border-outline-variant'
                    )}
                  >
                    {selected === idx && (
                      <span
                        className="material-symbols-outlined text-white"
                        style={{ fontSize: '12px', fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    )}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">{opt}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quality hints */}
      <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant space-y-2">
        <p className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest mb-3">
          Writing Tips
        </p>
        {[
          { icon: 'check_circle', text: 'Lead with your title and years of experience', ok: !!data.contact.title },
          { icon: 'check_circle', text: 'Include 2–3 specific, relevant skills',          ok: data.skills.length >= 2 },
          { icon: 'check_circle', text: 'End with your key value proposition',            ok: wordCount >= 20 },
        ].map(({ icon, text, ok }) => (
          <div key={text} className="flex items-center gap-2.5">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1", color: ok ? '#006c4a' : '#c3c5d7' }}
            >
              {icon}
            </span>
            <span className={cn('font-body-sm text-body-sm', ok ? 'text-on-surface' : 'text-on-surface-variant')}>
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
