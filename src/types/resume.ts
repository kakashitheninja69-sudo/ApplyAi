export type TemplateId =
  // FANG / ATS-Optimised (pinned top)
  | 'ats-clean'
  | 'google-standard'
  | 'amazon-results'
  | 'meta-impact'
  | 'faang-compact'
  // Classic / Original
  | 'modern-sidebar'
  | 'classic-professional'
  | 'minimal-clean'
  | 'executive'
  // Corporate / Professional
  | 'consulting-impact'
  | 'banking-formal'
  | 'academic-cv'
  | 'healthcare-pro'
  // Modern Layouts
  | 'split-modern'
  | 'timeline-classic'
  | 'bold-header'
  | 'two-column-grid'
  | 'compact-elite'
  | 'infographic-pro'
  // Creative / Industry
  | 'startup-modern'
  | 'creative-portfolio'
  | 'data-science'
  | 'product-manager'
  | 'dark-elegant'

export type AccentColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'slate'
  | 'violet'
  | 'pink'
  | 'orange'
  | 'teal'

export type TypographyStyle =
  | 'corporate-sans'   // Manrope — bold & modern
  | 'classic-serif'    // Newsreader — elegant serif
  | 'modern-rounded'   // DM Sans — friendly & clear
  | 'executive-serif'  // Lora — polished & senior

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

export interface Project {
  id: string
  name: string
  role: string
  url: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface ResumeData {
  template: TemplateId
  accentColor: AccentColor
  typography: TypographyStyle
  contact: ContactInfo
  work: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  summary: string
}
