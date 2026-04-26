import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ResumeData, WorkExperience, Education, Skill, TemplateId, AccentColor, TypographyStyle } from '@/types/resume'
import { generateId } from '@/lib/utils'

interface ResumeStore {
  currentStep: number
  isAuthModalOpen: boolean
  data: ResumeData
  // navigation
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  // auth
  openAuthModal: () => void
  closeAuthModal: () => void
  // template
  setTemplate: (t: TemplateId) => void
  setAccentColor: (c: AccentColor) => void
  setTypography: (t: TypographyStyle) => void
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
  summary: '',
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      isAuthModalOpen: false,
      data: DEFAULT_DATA,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 6) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      setTemplate:    (template)   => set((s) => ({ data: { ...s.data, template } })),
      setAccentColor: (accentColor)=> set((s) => ({ data: { ...s.data, accentColor } })),
      setTypography:  (typography) => set((s) => ({ data: { ...s.data, typography } })),

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

      addSkill: (name, category = 'technical') =>
        set((s) => ({ data: { ...s.data, skills: [...s.data.skills, { id: generateId(), name, category }] } })),
      removeSkill: (id) =>
        set((s) => ({ data: { ...s.data, skills: s.data.skills.filter((sk) => sk.id !== id) } })),

      setSummary: (summary) => set((s) => ({ data: { ...s.data, summary } })),
    }),
    {
      name: 'applyai-resume',
      partialize: (state) => ({ data: state.data, currentStep: state.currentStep }),
    }
  )
)
