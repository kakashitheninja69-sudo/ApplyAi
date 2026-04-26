import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'

interface FieldDef {
  key: keyof import('@/types/resume').ContactInfo
  label: string
  placeholder: string
  type?: string
  icon: string
  half?: boolean
}

const FIELDS: FieldDef[] = [
  { key: 'name',     label: 'Full Name',           placeholder: 'Alex Johnson',              icon: 'badge',           half: false },
  { key: 'title',    label: 'Professional Title',  placeholder: 'Senior Product Designer',   icon: 'work_history',    half: false },
  { key: 'email',    label: 'Email',               placeholder: 'alex@example.com',          icon: 'alternate_email', type: 'email', half: true },
  { key: 'phone',    label: 'Phone',               placeholder: '+1 (555) 000-0000',         icon: 'call',            type: 'tel',   half: true },
  { key: 'location', label: 'Location',            placeholder: 'San Francisco, CA',         icon: 'location_on',     half: true },
  { key: 'linkedin', label: 'LinkedIn URL',        placeholder: 'linkedin.com/in/alexj',     icon: 'link',            half: true },
  { key: 'website',  label: 'Portfolio / Website', placeholder: 'alexjohnson.dev',           icon: 'public',          half: true },
]

export default function Step2Contact() {
  const { data, updateContact } = useResumeStore()
  const contact = data.contact

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-h2 text-h2 mb-1">Your contact information</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          This appears at the top of your resume. Keep it professional and up to date.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {FIELDS.map((f) => (
          <div
            key={f.key}
            className={f.half ? 'col-span-1' : 'col-span-2'}
          >
            <div className="space-y-1.5">
              <Label htmlFor={`contact-${f.key}`}>{f.label}</Label>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                  style={{ fontSize: '18px' }}
                >
                  {f.icon}
                </span>
                <Input
                  id={`contact-${f.key}`}
                  type={f.type ?? 'text'}
                  placeholder={f.placeholder}
                  value={contact[f.key]}
                  onChange={(e) => updateContact({ [f.key]: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live summary card */}
      {contact.name && (
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant flex items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>
              person
            </span>
          </div>
          <div>
            <p className="font-h2 text-body-lg font-bold text-on-background">{contact.name}</p>
            {contact.title && <p className="font-body-sm text-on-surface-variant">{contact.title}</p>}
            <p className="font-body-sm text-outline mt-0.5">
              {[contact.email, contact.location].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
