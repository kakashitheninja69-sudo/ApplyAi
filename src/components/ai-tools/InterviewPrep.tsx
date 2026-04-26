import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import { generateInterviewQuestions } from '@/lib/ai'

type Category = 'behavioral' | 'technical' | 'situational'

interface Question {
  question: string
  tip: string
  category: Category
}

const CATEGORY_META: Record<Category, { label: string; icon: string; color: string; bg: string }> = {
  behavioral:  { label: 'Behavioral',  icon: 'psychology',    color: '#003fb1', bg: '#dbe1ff' },
  technical:   { label: 'Technical',   icon: 'code',          color: '#006c4a', bg: '#82f5c1' },
  situational: { label: 'Situational', icon: 'scenario',      color: '#852b00', bg: '#ffdbcf' },
}

function QuestionCard({ q, index }: { q: Question; index: number }) {
  const [open, setOpen] = useState(false)
  const meta = CATEGORY_META[q.category]

  return (
    <div
      className={cn(
        'bg-white rounded-xl border transition-all duration-200',
        open ? 'border-primary shadow-sm' : 'border-outline-variant hover:border-primary/40'
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-4 p-5 text-left"
      >
        <div
          className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold text-[12px] mt-0.5"
          style={{ background: meta.bg, color: meta.color }}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="font-label-caps text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: meta.bg, color: meta.color }}
            >
              {meta.label}
            </span>
          </div>
          <p className="font-body-md text-body-md font-medium text-on-background leading-snug">{q.question}</p>
        </div>
        <span
          className="material-symbols-outlined text-outline shrink-0 mt-1 transition-transform duration-200"
          style={{ fontSize: '20px', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 animate-fade-in">
          <div className="bg-primary-fixed/60 rounded-lg p-4 flex items-start gap-3 border border-primary/10">
            <span
              className="material-symbols-outlined text-primary shrink-0"
              style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
            >
              lightbulb
            </span>
            <div>
              <p className="font-label-caps text-label-caps uppercase text-primary tracking-widest mb-1">Coaching Tip</p>
              <p className="font-body-sm text-body-sm text-on-background">{q.tip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function InterviewPrep() {
  const data = useResumeStore((s) => s.data)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading]     = useState(false)
  const [filter, setFilter]       = useState<Category | 'all'>('all')

  async function handleGenerate() {
    setLoading(true)
    setQuestions([])
    try {
      const role   = data.contact.title || 'professional'
      const result = await generateInterviewQuestions(role)
      setQuestions(result)
    } finally {
      setLoading(false)
    }
  }

  const visible = filter === 'all' ? questions : questions.filter((q) => q.category === filter)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-h2 text-h2 mb-1">Interview Preparation</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Role-specific questions with coaching tips to help you answer with confidence.
        </p>
      </div>

      <div className="bg-surface-container-low rounded-xl border border-outline-variant p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>
            psychology
          </span>
        </div>
        <div className="flex-1">
          <p className="font-body-sm font-semibold text-on-background">
            Preparing for{' '}
            <span className="text-primary">{data.contact.title || 'your target role'}</span>
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">7 AI-curated questions across 3 categories</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={cn(
            'px-5 py-2.5 rounded-xl font-body-sm font-semibold flex items-center gap-2 shrink-0 transition-all',
            loading
              ? 'bg-surface-container text-outline cursor-wait'
              : 'ai-sparkle-button text-white'
          )}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1", animation: loading ? 'spin 1.5s linear infinite' : 'none' }}
          >
            {loading ? 'hourglass_empty' : 'auto_awesome'}
          </span>
          {loading ? 'Generating…' : questions.length ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      {loading && (
        <div className="space-y-3 animate-fade-in">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-16 rounded-xl shimmer-bg" />
          ))}
        </div>
      )}

      {questions.length > 0 && !loading && (
        <div className="space-y-4 animate-fade-in">
          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'behavioral', 'technical', 'situational'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-medium capitalize transition-all',
                  filter === cat
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                )}
              >
                {cat === 'all' ? `All (${questions.length})` : `${cat} (${questions.filter((q) => q.category === cat).length})`}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {visible.map((q, i) => (
              <QuestionCard key={i} q={q} index={questions.indexOf(q)} />
            ))}
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary shrink-0" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
              tips_and_updates
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <strong className="text-on-surface">Pro tip:</strong> Practice answering each question out loud. Record yourself — the playback reveals hesitations you won't notice otherwise.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
