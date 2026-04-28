import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ResumeData, WorkExperience, Education, Skill, Project, TemplateId, AccentColor, TypographyStyle } from '@/types/resume'
import { generateId } from '@/lib/utils'

const FREE_CREDITS = 3

interface ResumeStore {
  currentStep: number
  isAuthModalOpen: boolean
  isUpgradeModalOpen: boolean
  credits: number
  data: ResumeData
  // navigation
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  // auth
  openAuthModal: () => void
  closeAuthModal: () => void
  // credits
  spendCredit: () => boolean          // true = credit spent; false = no credits, upgrade modal opened
  openUpgradeModal: () => void
  closeUpgradeModal: () => void
  // template
  setTemplate: (t: TemplateId) => void
  setAccentColor: (c: AccentColor) => void
  setTypography: (t: TypographyStyle) => void
  resetBuilder: (template: TemplateId, accentColor: AccentColor) => void
  // contact
  updateContact: (patch: Partial<ResumeData['contact']>) => void
  // work
  addWork: () => void
  updateWork: (id: string, patch: Partial<WorkExperience>) => void
  removeWork: (id: string) => void
  addBullet: (workId: string) => void
  updateBullet: (workId: string, index: number, value: string) => void
  removeBullet: (workId: string, index: number) => void
  replaceBullets: (workId: string, bullets: string[]) => void
  // education
  addEducation: () => void
  updateEducation: (id: string, patch: Partial<Education>) => void
  removeEducation: (id: string) => void
  // skills
  addSkill: (name: string, category?: Skill['category']) => void
  removeSkill: (id: string) => void
  // projects
  addProject: () => void
  updateProject: (id: string, patch: Partial<Project>) => void
  removeProject: (id: string) => void
  addProjectBullet: (projectId: string) => void
  updateProjectBullet: (projectId: string, index: number, value: string) => void
  removeProjectBullet: (projectId: string, index: number) => void
  replaceProjectBullets: (projectId: string, bullets: string[]) => void
  // summary
  setSummary: (s: string) => void
}

