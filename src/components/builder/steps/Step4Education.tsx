import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/store/resumeStore'
import type { Education } from '@/types/resume'

function EduCard({ entry }: { entry: Education }) {
  const { updateEducation, removeEducation, data } = useResumeStore()
  const canDelete = data.education.length > 1

  return (
    <div className="bg-white rounded-xl border border-outline-variant p-6 hover:border-primary/40 transition-colors">
      <div className="flex items-start gap-4">
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor={`inst-${entry.id}`}>Institution</Label>
            <Input
              id={`inst-${entry.id}`}
              placeholder="University of California, Berkeley"
              value={entry.institution}
              onChange={(e) => updateEducation(entry.id, { institution: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`deg-${entry.id}`}>Degree</Label>
            <Input
              id={`deg-${entry.id}`}
              placeholder="Bachelor of Science"
              value={entry.degree}
              onChange={(e) => updateEducation(entry.id, { degree: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`field-${entry.id}`}>Field of Study</Label>
            <Input
              id={`field-${entry.id}`}
              placeholder="Computer Science"
              value={entry.field}
              onChange={(e) => updateEducation(entry.id, { field: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`edu-start-${entry.id}`}>Start Year</Label>
            <Input
              id={`edu-start-${entry.id}`}
              type="month"
              value={entry.startDate}
              onChange={(e) => updateEducation(entry.id, { startDate: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`edu-end-${entry.id}`}>Graduation Year</Label>
            <Input
              id={`edu-end-${entry.id}`}
              type="month"
              value={entry.endDate}
              onChange={(e) => updateEducation(entry.id, { endDate: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`gpa-${entry.id}`}>
              GPA{' '}
              <span className="normal-case font-body-sm text-outline ml-1">(optional)</span>
            </Label>
            <Input
              id={`gpa-${entry.id}`}
              placeholder="3.8 / 4.0"
              value={entry.gpa}
              onChange={(e) => updateEducation(entry.id, { gpa: e.target.value })}
            />
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => removeEducation(entry.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-error hover:bg-error-container transition-colors shrink-0 mt-1"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default function Step4Education() {
  const { data, addEducation } = useResumeStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-h2 text-h2 mb-1">Education</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          List your highest qualification first. GPA is optional but recommended if above 3.5.
        </p>
      </div>

      {data.education.map((entry) => (
        <EduCard key={entry.id} entry={entry} />
      ))}

      <Button variant="outline" onClick={addEducation} className="w-full border-dashed">
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
        Add another qualification
      </Button>
    </div>
  )
}
