import { cn, ACCENT_COLORS } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import TemplateThumbnail from '@/components/resume-templates/TemplateThumbnail'
import type { TemplateId, AccentColor, TypographyStyle } from '@/types/resume'

const TEMPLATES: { id: TemplateId; label: string; subtitle: string }[] = [
  { id: 'modern-sidebar',       label: 'Modern Sidebar',      subtitle: 'Creative & Tech Roles'      },
  { id: 'classic-professional', label: 'Classic Professional', subtitle: 'Corporate & Finance'        },
  { id: 'minimal-clean',        label: 'Minimal Clean',        subtitle: 'Modern & High Readability'  },
  { id: 'executive',            label: 'Executive',            subtitle: 'Leadership & C-Suite'       },
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
                  'group text-left rounded-xl border-2 overflow-hidden transition-all duration-200 bg-white',
                  selected
                    ? 'border-primary shadow-lg shadow-primary/15'
                    : 'border-outline-variant hover:border-primary/50 hover:shadow-md'
                )}
              >
                {/* Live rendered thumbnail */}
                <div className="relative overflow-hidden bg-gray-50">
                  <TemplateThumbnail templateId={t.id} accentColor={data.accentColor} />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />

                  {/* Selected checkmark */}
                  {selected && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md">
                      <span
                        className="material-symbols-outlined text-white"
                        style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
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

      {/* Accent Colour */}
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
