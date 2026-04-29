import { useRef, useEffect, useLayoutEffect, useState, useMemo, Component } from 'react'
import type { ReactNode } from 'react'
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

const COMPONENTS: Record<TemplateId, React.ComponentType<{ data: typeof SAMPLE_RESUME_DATA }>> = {
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

class ThumbnailErrorBoundary extends Component<
  { children: ReactNode; label: string },
  { error: boolean }
> {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          width: '100%', height: '100%', minHeight: '120px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#f8fafc', color: '#94a3b8',
          fontSize: '11px', gap: '6px',
        }}>
          <span style={{ fontSize: '28px' }}>📄</span>
          <span>{this.props.label}</span>
        </div>
      )
    }
    return this.props.children
  }
}

interface Props {
  templateId: TemplateId
  accentColor?: AccentColor
  // Pass true when the thumbnail is already visible (e.g. inside an open modal)
  // so it skips the IntersectionObserver and renders immediately.
  eager?: boolean
}

export default function TemplateThumbnail({ templateId, accentColor = 'primary', eager = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale,     setScale]     = useState(0.3)
  const [visible,   setVisible]   = useState(eager)

  // Lazy-render: only mount the template component once the card scrolls
  // near the viewport. Once visible it stays rendered (observer disconnects).
  useEffect(() => {
    if (eager) return
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [eager])

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = (w: number) => { if (w > 0) setScale(w / 794) }
    update(el.getBoundingClientRect().width)
    const ro = new ResizeObserver(([e]) => update(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const Component = COMPONENTS[templateId]
  const data = useMemo(
    () => ({ ...SAMPLE_RESUME_DATA, template: templateId, accentColor }),
    [templateId, accentColor],
  )

  const scaledH = Math.round(1123 * scale)

  return (
    <div
      ref={containerRef}
      style={{
        width:    '100%',
        overflow: 'hidden',
        position: 'relative',
        height:   `${scaledH}px`,
        background: !visible ? '#f1f5f9' : undefined,
      }}
    >
      {visible && Component && (
        <ThumbnailErrorBoundary label={templateId}>
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
        </ThumbnailErrorBoundary>
      )}
    </div>
  )
}
