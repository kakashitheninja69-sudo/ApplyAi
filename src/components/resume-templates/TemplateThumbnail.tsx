import { useRef, useEffect, useState, useMemo } from 'react'
import ModernSidebar       from './ModernSidebar'
import ClassicProfessional from './ClassicProfessional'
import MinimalClean        from './MinimalClean'
import Executive           from './Executive'
import AtsClean            from './AtsClean'
import GoogleStandard      from './GoogleStandard'
import AmazonResults       from './AmazonResults'
import MetaImpact          from './MetaImpact'
import FaangCompact        from './FaangCompact'
import ConsultingImpact    from './ConsultingImpact'
import BankingFormal       from './BankingFormal'
import AcademicCv          from './AcademicCv'
import HealthcarePro       from './HealthcarePro'
import SplitModern         from './SplitModern'
import TimelineClassic     from './TimelineClassic'
import BoldHeader          from './BoldHeader'
import TwoColumnGrid       from './TwoColumnGrid'
import CompactElite        from './CompactElite'
import InfographicPro      from './InfographicPro'
import StartupModern       from './StartupModern'
import CreativePortfolio   from './CreativePortfolio'
import DataScience         from './DataScience'
import ProductManager      from './ProductManager'
import DarkElegant         from './DarkElegant'
import { SAMPLE_RESUME_DATA } from '@/lib/sampleResumeData'
import type { TemplateId, AccentColor } from '@/types/resume'

const COMPONENTS = {
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

interface Props {
  templateId: TemplateId
  accentColor?: AccentColor
}

export default function TemplateThumbnail({ templateId, accentColor = 'primary' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / 794)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const Component = COMPONENTS[templateId]
  const data = useMemo(
    () => ({ ...SAMPLE_RESUME_DATA, template: templateId, accentColor }),
    [templateId, accentColor]
  )

  const scaledH = Math.round(1123 * scale)

  return (
    <div ref={containerRef} style={{ width: '100%', overflow: 'hidden', position: 'relative', height: `${scaledH}px` }}>
      <div
        style={{
          transform:       `scale(${scale})`,
          transformOrigin: 'top left',
          width:           '794px',
          pointerEvents:   'none',
          userSelect:      'none',
        }}
      >
        <Component data={data} />
      </div>
    </div>
  )
}
