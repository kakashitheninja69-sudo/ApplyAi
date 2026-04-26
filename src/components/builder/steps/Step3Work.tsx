import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import { generateBulletPoints } from '@/lib/ai'
import type { WorkExperience } from '@/types/resume'

function BulletRow({
  value,
  onChange,
  onRemove,
  canRemove,
}: {
  value: string
  onChange: (v: string) => void
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <div className="flex items-start gap-2 group">
      <span className="material-symbols-outlined text-outline mt-2.5 shrink-0" style={{ fontSize: '16px' }}>
        drag_indicator
      </span>
      <Input
        placeholder="Led a cross-functional team, increasing output by 35%…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      {canRemove && (
        <button
          onClick={onRemove}
          className="mt-2 w-7 h-7 rounded flex items-center justify-center text-outline hover:text-error hover:bg-error-container transition-colors opacity-0 group-hover:opacity-100"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
        </button>
      )}
    </div>
  )
}

function WorkCard({ entry }: { entry: WorkExperience }) {
  const { updateWork, removeWork, addBullet, updateBullet, removeBullet, replaceBullets, data, spendCredit } =
    useResumeStore()
  const [aiLoading, setAiLoading] = useState(false)
  const canDelete = data.work.length > 1

  async function handleAIBullets() {
    if (!spendCredit()) return
    setAiLoading(true)
    try {
      const bullets = await generateBulletPoints(entry.role, entry.company)
      replaceBullets(entry.id, bullets)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant p-6 space-y-5 hover:border-primary/40 transition-colors">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div className="space-y-1.5">
            <Label htmlFor={`role-${entry.id}`}>Job Title</Label>
            <Input
              id={`role-${entry.id}`}
              placeholder="Product Manager"
              value={entry.role}
              onChange={(e) => updateWork(entry.id, { role: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`company-${entry.id}`}>Company</Label>
            <Input
              id={`company-${entry.id}`}
              placeholder="Acme Corp"
              value={entry.company}
              onChange={(e) => updateWork(entry.id, { company: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`start-${entry.id}`}>Start Date</Label>
            <Input
              id={`start-${entry.id}`}
              type="month"
              value={entry.startDate}
              onChange={(e) => updateWork(entry.id, { startDate: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`end-${entry.id}`}>End Date</Label>
            <Input
              id={`end-${entry.id}`}
              type="month"
              value={entry.endDate}
              onChange={(e) => updateWork(entry.id, { endDate: e.target.value })}
              disabled={entry.current}
              placeholder={entry.current ? 'Present' : ''}
            />
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={entry.current}
                onChange={(e) => updateWork(entry.id, { current: e.target.checked })}
                className="rounded border-outline-variant accent-primary"
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant">Currently here</span>
            </label>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => removeWork(entry.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-error hover:bg-error-container transition-colors shrink-0 mt-1"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
          </button>
        )}
      </div>

      {/* Bullet Points */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Key Achievements / Responsibilities</Label>
          <button
            onClick={handleAIBullets}
            disabled={aiLoading}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-lg font-body-sm text-body-sm font-semibold transition-all duration-200',
              aiLoading
                ? 'bg-surface-container text-outline cursor-wait'
                : 'ai-sparkle-button text-white'
            )}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
            >
              {aiLoading ? 'hourglass_empty' : 'auto_awesome'}
            </span>
            {aiLoading ? 'Generating…' : 'AI Enhance'}
          </button>
        </div>

        <div className="space-y-2.5">
          {entry.bullets.map((bullet, idx) => (
            <BulletRow
              key={idx}
              value={bullet}
              onChange={(v) => updateBullet(entry.id, idx, v)}
              onRemove={() => removeBullet(entry.id, idx)}
              canRemove={entry.bullets.length > 1}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => addBullet(entry.id)}
          className="text-primary hover:bg-primary/5"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
          Add bullet point
        </Button>
      </div>
    </div>
  )
}

export default function Step3Work() {
  const { data, addWork } = useResumeStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-h2 text-h2 mb-1">Work experience</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Start with your most recent role. Use the AI Enhance button to transform duties into achievements.
        </p>
      </div>

      {data.work.map((entry) => (
        <WorkCard key={entry.id} entry={entry} />
      ))}

      <Button variant="outline" onClick={addWork} className="w-full border-dashed">
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
        Add another position
      </Button>
    </div>
  )
}
