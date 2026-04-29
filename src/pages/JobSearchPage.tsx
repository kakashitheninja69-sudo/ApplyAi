import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/lib/firebase'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Job {
  id: string
  title: string
  company: string
  initial: string
  logoColor: string
  location: string
  remote: boolean
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  salary: string
  posted: string
  matchScore: number
  description: string
  skills: string[]
  saved: boolean
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const ALL_JOBS: Job[] = [
  {
    id: '1', title: 'Senior Software Engineer', company: 'Google',
    initial: 'G', logoColor: '#4285f4', location: 'Mountain View, CA',
    remote: true, type: 'Full-time', salary: '$180k – $240k', posted: '2d ago',
    matchScore: 92, saved: false,
    description: 'Join our infrastructure team to build highly scalable distributed systems that power Google services worldwide.',
    skills: ['Go', 'Kubernetes', 'gRPC'],
  },
  {
    id: '2', title: 'Product Manager, Growth', company: 'Stripe',
    initial: 'S', logoColor: '#635bff', location: 'San Francisco, CA',
    remote: false, type: 'Full-time', salary: '$160k – $210k', posted: '1d ago',
    matchScore: 87, saved: true,
    description: 'Lead growth initiatives for Stripe\'s core payments product across enterprise and SMB segments.',
    skills: ['Product Strategy', 'SQL', 'A/B Testing'],
  },
  {
    id: '3', title: 'Senior UX Designer', company: 'Airbnb',
    initial: 'A', logoColor: '#ff5a5f', location: 'New York, NY',
    remote: true, type: 'Full-time', salary: '$140k – $190k', posted: '3d ago',
    matchScore: 81, saved: false,
    description: 'Shape the future of travel by designing delightful experiences for millions of guests and hosts worldwide.',
    skills: ['Figma', 'Design Systems', 'User Research'],
  },
  {
    id: '4', title: 'Staff Engineer, Platform', company: 'Meta',
    initial: 'M', logoColor: '#0082fb', location: 'Menlo Park, CA',
    remote: false, type: 'Full-time', salary: '$220k – $300k', posted: '5h ago',
    matchScore: 78, saved: false,
    description: 'Build the next generation of developer platforms used by billions of people every day.',
    skills: ['C++', 'Distributed Systems', 'Python'],
  },
  {
    id: '5', title: 'Data Scientist', company: 'Netflix',
    initial: 'N', logoColor: '#e50914', location: 'Los Gatos, CA',
    remote: true, type: 'Full-time', salary: '$150k – $200k', posted: '1d ago',
    matchScore: 85, saved: true,
    description: 'Use data to personalise content recommendations for 260M+ subscribers and optimise our streaming platform.',
    skills: ['Python', 'ML', 'Spark', 'SQL'],
  },
  {
    id: '6', title: 'Frontend Engineer', company: 'Figma',
    initial: 'F', logoColor: '#f24e1e', location: 'Remote',
    remote: true, type: 'Full-time', salary: '$130k – $175k', posted: '2d ago',
    matchScore: 90, saved: false,
    description: 'Work on the design tool used by over 4 million designers. Ship features that make creativity faster.',
    skills: ['React', 'TypeScript', 'WebGL'],
  },
  {
    id: '7', title: 'DevOps Engineer', company: 'Shopify',
    initial: 'S', logoColor: '#96bf48', location: 'Toronto, Canada',
    remote: true, type: 'Contract', salary: '$110k – $150k', posted: '4d ago',
    matchScore: 74, saved: false,
    description: 'Support Shopify\'s global commerce infrastructure serving millions of merchants worldwide.',
    skills: ['Terraform', 'AWS', 'Docker'],
  },
  {
    id: '8', title: 'Engineering Manager', company: 'Notion',
    initial: 'N', logoColor: '#000000', location: 'San Francisco, CA',
    remote: false, type: 'Full-time', salary: '$200k – $260k', posted: '6h ago',
    matchScore: 69, saved: false,
    description: 'Lead a team of 6–8 engineers building Notion\'s collaborative editing engine.',
    skills: ['Leadership', 'TypeScript', 'System Design'],
  },
]

const JOB_TYPES = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship']
const DISTANCES = ['Any distance', '< 10 mi', '< 25 mi', '< 50 mi', '< 100 mi']
const TIME_POSTED = ['Any time', 'Past 24h', 'Past week', 'Past month']

// ── Sub-components ─────────────────────────────────────────────────────────────

