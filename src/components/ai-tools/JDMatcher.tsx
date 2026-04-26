import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import { analyzeJobDescription } from '@/lib/ai'
import { Progress } from '@/components/ui/progress'

interface AnalysisResult {
  matchScore: number
  missingKeywords: string[]
  presentKeywords: string[]
  suggestions: string[]
}

export default function JDMatcher() {
  const data        = useResumeStore((s) => s.data)
  const spendCredit = useResumeStore((s) => s.spendCredit)
  const [jd, setJd]             = useState('')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<AnalysisResult | null>(null)

  async function handleAnalyze() {
    if (!jd.trim()) return
    if (!spendCredit()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await analyzeJobDescription(jd, data)
      setResult(res)
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = !result ? 'text-on-surface' :
    result.matchScore >= 80 ? 'text-secondary' :
    result.matchScore >= 60 ? 'text-[#ea580c]' : 'text-error'

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-h2 text-h2 mb-1">Job Description Matching</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Paste the job description below. Our AI will compare it against your resume and surface keyword gaps.
        </p>
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Paste the full job description here…"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          className="min-h-[160px] font-body-sm text-body-sm"
        />
        <p className="font-body-sm text-body-sm text-outline text-right">{jd.length} chars</p>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !jd.trim()}
        className={cn(
          'w-full py-3.5 rounded-xl font-body-md font-semibold flex items-center justify-center gap-2 transition-all',
          loading || !jd.trim()
            ? 'bg-surface-container text-outline cursor-not-allowed'
            : 'ai-sparkle-button text-white'
        )}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1", animation: loading ? 'spin 1.5s linear infinite' : 'none' }}
        >
          {loading ? 'hourglass_empty' : 'target'}
        </span>
        {loading ? 'Analysing…' : 'Analyse Match'}
      </button>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3 animate-fade-in">
          {[100, 70, 85].map((w, i) => (
            <div key={i} className="h-12 rounded-xl shimmer-bg" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-5 animate-fade-in">
          {/* Score ring */}
          <div className="bg-white rounded-2xl border border-outline-variant p-6 flex items-center gap-6">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5eeff" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={result.matchScore >= 80 ? '#006c4a' : result.matchScore >= 60 ? '#ea580c' : '#ba1a1a'}
                  strokeWidth="3"
                  strokeDasharray={`${result.matchScore} ${100 - result.matchScore}`}
                  strokeLinecap="round"
                />
              </svg>
              <p className={cn('absolute inset-0 flex items-center justify-center font-h2 font-bold text-lg', scoreColor)}>
                {result.matchScore}%
              </p>
            </div>
            <div>
              <p className="font-h2 text-body-lg font-bold mb-1">ATS Match Score</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {result.matchScore >= 80
                  ? 'Strong match — your resume is well-aligned.'
                  : result.matchScore >= 60
                  ? 'Good foundation. A few tweaks will lift your score.'
                  : 'Needs work. Use the suggestions below to close gaps.'}
              </p>
              <Progress value={result.matchScore} className="mt-3 h-2 w-40" />
            </div>
          </div>

          {/* Keywords */}
          <div className="grid grid-cols-2 gap-4">
            <KeywordBlock title="Present Keywords" icon="check_circle" color="#006c4a" bgColor="#82f5c1" keywords={result.presentKeywords} />
            <KeywordBlock title="Missing Keywords" icon="warning" color="#ba1a1a" bgColor="#ffdad6" keywords={result.missingKeywords} />
          </div>

          {/* Suggestions */}
          <div className="bg-surface-container-low rounded-xl border border-outline-variant p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
                lightbulb
              </span>
              <p className="font-label-caps text-label-caps uppercase text-primary tracking-widest">
                AI Recommendations
              </p>
            </div>
            {result.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="font-label-caps text-label-caps bg-primary text-white rounded px-1.5 py-0.5 mt-0.5 shrink-0">
                  {i + 1}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function KeywordBlock({
  title, icon, color, bgColor, keywords,
}: {
  title: string; icon: string; color: string; bgColor: string; keywords: string[]
}) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant p-4">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '16px', color, fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <p className="font-body-sm font-semibold text-on-background">{title}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {keywords.map((kw) => (
          <span
            key={kw}
            className="font-body-sm text-[12px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: bgColor, color }}
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  )
}
