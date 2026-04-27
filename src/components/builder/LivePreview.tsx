import { useRef, useEffect, useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import ModernSidebar       from '@/components/resume-templates/ModernSidebar'
import ClassicProfessional from '@/components/resume-templates/ClassicProfessional'
import MinimalClean        from '@/components/resume-templates/MinimalClean'
import Executive           from '@/components/resume-templates/Executive'
import AtsClean            from '@/components/resume-templates/AtsClean'
import GoogleStandard      from '@/components/resume-templates/GoogleStandard'
import AmazonResults       from '@/components/resume-templates/AmazonResults'
import MetaImpact          from '@/components/resume-templates/MetaImpact'
import FaangCompact        from '@/components/resume-templates/FaangCompact'
import ConsultingImpact    from '@/components/resume-templates/ConsultingImpact'
import BankingFormal       from '@/components/resume-templates/BankingFormal'
import AcademicCv          from '@/components/resume-templates/AcademicCv'
import HealthcarePro       from '@/components/resume-templates/HealthcarePro'
import SplitModern         from '@/components/resume-templates/SplitModern'
import TimelineClassic     from '@/components/resume-templates/TimelineClassic'
import BoldHeader          from '@/components/resume-templates/BoldHeader'
import TwoColumnGrid       from '@/components/resume-templates/TwoColumnGrid'
import CompactElite        from '@/components/resume-templates/CompactElite'
import InfographicPro      from '@/components/resume-templates/InfographicPro'
import StartupModern       from '@/components/resume-templates/StartupModern'
import CreativePortfolio   from '@/components/resume-templates/CreativePortfolio'
import DataScience         from '@/components/resume-templates/DataScience'
import ProductManager      from '@/components/resume-templates/ProductManager'
import DarkElegant         from '@/components/resume-templates/DarkElegant'

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('applyai_current_user') || 'null') } catch { return null }
}

const TEMPLATE_MAP = {
  'ats-clean':            AtsClean,
  'google-standard':      GoogleStandard,
  'amazon-results':       AmazonResults,
  'meta-impact':          MetaImpact,
  'faang-compact':        FaangCompact,
  'modern-sidebar':       ModernSidebar,
  'classic-professional': ClassicProfessional,
  'minimal-clean':        MinimalClean,
  'executive':            Executive,
  'consulting-impact':    ConsultingImpact,
  'banking-formal':       BankingFormal,
  'academic-cv':          AcademicCv,
  'healthcare-pro':       HealthcarePro,
  'split-modern':         SplitModern,
  'timeline-classic':     TimelineClassic,
  'bold-header':          BoldHeader,
  'two-column-grid':      TwoColumnGrid,
  'compact-elite':        CompactElite,
  'infographic-pro':      InfographicPro,
  'startup-modern':       StartupModern,
  'creative-portfolio':   CreativePortfolio,
  'data-science':         DataScience,
  'product-manager':      ProductManager,
  'dark-elegant':         DarkElegant,
}

export default function LivePreview() {
  const data          = useResumeStore((s) => s.data)
  const openAuthModal = useResumeStore((s) => s.openAuthModal)
  const containerRef  = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.6)

  function handleExport() {
    if (!getCurrentUser()) { openAuthModal(); return }
    window.print()
  }

  useEffect(() => {
    function calcScale() {
      if (!containerRef.current) return
      const available = containerRef.current.clientWidth - 48
      setScale(Math.min(available / 794, 1))
    }
    calcScale()
    const ro = new ResizeObserver(calcScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const Template = TEMPLATE_MAP[data.template]

  return (
    <div
      ref={containerRef}
      className="h-full flex flex-col bg-surface-dim custom-scrollbar overflow-y-auto"
    >
      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
          >
            visibility
          </span>
          <span className="font-body-sm text-body-sm font-semibold text-on-surface">Live Preview</span>
          <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest ml-1">
            A4
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-body-sm text-body-sm text-outline">{Math.round(scale * 100)}%</span>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-semibold ai-sparkle-button text-white"
            onClick={handleExport}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>download</span>
            Export PDF
          </button>
        </div>
      </div>

      {/* Scaled A4 canvas */}
      <div className="flex-1 flex justify-center py-8 px-6">
        <div
          style={{
            width:         `${794 * scale}px`,
            height:        `${1123 * scale}px`,
            position:      'relative',
            flexShrink:    0,
            overflow:      'hidden',
            borderRadius:  '4px',
            boxShadow:     '0 8px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              transform:       `scale(${scale})`,
              transformOrigin: 'top left',
              width:           '794px',
              height:          '1123px',
              position:        'absolute',
              top:             0,
              left:            0,
            }}
          >
            <Template data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
