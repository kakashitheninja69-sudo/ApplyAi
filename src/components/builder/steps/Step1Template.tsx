import { cn, ACCENT_COLORS } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import type { TemplateId, AccentColor, TypographyStyle } from '@/types/resume'

const TEMPLATES: { id: TemplateId; label: string; subtitle: string; preview: React.ReactNode }[] = [
  {
    id: 'modern-sidebar',
    label: 'Modern Sidebar',
    subtitle: 'Creative & Tech Roles',
    preview: (
      <div className="w-full h-full bg-white flex rounded-sm overflow-hidden">
        <div className="w-1/3 bg-slate-100 p-3 space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-300 mx-auto" />
          <div className="h-1.5 w-full bg-slate-200 rounded" />
          <div className="h-1.5 w-3/4 bg-slate-200 rounded" />
          <div className="pt-4 space-y-1.5">
            <div className="h-1 w-full bg-slate-200 rounded" />
            <div className="h-1 w-full bg-slate-200 rounded" />
            <div className="h-1 w-4/5 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="w-2/3 p-4 space-y-3">
          <div className="h-3 w-1/2 bg-blue-100 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
          <div className="pt-2 h-2 w-1/3 bg-slate-200 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'classic-professional',
    label: 'Classic Professional',
    subtitle: 'Corporate & Finance',
    preview: (
      <div className="w-full h-full bg-white p-5 space-y-4 rounded-sm">
        <div className="text-center space-y-1.5 pb-3 border-b border-slate-200">
          <div className="h-3 w-1/3 bg-blue-200 mx-auto rounded" />
          <div className="h-1.5 w-1/4 bg-slate-200 mx-auto rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-1/4 bg-slate-300 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-2/3 bg-slate-100 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-1/4 bg-slate-300 rounded" />
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'minimal-clean',
    label: 'Minimal Clean',
    subtitle: 'Modern & High Readability',
    preview: (
      <div className="w-full h-full bg-white p-5 space-y-4 rounded-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="h-4 w-2/5 bg-slate-400 rounded" />
          <div className="h-1.5 w-1/5 bg-slate-200 rounded" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-1/4 border-r border-slate-200 pr-3 shrink-0">
              <div className="h-1.5 w-full bg-slate-300 rounded" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="h-1.5 w-full bg-slate-100 rounded" />
              <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'executive',
    label: 'Executive',
    subtitle: 'Leadership & C-Suite',
    preview: (
      <div className="w-full h-full bg-white rounded-sm overflow-hidden">
        <div className="h-3 bg-blue-600 w-full" />
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1.5">
              <div className="h-4 w-36 bg-slate-800 rounded" />
              <div className="h-1.5 w-24 bg-slate-400 rounded" />
            </div>
            <div className="h-6 w-6 bg-slate-200 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-2 w-1/2 bg-slate-300 rounded" />
                <div className="h-1.5 w-full bg-slate-100 rounded" />
                <div className="h-1.5 w-full bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
]

const TYPOGRAPHY: { id: TypographyStyle; label: string; sample: string; font: string }[] = [
  { id: 'corporate-sans', label: 'Corporate Sans', sample: 'Aa', font: 'font-h1' },
  { id: 'classic-serif',  label: 'Classic Serif',  sample: 'Aa', font: 'font-template-h1' },
]

export default function Step1Template() {
  const { data, setTemplate, setAccentColor, setTypography } = useResumeStore()

  return (
    <div className="space-y-10">
      {/* Template Grid */}
      <div>
        <h2 className="font-h2 text-h2 mb-1">Choose your foundation</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          ATS-optimised layouts designed by career experts. Change any time.
        </p>
        <div className="grid grid-cols-2 gap-5">
          {TEMPLATES.map((t) => {
            const selected = data.template === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={cn(
                  'group text-left rounded-xl border-2 overflow-hidden transition-all duration-200',
                  selected
                    ? 'border-primary shadow-md shadow-primary/10'
                    : 'border-outline-variant hover:border-primary/50'
                )}
              >
                {/* Preview thumbnail */}
                <div className="aspect-[3/4] bg-gray-50 p-4 relative overflow-hidden">
                  <div className="w-full h-full group-hover:scale-[1.02] transition-transform duration-400 paper-shadow">
                    {t.preview}
                  </div>
                  {selected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-white"
                        style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-4 py-3 bg-white border-t border-gray-100">
                  <p className="font-body-sm font-bold text-on-background">{t.label}</p>
                  <p className="font-body-sm text-outline text-[12px]">{t.subtitle}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <p className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest mb-4">
          Accent Colour
        </p>
        <div className="flex flex-wrap gap-3">
          {(Object.entries(ACCENT_COLORS) as [AccentColor, { hex: string; label: string }][]).map(
            ([key, { hex, label }]) => (
              <button
                key={key}
                title={label}
                onClick={() => setAccentColor(key)}
                className={cn(
                  'w-9 h-9 rounded-full transition-all duration-200 hover:scale-110',
                  data.accentColor === key && 'ring-2 ring-offset-2 ring-primary scale-110'
                )}
                style={{ backgroundColor: hex }}
              />
            )
          )}
        </div>
      </div>

      {/* Typography */}
      <div>
        <p className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest mb-4">
          Typography Style
        </p>
        <div className="flex gap-3">
          {TYPOGRAPHY.map((t) => (
            <button
              key={t.id}
              onClick={() => setTypography(t.id)}
              className={cn(
                'flex-1 flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200',
                data.typography === t.id
                  ? 'border-primary bg-primary/5'
                  : 'border-outline-variant hover:border-primary/50 bg-white'
              )}
            >
              <div className="text-left">
                <p className={cn('text-lg font-semibold', t.font)}>{t.sample}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{t.label}</p>
              </div>
              {data.typography === t.id && (
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
