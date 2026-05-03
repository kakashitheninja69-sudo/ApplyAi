import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadAllResumes, loadResume, saveResume } from '@/lib/localResumes'
import type { ResumeListItem } from '@/lib/localResumes'
import { useResumeStore } from '@/store/resumeStore'
import type { ApiJob } from '@/lib/jobApi'
import type { ResumeData } from '@/types/resume'

type DocMode = 'Resume' | 'Cover Letter' | 'Both'
type Phase   = 'pick' | 'generating' | 'done' | 'error'

interface Props {
  job:     ApiJob
  mode:    DocMode
  onClose: () => void
}

const BACKEND_URL = import.meta.env.VITE_JOB_API_URL ?? ''

export default function GenerateModal({ job, mode, onClose }: Props) {
  const navigate       = useNavigate()
  const loadResumeData = useResumeStore(s => s.loadResumeData)

  const [resumes,        setResumes]        = useState<ResumeListItem[]>([])
  const [selectedId,     setSelectedId]     = useState<string | null>(null)
  const [phase,          setPhase]          = useState<Phase>('pick')
  const [tailoredResume, setTailoredResume] = useState<ResumeData | null>(null)
  const [coverLetter,    setCoverLetter]    = useState<string>('')
  const [copied,         setCopied]         = useState(false)
  const [error,          setError]          = useState('')

  useEffect(() => {
    const list = loadAllResumes()
    setResumes(list)
    if (list.length >= 1) setSelectedId(list[0].id)
  }, [])

  async function generate() {
    if (!selectedId || !BACKEND_URL) {
      setError(BACKEND_URL ? 'No resume selected.' : 'Backend not connected. Set VITE_JOB_API_URL.')
      setPhase('error')
      return
    }

    const resumeData = loadResume(selectedId)
    if (!resumeData) { setError('Could not load resume data.'); setPhase('error'); return }

    setPhase('generating')
    setError('')

    try {
      const apiMode = mode === 'Resume' ? 'resume' : mode === 'Cover Letter' ? 'cover-letter' : 'both'

      const res = await fetch(`${BACKEND_URL}/ai/tailor`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          resumeData,
          job: { title: job.title, company: job.company, description: job.description, tags: job.tags },
          mode: apiMode,
        }),
        signal: AbortSignal.timeout(90_000),
      })

      const data = await res.json() as { tailoredResume?: ResumeData; coverLetter?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')

      if (data.tailoredResume) {
        const baseName  = resumes.find(r => r.id === selectedId)?.name ?? 'Resume'
        const newName   = `${baseName} → ${job.company}`
        const newId     = saveResume(null, data.tailoredResume, newName)
        loadResumeData(data.tailoredResume, newId, newName)
        setTailoredResume(data.tailoredResume)
      }

      if (data.coverLetter) setCoverLetter(data.coverLetter)

      setPhase('done')
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
      setPhase('error')
    }
  }

  function copyLetter() {
    navigator.clipboard.writeText(coverLetter).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const selectedResumeName = resumes.find(r => r.id === selectedId)?.name ?? ''

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-outline-variant">
          <div>
            <p className="font-bold text-[16px] text-on-background">
              {phase === 'pick'       && `Generate ${mode}`}
              {phase === 'generating' && 'AI is working…'}
              {phase === 'done'       && 'Done! 🎉'}
              {phase === 'error'      && 'Something went wrong'}
            </p>
            <p className="text-[12px] text-on-surface-variant mt-0.5 truncate max-w-[280px]">
              {job.title} at {job.company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors shrink-0 mt-0.5"
          >
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>

        <div className="px-6 py-5">

          {/* ── PICK PHASE ── */}
          {phase === 'pick' && (
            <div className="space-y-4">
              {resumes.length > 1 && (
                <div>
                  <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Choose resume to tailor</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {resumes.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                          selectedId === r.id ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/40'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>description</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[13px] text-on-background truncate">{r.name}</p>
                          <p className="text-[11px] text-on-surface-variant">{r.updatedAt.toLocaleDateString()}</p>
                        </div>
                        {selectedId === r.id && (
                          <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {resumes.length === 1 && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[13px] text-on-background">Tailoring: {selectedResumeName}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">Optimised for {job.title} at {job.company}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="material-symbols-outlined text-amber-600 shrink-0 mt-0.5" style={{ fontSize: '16px' }}>info</span>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  AI rewrites your summary, work bullets, and skills to match this job. Your original resume is automatically saved as a backup.
                </p>
              </div>

              <button
                onClick={generate}
                disabled={!selectedId}
                className="w-full py-3 rounded-2xl font-bold text-[14px] text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)', boxShadow: '0 4px 14px rgba(0,63,177,0.3)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
                Generate {mode} with AI
              </button>
            </div>
          )}

          {/* ── GENERATING PHASE ── */}
          {phase === 'generating' && (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="relative w-20 h-20 flex items-center justify-center mb-5">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '30px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
              </div>
              <p className="font-bold text-[15px] text-on-background mb-1">Tailoring your {mode.toLowerCase()}…</p>
              <p className="text-[12px] text-on-surface-variant mb-6 max-w-xs">
                Reading the job description and customising your content for {job.company}
              </p>
              <div className="w-52 h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '70%' }} />
              </div>
              <p className="text-[11px] text-on-surface-variant mt-3">This takes 15–30 seconds</p>
            </div>
          )}

          {/* ── DONE PHASE ── */}
          {phase === 'done' && (
            <div className="space-y-4">
              {tailoredResume && (
                <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-green-600" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <p className="font-bold text-[13px] text-green-800">Resume tailored successfully</p>
                  </div>
                  <p className="text-[11px] text-green-700 mb-3 leading-relaxed">
                    Saved as "<strong>{selectedResumeName} → {job.company}</strong>". Review and download it in the builder.
                  </p>
                  <button
                    onClick={() => { onClose(); navigate('/builder') }}
                    className="w-full py-2.5 rounded-xl font-bold text-[13px] text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit_document</span>
                    Open in Resume Builder
                  </button>
                </div>
              )}

              {coverLetter && (
                <div className="p-4 rounded-2xl border border-outline-variant">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-[13px] text-on-background">Cover Letter</p>
                    <button
                      onClick={copyLetter}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-colors"
                      style={{ color: copied ? '#15803d' : '#003fb1', background: copied ? '#dcfce7' : '#dbe1ff' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>{copied ? 'check' : 'content_copy'}</span>
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="max-h-56 overflow-y-auto text-[12px] text-on-surface-variant leading-relaxed whitespace-pre-wrap bg-surface-container-low rounded-xl p-3 border border-outline-variant">
                    {coverLetter}
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-outline-variant text-[13px] font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* ── ERROR PHASE ── */}
          {phase === 'error' && (
            <div className="py-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-error" style={{ fontSize: '28px' }}>error_outline</span>
              </div>
              <p className="font-bold text-[15px] text-on-background mb-1">Generation failed</p>
              <p className="text-[12px] text-on-surface-variant mb-5 max-w-xs leading-relaxed">{error}</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant text-[13px] font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setPhase('pick') }}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
