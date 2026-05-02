import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { saveResume, saveVersion } from '@/lib/localResumes'
import StepperProgress       from '@/components/builder/StepperProgress'
import LivePreview           from '@/components/builder/LivePreview'
import AIToolsPanel          from '@/components/ai-tools/AIToolsPanel'
import StepTransitionScreen  from '@/components/builder/StepTransitionScreen'
import Step1Contact          from '@/components/builder/steps/Step2Contact'
import Step2Work             from '@/components/builder/steps/Step3Work'
import Step3Education        from '@/components/builder/steps/Step4Education'
import Step4Skills           from '@/components/builder/steps/Step5Skills'
import Step5Projects         from '@/components/builder/steps/Step5Projects'
import Step6Summary          from '@/components/builder/steps/Step6Summary'

const STEP_COMPONENTS = [
  Step1Contact,
  Step2Work,
  Step3Education,
  Step4Skills,
  Step5Projects,
  Step6Summary,
]

const STEP_LABELS = [
  'Contact Info',
  'Work Experience',
  'Education',
  'Skills',
  'Projects',
  'Professional Summary',
]

type RightPanel = 'preview' | 'ai'

export default function BuilderPage() {
  const navigate  = useNavigate()
  const { currentUser } = useAuth()
  const { currentStep, nextStep, prevStep, setStep, data, openAuthModal, triggerExport,
          resumeId, resumeName, isSaving, lastSaved,
          setResumeId, setIsSaving, setLastSaved } = useResumeStore()
  const [rightPanel,      setRightPanel]      = useState<RightPanel>('preview')
  const [showTransition,  setShowTransition]  = useState(false)
  const [pendingStep,     setPendingStep]      = useState<number>(2)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>()
  const resumeIdRef   = useRef(resumeId)
  const resumeNameRef = useRef(resumeName)
  const dataRef       = useRef(data)
  useEffect(() => { resumeIdRef.current   = resumeId  }, [resumeId])
  useEffect(() => { resumeNameRef.current = resumeName }, [resumeName])
  useEffect(() => { dataRef.current       = data       }, [data])

  // Auto-save to localStorage whenever data changes (3 s debounce)
  useEffect(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      setIsSaving(true)
      const id = saveResume(resumeIdRef.current, data, resumeNameRef.current || 'My Resume')
      if (!resumeIdRef.current) setResumeId(id)
      setLastSaved(Date.now())
      setIsSaving(false)
    }, 3000)
    return () => clearTimeout(saveTimer.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // Flush save immediately when leaving the builder so no data is lost
  useEffect(() => {
    return () => {
      clearTimeout(saveTimer.current)
      const id = saveResume(resumeIdRef.current, dataRef.current, resumeNameRef.current || 'My Resume')
      if (!resumeIdRef.current) resumeIdRef.current = id
    }
  }, [])

  function handleExport() {
    if (!currentUser) { openAuthModal(); return }
    setRightPanel('preview')
    triggerExport()
  }

  function handleContinue() {
    if (isLast) { handleExport(); return }
    setPendingStep(currentStep + 1)
    setShowTransition(true)
  }

  function handleTransitionDone() {
    setShowTransition(false)
    nextStep()
  }

  const StepComponent = STEP_COMPONENTS[currentStep - 1]
  const isLast        = currentStep === 6
  const progress      = ((currentStep - 1) / 5) * 100

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* ── Fixed Header ── */}
      <header className="flex items-center h-14 bg-white border-b border-gray-200 shrink-0 z-40">
        {/* Brand — fixed left */}
        <div className="flex items-center gap-2 px-4 shrink-0">
          <button
            onClick={() => currentStep > 1 ? prevStep() : navigate('/')}
            title={currentStep > 1 ? 'Go back one step' : 'Exit to home (progress auto-saved)'}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
          </button>
          <span className="font-h1 font-bold text-primary">ApplyAI</span>
          {/* Save status indicator */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full ml-1" style={{
            background: isSaving ? '#f0f4ff' : lastSaved ? '#f0fdf4' : '#f8fafc',
            border: `1px solid ${isSaving ? '#c7d7f7' : lastSaved ? '#bbf7d0' : '#e2e8f0'}`,
          }}>
            <span
              className={cn('material-symbols-outlined', isSaving && 'animate-spin')}
              style={{ fontSize: '11px', color: isSaving ? '#1a56db' : lastSaved ? '#16a34a' : '#94a3b8', fontVariationSettings: "'FILL' 1" }}
            >
              {isSaving ? 'progress_activity' : lastSaved ? 'cloud_done' : 'cloud_off'}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: isSaving ? '#1a56db' : lastSaved ? '#16a34a' : '#94a3b8' }}>
              {isSaving ? 'Saving…' : lastSaved ? 'Saved' : 'Local only'}
            </span>
          </div>
        </div>

        {/* Stepper — takes center space, never overlaps sides */}
        <div className="flex-1 flex justify-center overflow-hidden hidden md:flex">
          <StepperProgress />
        </div>

        {/* Actions — fixed right */}
        <div className="flex items-center gap-2 px-4 shrink-0">
          {/* Save Version */}
          {resumeId && (
            <button
              onClick={() => {
                setIsSaving(true)
                saveVersion(resumeId, data,
                  new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }))
                setIsSaving(false)
              }}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium text-on-surface-variant hover:text-primary hover:bg-primary/8 transition-all border border-gray-200"
              title="Save a named version you can restore later"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>bookmark_add</span>
              Save Version
            </button>
          )}
          {/* My Resumes */}
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium text-on-surface-variant hover:text-primary hover:bg-primary/8 transition-all border border-gray-200"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>folder_open</span>
            My Resumes
          </button>
          <span className="font-body-sm text-body-sm text-on-surface-variant hidden lg:block whitespace-nowrap">
            Step {currentStep} / 6
          </span>
          <Button size="sm" onClick={handleContinue}>
            {isLast ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>download</span>
                Export PDF
              </>
            ) : (
              <>
                Continue
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Progress bar */}
      <Progress value={progress} className="h-0.5 rounded-none" />

      {/* ── Main 3-panel layout ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: form editor */}
        <div className="w-[600px] shrink-0 flex flex-col border-r border-gray-200 bg-white">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <StepComponent />
          </div>

          {/* Step footer nav (mobile-friendly) */}
          <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 bg-white shrink-0">
            <div className="flex gap-1.5 items-center">
              {Array.from({ length: 6 }, (_, i) => {
                const sn = i + 1
                const visited = sn <= currentStep
                return (
                  <button
                    key={i}
                    onClick={() => visited && setStep(sn)}
                    disabled={!visited}
                    title={visited ? STEP_LABELS[i] : undefined}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      visited ? 'cursor-pointer hover:opacity-70' : 'cursor-default',
                      sn < currentStep  ? 'w-4 bg-secondary' :
                      sn === currentStep ? 'w-6 bg-primary' : 'w-4 bg-outline-variant'
                    )}
                  />
                )
              })}
            </div>
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <Button variant="ghost" size="sm" onClick={prevStep}>
                  Back
                </Button>
              )}
              <Button size="sm" onClick={handleContinue}>
                {isLast ? 'Export PDF' : 'Continue'}
                {!isLast && <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>}
              </Button>
            </div>
          </div>
        </div>

        {/* Step transition overlay */}
        {showTransition && (
          <StepTransitionScreen
            fromStep={currentStep}
            toStep={pendingStep}
            onContinue={handleTransitionDone}
          />
        )}

        {/* Right: preview + AI tools */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Panel switcher */}
          <div className="flex items-center gap-0 px-6 py-3 bg-white border-b border-gray-200 shrink-0">
            <button
              onClick={() => setRightPanel('preview')}
              className={cn(
                'flex items-center gap-2 px-4 py-1.5 rounded-lg font-body-sm text-body-sm font-medium transition-all',
                rightPanel === 'preview'
                  ? 'bg-primary text-white'
                  : 'text-on-surface-variant hover:bg-surface-container'
              )}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: rightPanel === 'preview' ? "'FILL' 1" : "'FILL' 0" }}>
                visibility
              </span>
              Live Preview
            </button>
            <button
              onClick={() => setRightPanel('ai')}
              className={cn(
                'flex items-center gap-2 px-4 py-1.5 rounded-lg font-body-sm text-body-sm font-medium transition-all ml-1',
                rightPanel === 'ai'
                  ? 'bg-primary text-white'
                  : 'text-on-surface-variant hover:bg-surface-container'
              )}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: rightPanel === 'ai' ? "'FILL' 1" : "'FILL' 0" }}>
                auto_awesome
              </span>
              AI Tools
            </button>

            {/* AI tools sub-hint */}
            {rightPanel === 'ai' && (
              <span className="ml-auto font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                JD Match · Cover Letter · Interview Prep
              </span>
            )}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            {rightPanel === 'preview' ? (
              <LivePreview />
            ) : (
              <div className="h-full overflow-y-auto custom-scrollbar">
                <AIToolsPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