const DEFAULT_DATA: ResumeData = {
  template: 'modern-sidebar',
  accentColor: 'primary',
  typography: 'corporate-sans',
  contact: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '' },
  work: [{ id: generateId(), company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''] }],
  education: [{ id: generateId(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }],
  skills: [],
  projects: [],
  summary: '',
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      isAuthModalOpen: false,
      isUpgradeModalOpen: false,
      credits: FREE_CREDITS,
      data: DEFAULT_DATA,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 6) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

      openAuthModal:    () => set({ isAuthModalOpen: true }),
      closeAuthModal:   () => set({ isAuthModalOpen: false }),
      openUpgradeModal: () => set({ isUpgradeModalOpen: true }),
      closeUpgradeModal:() => set({ isUpgradeModalOpen: false }),

      spendCredit: () => {
        const { credits } = get()
        if (credits <= 0) {
          set({ isUpgradeModalOpen: true })
          return false
        }
        set({ credits: credits - 1 })
        return true
      },

      setTemplate:    (template)    => set((s) => ({ data: { ...s.data, template } })),
      setAccentColor: (accentColor) => set((s) => ({ data: { ...s.data, accentColor } })),
      setTypography:  (typography)  => set((s) => ({ data: { ...s.data, typography } })),
      resetBuilder: (template, accentColor) => set({
        currentStep: 1,
        data: { ...DEFAULT_DATA, template, accentColor },
      }),

      updateContact: (patch) =>
        set((s) => ({ data: { ...s.data, contact: { ...s.data.contact, ...patch } } })),

      addWork: () =>
        set((s) => ({
          data: {
            ...s.data,
            work: [...s.data.work, { id: generateId(), company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''] }],
          },
        })),
      updateWork: (id, patch) =>
        set((s) => ({ data: { ...s.data, work: s.data.work.map((w) => w.id === id ? { ...w, ...patch } : w) } })),
      removeWork: (id) =>
        set((s) => ({ data: { ...s.data, work: s.data.work.filter((w) => w.id !== id) } })),
      addBullet: (workId) =>
        set((s) => ({
          data: { ...s.data, work: s.data.work.map((w) => w.id === workId ? { ...w, bullets: [...w.bullets, ''] } : w) },
        })),
      updateBullet: (workId, index, value) =>
        set((s) => ({
          data: {
            ...s.data,
            work: s.data.work.map((w) => {
              if (w.id !== workId) return w
              const bullets = [...w.bullets]
              bullets[index] = value
              return { ...w, bullets }
            }),
          },
        })),
      removeBullet: (workId, index) =>
        set((s) => ({
          data: {
            ...s.data,
            work: s.data.work.map((w) =>
              w.id !== workId ? w : { ...w, bullets: w.bullets.filter((_, i) => i !== index) }
            ),
          },
        })),
      replaceBullets: (workId, bullets) =>
        set((s) => ({
          data: { ...s.data, work: s.data.work.map((w) => w.id === workId ? { ...w, bullets } : w) },
        })),

      addEducation: () =>
        set((s) => ({
          data: {
            ...s.data,
            education: [...s.data.education, { id: generateId(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }],
          },
        })),
      updateEducation: (id, patch) =>
        set((s) => ({ data: { ...s.data, education: s.data.education.map((e) => e.id === id ? { ...e, ...patch } : e) } })),
      removeEducation: (id) =>
        set((s) => ({ data: { ...s.data, education: s.data.education.filter((e) => e.id !== id) } })),

      addProject: () =>
        set((s) => ({
          data: {
            ...s.data,
            projects: [...s.data.projects, { id: generateId(), name: '', role: '', url: '', startDate: '', endDate: '', current: false, bullets: [''] }],
          },
        })),
      updateProject: (id, patch) =>
        set((s) => ({ data: { ...s.data, projects: s.data.projects.map((p) => p.id === id ? { ...p, ...patch } : p) } })),
      removeProject: (id) =>
        set((s) => ({ data: { ...s.data, projects: s.data.projects.filter((p) => p.id !== id) } })),
      addProjectBullet: (projectId) =>
        set((s) => ({
          data: { ...s.data, projects: s.data.projects.map((p) => p.id === projectId ? { ...p, bullets: [...p.bullets, ''] } : p) },
        })),
      updateProjectBullet: (projectId, index, value) =>
        set((s) => ({
          data: {
            ...s.data,
            projects: s.data.projects.map((p) => {
              if (p.id !== projectId) return p
              const bullets = [...p.bullets]
              bullets[index] = value
              return { ...p, bullets }
            }),
          },
        })),
      removeProjectBullet: (projectId, index) =>
        set((s) => ({
          data: {
            ...s.data,
            projects: s.data.projects.map((p) =>
              p.id !== projectId ? p : { ...p, bullets: p.bullets.filter((_, i) => i !== index) }
            ),
          },
        })),
      replaceProjectBullets: (projectId, bullets) =>
        set((s) => ({
          data: { ...s.data, projects: s.data.projects.map((p) => p.id === projectId ? { ...p, bullets } : p) },
        })),

      addSkill: (name, category = 'technical') =>
        set((s) => ({ data: { ...s.data, skills: [...s.data.skills, { id: generateId(), name, category }] } })),
      removeSkill: (id) =>
        set((s) => ({ data: { ...s.data, skills: s.data.skills.filter((sk) => sk.id !== id) } })),

      setSummary: (summary) => set((s) => ({ data: { ...s.data, summary } })),
    }),
    {
      name: 'applyai-resume',
      partialize: (state) => ({ data: state.data, currentStep: state.currentStep, credits: state.credits }),
      merge: (persisted: any, current) => ({
        ...current,
        ...persisted,
        data: { ...current.data, ...(persisted?.data ?? {}) },
      }),
    }
  )
)
