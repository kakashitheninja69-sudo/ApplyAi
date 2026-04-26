import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import StepperProgress from '@/components/builder/StepperProgress'
import LivePreview     from '@/components/builder/LivePreview'
import AIToolsPanel    from '@/components/ai-tools/AIToolsPanel'
import Step1Template   from '@/components/builder/steps/Step1Template'
import Step2Contact    from '@/components/builder/steps/Step2Contact'
import Step3Work       from '@/components/builder/steps/Step3Work'
import Step4Education  from '@/components/builder/steps/Step4Education'
import Step5Skills     from '@/components/builder/steps/Step5Skills'
import Step6Summary    from '@/components/builder/steps/Step6Summary'

const STEP_COMPONENTS = [
  Step1Template,
  Step2Contact,
  Step3Work,
  Step4Education,
  Step5Skills,
  Step6Summary,
]

const STEP_LABELS = [
  'Template',
  'Contact Info',
  'Work Experience',
  'Education',
  'Skills',
  'Professional Summary',
]

type RightPanel = 'preview' | 'ai'

export default function BuilderPage() {
  const navigate  = useNavigate()
  const { currentStep, nextStep, prevStep, data } = useResumeStore()
  const [rightPanel, setRightPanel] = useState<RightPanel>('preview')

  const StepComponent = STEP_COMPONENTS[currentStep - 1]
  const isLast        = currentStep === 6
  const progress      = ((currentStep - 1) / 5) * 100

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* ── Fixed Header ── */}
      <header className="flex items-center h-14 bg-white border-b border-gray-200 shrink-0 z-40">
        {/* Brand — fixed left */}
        <div className="flex items-center gap-3 px-4 shrink-0 w-[160px]">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
          </button>
          <span className="font-h1 font-bold text-primary">ApplyAI</span>
        </div>

        {/* Stepper — takes center space, never overlaps sides */}
        <div className="flex-1 flex justify-center overflow-hidden hidden md:flex">
          <StepperProgress />
        </div>

        {/* Actions — fixed right */}
        <div className="flex items-center gap-2 px-4 shrink-0">
          <span className="font-body-sm text-body-sm text-on-surface-variant hidden lg:block whitespace-nowrap">
            Step {currentStep} / 6
          </span>
          {currentStep > 1 && (
            <Button variant="outline" size="sm" onClick={prevStep}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_left</span>
              Back
            </Button>
          )}
          <Button size="sm" onClick={isLast ? undefined : nextStep}>
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
            <div className="flex gap-1.5">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i + 1 < currentStep  ? 'w-4 bg-secondary' :
                    i + 1 === currentStep ? 'w-6 bg-primary' : 'w-4 bg-outline-variant'
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <Button variant="ghost" size="sm" onClick={prevStep}>
                  Back
                </Button>
              )}
              <Button size="sm" onClick={isLast ? () => window.print() : nextStep}>
                {isLast ? 'Export PDF' : 'Continue'}
                {!isLast && <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>}
              </Button>
            </div>
          </div>
        </div>

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
