export type TemplateId = 'modern-sidebar' | 'classic-professional' | 'minimal-clean' | 'executive'

export type AccentColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'slate'
  | 'violet'
  | 'pink'
  | 'orange'
  | 'teal'

export type TypographyStyle = 'corporate-sans' | 'classic-serif'

export interface ContactInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
}

export interface WorkExperience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa: string
}

export interface Skill {
  id: string
  name: string
  category: 'technical' | 'soft' | 'language' | 'tool'
}

export interface ResumeData {
  template: TemplateId
  accentColor: AccentColor
  typography: TypographyStyle
  contact: ContactInfo
  work: WorkExperience[]
  education: Education[]
  skills: Skill[]
  summary: string
}