function JobTopNav() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-outline-variant h-16 flex items-center px-6 gap-4">
      {/* Back + Logo */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/8 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
        </button>
        <button onClick={() => navigate('/')} className="text-[18px] font-bold text-primary tracking-tight font-h1">
          ApplyAI
        </button>
      </div>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-1 ml-4">
        {[
          { label: 'Find Jobs', active: true },
          { label: 'Applications', active: false },
          { label: 'Resumes', active: false },
          { label: 'Interviews', active: false },
        ].map(({ label, active }) => (
          <button
            key={label}
            onClick={() => label === 'Resumes' ? navigate('/dashboard') : undefined}
            className={cn(
              'relative px-3 py-1.5 rounded-lg font-body-sm font-medium transition-all duration-200',
              active
                ? 'text-primary bg-primary/8'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            )}
          >
            {label}
            {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />}
          </button>
        ))}
      </nav>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search pill */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant w-56">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>search</span>
          <span className="font-body-sm text-on-surface-variant text-[13px]">Search jobs…</span>
        </div>

        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors relative">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>

        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>settings</span>
        </button>

        {currentUser ? (
          <button
            onClick={() => signOut()}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[13px] hover:opacity-90 transition-opacity"
          >
            {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
          </button>
        ) : (
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[13px]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
          </button>
        )}
      </div>
    </header>
  )
}

function JobSidebar() {
  const navigate = useNavigate()

  const navItems = [
    { icon: 'dashboard',   label: 'Dashboard',   path: '/dashboard' },
    { icon: 'work_history', label: 'Job Search',  path: '/jobs', active: true },
    { icon: 'description', label: 'My Resumes',   path: '/dashboard' },
    { icon: 'fact_check',  label: 'Tracker',      path: null },
    { icon: 'mail',        label: 'Messages',     path: null },
  ]

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-outline-variant z-30 py-6">
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(item => (
          <button
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body-sm font-medium transition-all duration-150 group',
              item.active
                ? 'bg-primary/10 text-primary border-r-2 border-primary'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:translate-x-0.5'
            )}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '20px', fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Boost card */}
      <div className="mx-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
            rocket_launch
          </span>
        </div>
        <p className="font-body-sm font-bold text-on-background text-[13px] mb-1">Boost Visibility</p>
        <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed">
          Tailor your resume for each role and land more interviews.
        </p>
        <button
          onClick={() => navigate('/builder')}
          className="w-full py-2 rounded-lg text-[12px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)' }}
        >
          Personalise Resume
        </button>
      </div>
    </aside>
  )
}

interface SearchPanelProps {
  keyword: string
  location: string
  jobType: string
  distance: string
  timePosted: string
  onKeyword: (v: string) => void
  onLocation: (v: string) => void
  onJobType: (v: string) => void
  onDistance: (v: string) => void
  onTimePosted: (v: string) => void
  onSearch: () => void
  locating: boolean
  onGeolocate: () => void
}

