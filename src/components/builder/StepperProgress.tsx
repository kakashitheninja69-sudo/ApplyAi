import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'

const STEPS = [
  { n: 1, label: 'Contact',    icon: 'person' },
  { n: 2, label: 'Experience', icon: 'work' },
  { n: 3, label: 'Education',  icon: 'school' },
  { n: 4, label: 'Skills',     icon: 'psychology' },
  { n: 5, label: 'Projects',   icon: 'code' },
  { n: 6, label: 'Summary',    icon: 'auto_awesome' },
]

export default function StepperProgress() {
  const { currentStep, setStep } = useResumeStore()

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const done    = currentStep > step.n
        const active  = currentStep === step.n

        const clickable = done || active   // allow jumping to any visited step
        return (
          <div key={step.n} className="flex items-center">
            <button
              onClick={() => clickable && setStep(step.n)}
              disabled={!clickable}
              title={clickable ? `Go to ${step.label}` : undefined}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200',
                active  && 'bg-primary/10 text-primary',
                done    && 'text-secondary cursor-pointer hover:bg-surface-container',
                !done && !active && 'text-outline cursor-default'
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold transition-all',
                  active && 'bg-primary text-white',
                  done   && 'bg-secondary-container text-secondary',
                  !done && !active && 'bg-surface-container text-outline'
                )}
              >
                {done ? (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                ) : (
                  step.n
                )}
              </div>
              <span className="font-body-sm text-body-sm font-medium hidden sm:block">{step.label}</span>
            </button>

            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  'w-6 h-px mx-1 transition-colors',
                  currentStep > step.n ? 'bg-secondary' : 'bg-outline-variant'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
