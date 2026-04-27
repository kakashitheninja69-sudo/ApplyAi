import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '@/components/layout/Footer'
import { useResumeStore } from '@/store/resumeStore'
import { ACCENT_COLORS, cn } from '@/lib/utils'
import TemplateThumbnail from '@/components/resume-templates/TemplateThumbnail'
import TemplatePreviewModal from '@/components/resume-templates/TemplatePreviewModal'
import type { TemplatePreviewEntry } from '@/components/resume-templates/TemplatePreviewModal'
import type { TemplateId, AccentColor } from '@/types/resume'

type TemplateEntry = TemplatePreviewEntry

interface TemplateSection {
  heading: string
  icon: string
  description: string
  templates: TemplateEntry[]
}

const SECTIONS: TemplateSection[] = [
  {
    heading: 'FANG & ATS-Optimised',
    icon: 'verified',
    description: 'Used by engineers and PMs at Google, Amazon, Meta, Apple, and Netflix. Maximum ATS pass-through rate.',
    templates: [
      {
        id: 'ats-clean',
        label: 'ATS Clean',
        subtitle: 'Maximum ATS Score',
        description: 'Zero-decoration, pure-text layout. Passes every ATS parser with flying colours. The safe default for any job.',
        tags: ['ATS', 'Any Role', 'Safe'],
        defaultAccent: 'slate',
        badge: 'ATS #1',
        features: ['100% ATS-Optimised', 'Single Column', 'No Graphics or Icons', 'Printer Friendly', 'Works for Any Industry', 'Zero Parse Failures'],
      },
      {
        id: 'google-standard',
        label: 'Google Standard',
        subtitle: 'Google SWE Style',
        description: 'Clean single-column layout preferred by Google recruiters. Left-bordered section headers, metric-focused bullets.',
        tags: ['Google', 'SWE', 'Tech'],
        defaultAccent: 'primary',
        badge: 'FANG',
        features: ['FANG Approved Format', 'Left-Border Section Headers', 'Metric-Focused Bullets', 'ATS Optimised', 'Single Column Layout', 'Recruiter Preferred'],
      },
      {
        id: 'amazon-results',
        label: 'Amazon Results',
        subtitle: 'Leadership Principles',
        description: 'Results-first format aligned with Amazon\'s "Bias for Action" culture. Impact-driven bullet structure.',
        tags: ['Amazon', 'FAANG', 'Leadership'],
        defaultAccent: 'orange',
        badge: 'FANG',
        features: ['Results-First Bullets', 'Leadership Principles Aligned', 'STAR Format Friendly', 'ATS Optimised', 'Impact-Driven Layout', 'FANG Approved'],
      },
      {
        id: 'meta-impact',
        label: 'Meta Impact',
        subtitle: 'Meta / Facebook Style',
        description: 'Full-width accent header, two-column body. Optimised for Meta\'s skills-and-impact review process.',
        tags: ['Meta', 'Facebook', 'FAANG'],
        defaultAccent: 'primary',
        badge: 'FANG',
        features: ['Full-Width Accent Header', 'Two-Column Body', 'Skills-and-Impact Format', 'ATS Optimised', 'FANG Approved', 'High Visual Impact'],
      },
      {
        id: 'faang-compact',
        label: 'FAANG Compact',
        subtitle: 'Senior Engineers · 15+ Yrs',
        description: 'Ultra-dense layout for senior engineers with 10–20 years of experience. Fits everything in one A4 page.',
        tags: ['FAANG', 'Senior', 'Compact'],
        defaultAccent: 'slate',
        badge: 'FANG',
        features: ['Ultra-Dense Layout', 'Fits 15+ Years on 1 Page', 'ATS Optimised', 'FANG Approved', 'Senior Engineer Ready', 'Minimum Font 10px'],
      },
    ],
  },
  {
    heading: 'Classic Originals',
    icon: 'auto_awesome',
    description: 'Our flagship designs — polished, versatile, and trusted by 10,000+ professionals.',
    templates: [
      {
        id: 'modern-sidebar',
        label: 'Modern Sidebar',
        subtitle: 'Creative & Tech Roles',
        description: 'Vibrant two-column layout with a full-height coloured sidebar. Stands out while remaining ATS-compatible.',
        tags: ['Tech', 'Creative', 'Startup'],
        defaultAccent: 'primary',
        features: ['Full-Height Coloured Sidebar', 'Two-Column Layout', 'ATS Compatible', '8 Accent Colours', 'Contact in Sidebar', 'Skills in Sidebar'],
      },
      {
        id: 'classic-professional',
        label: 'Classic Professional',
        subtitle: 'Corporate & Finance',
        description: 'Centred header with traditional section formatting. Trusted by recruiters in banking, law, and consulting.',
        tags: ['Finance', 'Law', 'Corporate'],
        defaultAccent: 'slate',
        features: ['Centred Name Header', 'Traditional Layout', 'ATS Optimised', 'Conservative Typography', 'Finance & Law Approved', 'Single Column'],
      },
      {
        id: 'minimal-clean',
        label: 'Minimal Clean',
        subtitle: 'Modern & High Readability',
        description: 'Two-column label-plus-content layout with maximum white space. Scores top marks with ATS systems.',
        tags: ['Product', 'Management', 'Any Industry'],
        defaultAccent: 'teal',
        features: ['Label + Content Layout', 'Maximum White Space', 'High Readability', 'ATS Friendly', 'Works Any Industry', 'Clean & Modern'],
      },
      {
        id: 'executive',
        label: 'Executive',
        subtitle: 'Leadership & C-Suite',
        description: 'Commanding layout with an accent top bar and side panel. Projects authority for senior positions.',
        tags: ['Leadership', 'C-Suite', 'Director'],
        defaultAccent: 'primary',
        features: ['Accent Top Bar', 'Side Panel Layout', 'Executive Presence', 'ATS Compatible', 'C-Suite Ready', 'Authority Projection'],
      },
    ],
  },
  {
    heading: 'Corporate & Professional',
    icon: 'business_center',
    description: 'Formal templates for consulting, finance, academia, and healthcare.',
    templates: [
      {
        id: 'consulting-impact',
        label: 'Consulting Impact',
        subtitle: 'McKinsey / BCG Style',
        description: 'Centred name, double-rule dividers, impact-first bullet structure. The go-to for MBB consulting applications.',
        tags: ['Consulting', 'McKinsey', 'BCG'],
        defaultAccent: 'slate',
        features: ['Centred Name Header', 'Double-Rule Dividers', 'Impact-First Bullets', 'MBB Approved Style', 'ATS Optimised', 'Conservative & Polished'],
      },
      {
        id: 'banking-formal',
        label: 'Banking Formal',
        subtitle: 'Investment Banking',
        description: 'Centred header, conservative typography, triple-line dividers. The traditional IB format that never fails.',
        tags: ['Finance', 'IB', 'Corporate'],
        defaultAccent: 'slate',
        features: ['Triple-Line Dividers', 'Conservative Typography', 'IB Format Standard', 'ATS Optimised', 'Finance Approved', 'Centred Header'],
      },
      {
        id: 'academic-cv',
        label: 'Academic CV',
        subtitle: 'Research & Academia',
        description: 'Education-first layout with space for publications, research, and academic achievements.',
        tags: ['Academia', 'Research', 'PhD'],
        defaultAccent: 'secondary',
        features: ['Education-First Layout', 'Publications Section', 'Research-Ready', 'Academic Standard', 'ATS Compatible', 'PhD & PostDoc Ready'],
      },
      {
        id: 'healthcare-pro',
        label: 'Healthcare Pro',
        subtitle: 'Medical & Clinical',
        description: 'Teal accent, clean contact block, and category-labelled skills perfect for medical professionals.',
        tags: ['Healthcare', 'Clinical', 'Medical'],
        defaultAccent: 'teal',
        features: ['Teal Accent Colours', 'Category-Labelled Skills', 'Clean Contact Block', 'Clinical Role Ready', 'ATS Friendly', 'Medical Professional'],
      },
    ],
  },
  {
    heading: 'Modern Layouts',
    icon: 'grid_view',
    description: 'Contemporary designs that balance visual personality with ATS compatibility.',
    templates: [
      {
        id: 'split-modern',
        label: 'Split Modern',
        subtitle: '30/70 Two-Column',
        description: 'Narrow accent sidebar with contact and skills; wide main column for experience. Clean and balanced.',
        tags: ['Modern', 'Two-Column', 'Tech'],
        defaultAccent: 'violet',
        features: ['30/70 Column Split', 'Accent Sidebar', 'Skills in Sidebar', 'ATS Compatible', 'Clean & Balanced', 'Modern Look'],
      },
      {
        id: 'timeline-classic',
        label: 'Timeline Classic',
        subtitle: 'Visual Career Story',
        description: 'Vertical timeline with circle dots and connecting line. Tells your career story in chronological order.',
        tags: ['Visual', 'Timeline', 'Creative'],
        defaultAccent: 'primary',
        features: ['Vertical Timeline', 'Circle Dot Markers', 'Chronological Story', 'ATS Compatible', 'Visually Engaging', 'Career Progression'],
      },
      {
        id: 'bold-header',
        label: 'Bold Header',
        subtitle: 'High-Impact First Impression',
        description: 'Full-width coloured header band with white name and contact. Instantly memorable.',
        tags: ['Bold', 'Modern', 'Any Role'],
        defaultAccent: 'primary',
        features: ['Full-Width Header Band', 'White on Accent Name', 'High-Impact Design', 'ATS Compatible', 'Instantly Memorable', '8 Colour Options'],
      },
      {
        id: 'two-column-grid',
        label: 'Two-Column Grid',
        subtitle: 'Balanced Layout',
        description: 'Left column: skills, education, contact. Right column: experience. Maximum information in minimal space.',
        tags: ['Grid', 'Balanced', 'Senior'],
        defaultAccent: 'teal',
        features: ['38/62 Grid Layout', 'Skills Left Column', 'Experience Right Column', 'ATS Compatible', 'High Information Density', 'Senior Ready'],
      },
      {
        id: 'compact-elite',
        label: 'Compact Elite',
        subtitle: 'Maximum Density',
        description: 'Ultra-compact for 20+ year careers. Every pixel used. Fits a complete career story on one page.',
        tags: ['Compact', 'Senior', 'Dense'],
        defaultAccent: 'slate',
        features: ['Ultra-Compact Layout', '20+ Year Career Ready', 'Maximum Information', 'ATS Optimised', 'Elite Density', 'One Page Guarantee'],
      },
      {
        id: 'infographic-pro',
        label: 'Infographic Pro',
        subtitle: 'Skills & Visual Data',
        description: 'Sidebar with skill-proficiency bars, icon labels, and remaining skills as chips. Visually engaging.',
        tags: ['Visual', 'Infographic', 'Creative'],
        defaultAccent: 'violet',
        features: ['Skill Progress Bars', 'Icon Skill Labels', 'Chip-Style Tags', 'Visual Sidebar', 'ATS Compatible', 'Data-Driven Look'],
      },
    ],
  },
  {
    heading: 'Creative & Industry',
    icon: 'palette',
    description: 'Industry-specific and visually expressive templates for modern roles.',
    templates: [
      {
        id: 'startup-modern',
        label: 'Startup Modern',
        subtitle: 'Clean & Airy',
        description: 'Oversized name, wide spacing, minimal section labels. The template for early-stage startup culture.',
        tags: ['Startup', 'Minimal', 'Tech'],
        defaultAccent: 'primary',
        features: ['Oversized Name Header', 'Airy Line Spacing', 'Minimal Section Labels', 'ATS Friendly', 'Startup Culture Vibe', 'Clean & Modern'],
      },
      {
        id: 'creative-portfolio',
        label: 'Creative Portfolio',
        subtitle: 'Designers & Creatives',
        description: 'Accent-coloured name, colourful skill chips, left-border experience blocks. Personality meets professionalism.',
        tags: ['Design', 'Creative', 'Portfolio'],
        defaultAccent: 'violet',
        features: ['Accent-Coloured Name', 'Colourful Skill Chips', 'Left-Border Blocks', 'ATS Compatible', 'Portfolio-Ready', 'Personality-Forward'],
      },
      {
        id: 'data-science',
        label: 'Data Science',
        subtitle: 'ML / Data Engineers',
        description: 'Dark header panel, skills grid above the fold, structured for technical depth and research output.',
        tags: ['Data', 'ML', 'Engineering'],
        defaultAccent: 'primary',
        features: ['Dark Header Panel', 'Skills Grid Above Fold', 'Technical Depth Layout', 'ATS Optimised', 'ML & Research Ready', 'Engineering Standard'],
      },
      {
        id: 'product-manager',
        label: 'Product Manager',
        subtitle: 'Product & Strategy',
        description: 'Blue header strip, metric-callout chips on quantified bullets, separate leadership and tech skill sections.',
        tags: ['Product', 'PM', 'Strategy'],
        defaultAccent: 'primary',
        features: ['Metric Callout Chips', 'Header Strip Layout', 'Leadership Skills Section', 'Tech Skills Section', 'ATS Optimised', 'PM-Focused Design'],
      },
      {
        id: 'dark-elegant',
        label: 'Dark Elegant',
        subtitle: 'Premium Dark Theme',
        description: 'Sophisticated dark background with accent-coloured section headers. Stands out in any pile.',
        tags: ['Dark', 'Premium', 'Creative'],
        defaultAccent: 'violet',
        features: ['Dark Background Theme', 'Accent Section Headers', 'Premium Look & Feel', 'Sidebar Layout', 'High Contrast', 'Stands Out Instantly'],
      },
    ],
  },
]