function SearchPanel({
  keyword, location, jobType, distance, timePosted,
  onKeyword, onLocation, onJobType, onDistance, onTimePosted,
  onSearch, locating, onGeolocate,
}: SearchPanelProps) {
  return (
    <div className="bg-white rounded-3xl border border-outline-variant shadow-sm p-6 mb-6">
      {/* Inputs row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Job title */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border border-outline-variant bg-surface-container-low focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
          <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '20px' }}>work</span>
          <input
            value={keyword}
            onChange={e => onKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
            placeholder="Job title, skills, or company"
            className="flex-1 bg-transparent outline-none font-body-sm text-on-background placeholder:text-on-surface-variant text-[14px]"
          />
        </div>

        {/* Location */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border border-outline-variant bg-surface-container-low focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
          <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '20px' }}>location_on</span>
          <input
            value={location}
            onChange={e => onLocation(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
            placeholder="City, state, or remote"
            className="flex-1 bg-transparent outline-none font-body-sm text-on-background placeholder:text-on-surface-variant text-[14px]"
          />
          <button
            onClick={onGeolocate}
            title="Use my location"
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-colors"
          >
            <span
              className={cn('material-symbols-outlined text-primary', locating && 'animate-pulse')}
              style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
            >
              {locating ? 'pending' : 'my_location'}
            </span>
          </button>
        </div>

        {/* Search button */}
        <button
          onClick={onSearch}
          className="flex items-center gap-2 px-7 py-3 rounded-2xl font-body-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97] shrink-0"
          style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)', boxShadow: '0 4px 14px rgba(0,63,177,0.3)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span>
          Search Jobs
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest text-[10px]">Filters:</span>

        <FilterSelect label="Distance" options={DISTANCES} value={distance} onChange={onDistance} />
        <FilterSelect label="Posted"   options={TIME_POSTED} value={timePosted} onChange={onTimePosted} />

        <div className="flex gap-1.5 flex-wrap">
          {JOB_TYPES.map(t => (
            <button
              key={t}
              onClick={() => onJobType(t)}
              className={cn(
                'px-3 py-1 rounded-full text-[12px] font-semibold transition-all duration-150 active:scale-[0.96]',
                jobType === t
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-primary/10 hover:text-primary border border-outline-variant'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FilterSelect({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-7 py-1.5 rounded-full text-[12px] font-semibold bg-surface-container border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map(o => <option key={o} value={o}>{o === options[0] ? label : o}</option>)}
      </select>
      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: '14px' }}>
        expand_more
      </span>
    </div>
  )
}

function AiPersonalizationCard({ job, onGenerate }: { job: Job; onGenerate: () => void }) {
  const [doc, setDoc] = useState('Resume')
  return (
    <div
      className="mt-4 rounded-2xl p-4 flex items-center gap-3 flex-wrap"
      style={{ background: 'linear-gradient(135deg, #eef4ff 0%, #e8eeff 100%)', border: '1px solid #c7d7f7' }}
    >
      {/* Left */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-body-sm font-bold text-primary text-[13px]">Personalise documents for this job</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="h-1.5 rounded-full bg-primary/20 w-20 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${job.matchScore}%` }} />
            </div>
            <span className="text-[11px] font-bold text-primary">{job.matchScore}% match</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        <select
          value={doc}
          onChange={e => setDoc(e.target.value)}
          className="appearance-none pl-3 pr-7 py-2 rounded-xl text-[12px] font-semibold bg-white border border-primary/20 text-primary outline-none cursor-pointer"
        >
          {['Resume', 'Cover Letter', 'Both'].map(d => <option key={d}>{d}</option>)}
        </select>
        <button
          onClick={onGenerate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.96]"
          style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)', boxShadow: '0 3px 10px rgba(0,63,177,0.25)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
          Generate
        </button>
      </div>
    </div>
  )
}

function JobCard({ job, onSave, onGenerate }: {
  job: Job; onSave: () => void; onGenerate: () => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group">
      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm"
          style={{ background: job.logoColor }}
        >
          {job.initial}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-h2 text-[15px] font-bold text-on-background group-hover:text-primary transition-colors cursor-pointer">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="font-body-sm text-[13px] text-on-surface-variant font-medium">{job.company}</span>
                <span className="text-outline-variant">·</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '13px' }}>location_on</span>
                  <span className="font-body-sm text-[13px] text-on-surface-variant">{job.location}</span>
                </div>
                {job.remote && (
                  <>
                    <span className="text-outline-variant">·</span>
                    <span className="text-[11px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">Remote</span>
                  </>
                )}
              </div>
            </div>

            {/* Bookmark */}
            <button
              onClick={onSave}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/8 transition-colors shrink-0"
            >
              <span
                className="material-symbols-outlined transition-colors"
                style={{
                  fontSize: '18px',
                  color: job.saved ? '#003fb1' : '#94a3b8',
                  fontVariationSettings: job.saved ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                bookmark
              </span>
            </button>
          </div>

          {/* Description */}
          <p className="font-body-sm text-[13px] text-on-surface-variant mt-2 leading-relaxed line-clamp-2">
            {job.description}
          </p>

          {/* Tags row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {/* Job type */}
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: '#dbe1ff', color: '#003fb1' }}
            >
              {job.type}
            </span>

            {/* Salary */}
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: '#dcfce7', color: '#15803d' }}
            >
              {job.salary}
            </span>

            {/* Skills */}
            {job.skills.slice(0, 3).map(skill => (
              <span
                key={skill}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant"
              >
                {skill}
              </span>
            ))}

            {/* Posted */}
            <span className="text-[11px] text-on-surface-variant ml-auto">{job.posted}</span>
          </div>
        </div>
      </div>

      {/* AI Personalisation card */}
      <AiPersonalizationCard job={job} onGenerate={onGenerate} />
    </div>
  )
}

function FloatingActionButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-6 lg:bottom-8 lg:right-8 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 z-30"
      style={{ background: 'linear-gradient(135deg, #003fb1 0%, #1a56db 100%)', boxShadow: '0 8px 24px rgba(0,63,177,0.4)' }}
      title="AI Job Assistant"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
    </button>
  )
}

function MobileBottomNav() {
  const navigate = useNavigate()
  const items = [
    { icon: 'search',      label: 'Search',   path: '/jobs',      active: true },
    { icon: 'fact_check',  label: 'Applied',  path: '/dashboard', active: false },
    { icon: 'description', label: 'Builder',  path: '/builder',   active: false },
    { icon: 'person',      label: 'Profile',  path: '/dashboard', active: false },
  ]
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant z-40 flex">
      {items.map(item => (
        <button
          key={item.label}
          onClick={() => navigate(item.path)}
          className={cn(
            'flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors',
            item.active ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
          )}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '22px', fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}
          >
            {item.icon}
          </span>
          <span className="text-[10px] font-semibold">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function JobSearchPage() {
  const navigate = useNavigate()

  const [keyword,    setKeyword]    = useState('')
  const [location,   setLocation]   = useState('')
  const [jobType,    setJobType]    = useState('All Types')
  const [distance,   setDistance]   = useState('Any distance')
  const [timePosted, setTimePosted] = useState('Any time')
  const [locating,   setLocating]   = useState(false)
  const [jobs,       setJobs]       = useState<Job[]>(ALL_JOBS)
  const [searched,   setSearched]   = useState(false)

  function handleSearch() {
    setSearched(true)
    let results = ALL_JOBS

    if (keyword.trim()) {
      const kw = keyword.toLowerCase()
      results = results.filter(j =>
        j.title.toLowerCase().includes(kw) ||
        j.company.toLowerCase().includes(kw) ||
        j.skills.some(s => s.toLowerCase().includes(kw))
      )
    }

    if (location.trim()) {
      const loc = location.toLowerCase()
      results = results.filter(j =>
        j.location.toLowerCase().includes(loc) ||
        (loc.includes('remote') && j.remote)
      )
    }

    if (jobType !== 'All Types') {
      results = jobType === 'Remote'
        ? results.filter(j => j.remote)
        : results.filter(j => j.type === jobType)
    }

    setJobs(results)
  }

  function handleGeolocate() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          const city = data.address?.city || data.address?.town || data.address?.county || 'My Location'
          const state = data.address?.state_code || data.address?.state || ''
          setLocation(state ? `${city}, ${state}` : city)
        } catch {
          setLocation('My Location')
        } finally {
          setLocating(false)
        }
      },
      () => setLocating(false),
      { timeout: 8000 }
    )
  }

  function toggleSave(id: string) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, saved: !j.saved } : j))
  }

  function handleGenerate(job: Job) {
    navigate('/builder')
  }

  return (
    <div className="min-h-screen bg-background">
      <JobTopNav />
      <JobSidebar />

      {/* Main content — offset for sidebar and topnav */}
      <main className="pt-16 lg:pl-60 pb-20 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

          {/* Page header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full mb-3">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>work</span>
              <span className="font-label-caps text-label-caps text-on-primary-fixed-variant uppercase tracking-widest text-[10px]">
                AI-Powered Job Search
              </span>
            </div>
            <h1 className="font-h1 text-h1 text-on-background">Find your next role</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              {searched ? `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found` : `${ALL_JOBS.length} curated jobs ready for you`}
            </p>
          </div>

          {/* Search panel */}
          <SearchPanel
            keyword={keyword}      location={location}
            jobType={jobType}      distance={distance}
            timePosted={timePosted}
            onKeyword={setKeyword}  onLocation={setLocation}
            onJobType={setJobType}  onDistance={setDistance}
            onTimePosted={setTimePosted}
            onSearch={handleSearch} locating={locating}
            onGeolocate={handleGeolocate}
          />

          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-h2 text-[18px] font-bold text-on-background">
                {searched ? 'Search Results' : 'Recommended for you'}
              </h2>
              <p className="font-body-sm text-[13px] text-on-surface-variant">
                Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body-sm text-[12px] text-on-surface-variant">Sort:</span>
              <select className="text-[12px] font-semibold bg-white border border-outline-variant rounded-lg px-3 py-1.5 outline-none text-on-surface cursor-pointer hover:border-primary transition-colors">
                <option>Best Match</option>
                <option>Most Recent</option>
                <option>Salary High–Low</option>
              </select>
            </div>
          </div>

          {/* Job listings */}
          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSave={() => toggleSave(job.id)}
                  onGenerate={() => handleGenerate(job)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '28px' }}>search_off</span>
              </div>
              <h3 className="font-h2 text-[18px] font-bold text-on-background mb-2">No jobs found</h3>
              <p className="font-body-sm text-on-surface-variant mb-4">
                Try different keywords or broaden your filters.
              </p>
              <button
                onClick={() => { setJobs(ALL_JOBS); setSearched(false); setKeyword(''); setLocation(''); setJobType('All Types') }}
                className="px-5 py-2 rounded-xl font-body-sm font-bold text-primary bg-primary/10 hover:bg-primary/15 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav />
      <FloatingActionButton onClick={() => navigate('/builder')} />
    </div>
  )
}
