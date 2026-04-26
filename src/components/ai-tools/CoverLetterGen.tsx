import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import { generateCoverLetter } from '@/lib/ai'

export default function CoverLetterGen() {
  const data = useResumeStore((s) => s.data)
  const [company, setCompany]     = useState('')
  const [role, setRole]           = useState('')
  const [letter, setLetter]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [copied, setCopied]       = useState(false)

  async function handleGenerate() {
    setLoading(true)
    setLetter('')
    try {
      const result = await generateCoverLetter({
        name:           data.contact.name || 'Applicant',
        role:           role || data.contact.title || 'the role',
        company:        company || 'your company',
        resumeSummary:  data.summary,
      })
      setLetter(result)
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-h2 text-h2 mb-1">Cover Letter Generator</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Personalized to the role and company. Edit freely after generation.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="cl-role">Target Role</Label>
          <Input
            id="cl-role"
            placeholder="Senior Designer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cl-company">Company</Label>
          <Input
            id="cl-company"
            placeholder="Acme Corp"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={cn(
          'w-full py-3.5 rounded-xl font-body-md font-semibold flex items-center justify-center gap-2 transition-all',
          loading
            ? 'bg-surface-container text-outline cursor-wait'
            : 'ai-sparkle-button text-white'
        )}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1", animation: loading ? 'spin 1.5s linear infinite' : 'none' }}
        >
          {loading ? 'hourglass_empty' : 'edit_note'}
        </span>
        {loading ? 'Writing your letter…' : 'Generate Cover Letter'}
      </button>

      {loading && (
        <div className="space-y-2 animate-fade-in">
          {[100, 90, 95, 80, 85, 70].map((w, i) => (
            <div key={i} className="h-4 rounded shimmer-bg" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {letter && !loading && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest">
              Your Cover Letter
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-medium transition-all',
                  copied
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                )}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: copied ? "'FILL' 1" : "'FILL' 0" }}>
                  {copied ? 'check_circle' : 'content_copy'}
                </span>
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>refresh</span>
                Regenerate
              </button>
            </div>
          </div>
          <Textarea
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            className="min-h-[340px] font-body-sm text-body-sm leading-relaxed whitespace-pre-line"
          />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            <span className="font-semibold">{letter.trim().split(/\s+/).length}</span> words · Edit the letter above before sending.
          </p>
        </div>
      )}
    </div>
  )
}