const ALL_TEMPLATES = SECTIONS.flatMap(s => s.templates)

const DEFAULT_ACCENTS = Object.fromEntries(
  ALL_TEMPLATES.map(t => [t.id, t.defaultAccent])
) as Record<TemplateId, AccentColor>

export default function TemplatesPage() {
  const navigate = useNavigate()
  const { resetBuilder } = useResumeStore()
  const [cardAccents,     setCardAccents]     = useState<Record<TemplateId, AccentColor>>(DEFAULT_ACCENTS)
  const [previewTemplate, setPreviewTemplate] = useState<TemplateEntry | null>(null)

  function handleUseTemplate(id: TemplateId) {
    resetBuilder(id, cardAccents[id])
    navigate('/builder')
  }

  function setCardAccent(id: TemplateId, color: AccentColor) {
    setCardAccents(prev => ({ ...prev, [id]: color }))
  }

  function openPreview(t: TemplateEntry) {
    setPreviewTemplate(t)
  }

  function closePreview() {
    setPreviewTemplate(null)
  }

  return (
    <div className="min-h-screen bg-background text-on-background">

      {/* Hero */}
      <section className="pt-28 pb-14 bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full mb-5">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '15px' }}>style</span>
            <span className="font-label-caps text-label-caps text-on-primary-fixed-variant uppercase tracking-widest">
              24 Professional Templates
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-background mb-4">
            Choose Your <span className="text-primary">Template</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Every template is ATS-engineered. FANG-approved designs are pinned at the top — pick one, choose your colour, and build in minutes.
          </p>
        </div>
      </section>

      {/* Template Sections */}
      <div className="py-16 space-y-20 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-8">
          {SECTIONS.map(section => (
            <div key={section.heading} className="mb-20">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={cn(
                    'material-symbols-outlined',
                    section.heading.includes('FANG') ? 'text-yellow-500' : 'text-primary'
                  )}
                  style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}
                >
                  {section.icon}
                </span>
                <h2 className="font-h1 text-h1 text-on-background">{section.heading}</h2>
                {section.heading.includes('FANG') && (
                  <span className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
                    Always pinned
                  </span>
                )}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-8 ml-9">{section.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {section.templates.map(t => {
                  const accent    = cardAccents[t.id] ?? t.defaultAccent
                  const accentHex = ACCENT_COLORS[accent]?.hex ?? '#003fb1'

                  return (
                    <div
                      key={t.id}
                      className="group bg-white rounded-2xl border border-outline-variant overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      {/* Thumbnail */}
                      <div className="relative overflow-hidden bg-gray-50 cursor-pointer" onClick={() => openPreview(t)}>
                        <TemplateThumbnail templateId={t.id} accentColor={accent} />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0">
                            <div className="bg-white text-on-background font-body-sm font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
                              <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>preview</span>
                              Preview
                            </div>
                          </div>
                        </div>

                        {/* Accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accentHex }} />

                        {/* Badge */}
                        {t.badge && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold text-white"
                            style={{ background: t.badge === 'ATS #1' ? '#059669' : '#f59e0b', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                            {t.badge}
                          </div>
                        )}
                      </div>

                      {/* Card body */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex-1">
                          <h3 className="font-h2 text-[14px] font-bold text-on-background">{t.label}</h3>
                          <p className="font-body-sm text-[11px] font-semibold mt-0.5 mb-2" style={{ color: accentHex }}>{t.subtitle}</p>
                          <p className="font-body-sm text-[11px] text-on-surface-variant mb-3 leading-relaxed">{t.description}</p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {t.tags.map(tag => (
                              <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ background: `${accentHex}15`, color: accentHex, border: `1px solid ${accentHex}25` }}>
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Colour swatches */}
                          <div className="mb-3">
                            <p className="font-label-caps text-[9px] uppercase tracking-widest text-on-surface-variant mb-1.5">Colour</p>
                            <div className="flex flex-wrap gap-1.5">
                              {(Object.entries(ACCENT_COLORS) as [AccentColor, { hex: string; label: string }][]).map(([key, { hex, label }]) => (
                                <button key={key} title={label} onClick={() => setCardAccent(t.id, key)}
                                  className={cn('w-5 h-5 rounded-full transition-all duration-150 hover:scale-110', accent === key && 'scale-110')}
                                  style={{ backgroundColor: hex, outline: accent === key ? `2px solid ${hex}` : 'none', outlineOffset: '2px' }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <button onClick={() => handleUseTemplate(t.id)}
                          className="w-full py-2 rounded-xl font-body-sm text-[12px] font-bold text-white flex items-center justify-center gap-1.5 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                          style={{ background: accentHex, boxShadow: `0 4px 10px ${accentHex}35` }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit_document</span>
                          Use This Template
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-[1440px] mx-auto px-8">
          <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
            You can switch templates at any time inside the builder — your content is always preserved.
          </p>
        </div>
      </div>

      <Footer />

      {/* Template preview modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        initialAccent={previewTemplate ? cardAccents[previewTemplate.id] : undefined}
        onClose={closePreview}
      />
    </div>
  )
}
