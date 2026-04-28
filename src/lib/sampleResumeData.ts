import type { ResumeData } from '@/types/resume'

export const SAMPLE_RESUME_DATA: ResumeData = {
  template: 'modern-sidebar',
  accentColor: 'primary',
  typography: 'corporate-sans',
  contact: {
    name: 'Alex Johnson',
    title: 'Senior Product Designer',
    email: 'alex@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexj',
    website: 'alexjohnson.io',
  },
  summary:
    'Strategic product designer with 8+ years crafting user-centred experiences for SaaS platforms. Proven track record of increasing conversion and engagement through data-informed design decisions and scalable design systems.',
  projects: [],
  work: [
    {
      id: '1',
      role: 'Senior Product Designer',
      company: 'Stripe',
      startDate: '2021-03',
      endDate: '',
      current: true,
      bullets: [
        'Led redesign of checkout flow, increasing conversion by 23%',
        'Built and maintained design system used by 120+ engineers globally',
        'Shipped 4 major product features reaching 2M+ active users',
      ],
    },
    {
      id: '2',
      role: 'UX Designer',
      company: 'Airbnb',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      bullets: [
        'Redesigned host onboarding, reducing drop-off by 40%',
        'Ran 50+ user research sessions across APAC markets',
        'Partnered with engineering to ship mobile design system v2',
      ],
    },
    {
      id: '3',
      role: 'Product Designer',
      company: 'Intercom',
      startDate: '2016-01',
      endDate: '2018-05',
      current: false,
      bullets: [
        'Designed core inbox and reporting features for 25k+ businesses',
        'Increased NPS by 18 points through redesigned onboarding',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'Stanford University',
      degree: 'B.S.',
      field: 'Computer Science',
      startDate: '2012-09',
      endDate: '2016-05',
      gpa: '3.8',
    },
  ],
  skills: [
    { id: '1', name: 'Figma',           category: 'tool' },
    { id: '2', name: 'React',            category: 'technical' },
    { id: '3', name: 'TypeScript',       category: 'technical' },
    { id: '4', name: 'User Research',    category: 'soft' },
    { id: '5', name: 'Design Systems',   category: 'technical' },
    { id: '6', name: 'Prototyping',      category: 'technical' },
    { id: '7', name: 'Spanish',          category: 'language' },
    { id: '8', name: 'Framer',           category: 'tool' },
    { id: '9', name: 'Data Analysis',    category: 'soft' },
    { id: '10', name: 'Leadership',      category: 'soft' },
  ],
}
