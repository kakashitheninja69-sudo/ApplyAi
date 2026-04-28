import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'
import { generateBulletPoints } from '@/lib/ai'
import type { Project } from '@/types/resume'

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
        placeholder="Built a real-time dashboard used by 500+ users, reducing support tickets by 40%…"
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

function ProjectCard({ entry }: { entry: Project }) {
  const { updateProject, removeProject, addProjectBullet, updateProjectBullet, removeProjectBullet, replaceProjectBullets, data, spendCredit } =
    useResumeStore()
  const [aiLoading, setAiLoading] = useState(false)
  const canDelete = (data.projects ?? []).length > 1

  async function handleAIBullets() {
    if (!entry.name) return
    if (!spendCredit()) return
    setAiLoading(true)
    try {
      const bullets = await generateBulletPoints(entry.role || 'Developer', entry.name)
      replaceProjectBullets(entry.id, bullets)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant p-6 space-y-5 hover:border-primary/40 transition-colors">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div className="space-y-1.5 col-span-2">
            <Label htmlFor={`proj-name-${entry.id}`}>Project Name</Label>
            <Input
              id={`proj-name-${entry.id}`}
              placeholder="Open Source Dashboard, E-Commerce App…"
              value={entry.name}
              onChange={(e) => updateProject(entry.id, { name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`proj-role-${entry.id}`}>Your Role</Label>
            <Input
              id={`proj-role-${entry.id}`}
              placeholder="Lead Developer, Designer…"
              value={entry.role}
              onChange={(e) => updateProject(entry.id, { role: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`proj-url-${entry.id}`}>URL (optional)</Label>
            <Input
              id={`proj-url-${entry.id}`}
              placeholder="github.com/you/project"
              value={entry.url}
              onChange={(e) => updateProject(entry.id, { url: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`proj-start-${entry.id}`}>Start Date</Label>
            <Input
              id={`proj-start-${entry.id}`}
              type="month"
              value={entry.startDate}
              onChange={(e) => updateProject(entry.id, { startDate: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`proj-end-${entry.id}`}>End Date</Label>
            <Input
              id={`proj-end-${entry.id}`}
              type="month"
              value={entry.endDate}
              onChange={(e) => updateProject(entry.id, { endDate: e.target.value })}
              disabled={entry.current}
              placeholder={entry.current ? 'Present' : ''}
            />
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={entry.current}
                onChange={(e) => updateProject(entry.id, { current: e.target.checked })}
                className="rounded border-outline-variant accent-primary"
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant">In progress</span>
            </label>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => removeProject(entry.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-error hover:bg-error-container transition-colors shrink-0 mt-1"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
          </button>
        )}
      </div>

      {/* Bullet Points */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>What you built / achieved</Label>
          <button
            onClick={handleAIBullets}
            disabled={aiLoading || !entry.name}
            title={!entry.name ? 'Enter a project name first' : ''}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-lg font-body-sm text-body-sm font-semibold transition-all duration-200',
              aiLoading || !entry.name
                ? 'bg-surface-container text-outline cursor-not-allowed'
                : 'ai-sparkle-button text-white'
            )}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>
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
              onChange={(v) => updateProjectBullet(entry.id, idx, v)}
              onRemove={() => removeProjectBullet(entry.id, idx)}
              canRemove={entry.bullets.length > 1}
            />
          ))}
        </div>

        <Button variant="ghost" size="sm" onClick={() => addProjectBullet(entry.id)} className="text-primary hover:bg-primary/5">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
          Add bullet point
        </Button>
      </div>
    </div>
  )
}

export default function Step5Projects() {
  const { data, addProject } = useResumeStore()
  const projects = data.projects ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-h2 text-h2 mb-1">Projects</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Side projects, open-source work, hackathons, or portfolio pieces that show what you can build.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl border-2 border-dashed border-outline-variant text-center">
          <div className="w-14 h-14 rounded-full bg-primary/8 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>
              code
            </span>
          </div>
          <p className="font-body-md font-semibold text-on-background mb-1">No projects yet</p>
          <p className="font-body-sm text-on-surface-variant mb-4 max-w-xs">
            Projects are optional but can make a huge difference for recent grads or career changers.
          </p>
          <Button onClick={addProject} className="gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
            Add your first project
          </Button>
        </div>
      ) : (
        <>
          {projects.map((entry) => (
            <ProjectCard key={entry.id} entry={entry} />
          ))}
          <Button variant="outline" onClick={addProject} className="w-full border-dashed">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
            Add another project
          </Button>
        </>
      )}
    </div>
  )
}
