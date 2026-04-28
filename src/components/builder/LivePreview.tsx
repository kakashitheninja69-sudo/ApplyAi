import { useRef, useEffect, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useResumeStore } from '@/store/resumeStore'
import { useAuth } from '@/contexts/AuthContext'
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

// A4 dimensions in pixels at 96dpi
const A4_W = 794
const A4_H = 1123

export default function LivePreview() {
  const data           = useResumeStore((s) => s.data)
  const openAuthModal  = useResumeStore((s) => s.openAuthModal)
  const exportTrigger  = useResumeStore((s) => s.exportTrigger)
  const { currentUser } = useAuth()
  const containerRef   = useRef<HTMLDivElement>(null)
  const printRef       = useRef<HTMLDivElement>(null)
  const [scale, setScale]         = useState(0.6)
  const [downloading, setDownloading] = useState(false)

  // triggered from BuilderPage header's "Export PDF" button
  useEffect(() => {
    if (exportTrigger > 0) handleDownload()
  }, [exportTrigger])

  // ── Download PDF (multi-page) ─────────────────────────────────
  async function handleDownload() {
    if (!currentUser) { openAuthModal(); return }
    if (!printRef.current) return
    setDownloading(true)
    try {
      const el = printRef.current
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width:  A4_W,
        height: el.scrollHeight,
        windowWidth: A4_W,
        logging: false,
      })

      const pdf        = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW      = 210                                      // mm
      const pageH      = 297                                      // mm
      const imgW       = pageW
      const totalImgH  = (canvas.height / canvas.width) * imgW   // mm, full height
      const totalPages = Math.ceil(totalImgH / pageH)

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage()
        // Shift the image up so each page shows the next slice
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.97),
          'JPEG',
          0,
          -(i * pageH),
          imgW,
          totalImgH,
        )
      }

      const name = (data.contact.name || 'resume').replace(/\s+/g, '_')
      pdf.save(`${name}.pdf`)
    } finally {
      setDownloading(false)
    }
  }

  // ── Print (browser print dialog, CSS hides UI) ───────────────
  function handlePrint() {
    if (!currentUser) { openAuthModal(); return }
    window.print()
  }

  // ── Scale to fit container ───────────────────────────────────
  useEffect(() => {
    function calcScale() {
      if (!containerRef.current) return
      const available = containerRef.current.clientWidth - 48
      setScale(Math.min(available / A4_W, 1))
    }
    calcScale()
    const ro = new ResizeObserver(calcScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const Template = TEMPLATE_MAP[data.template]

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-surface-dim custom-scrollbar overflow-y-auto">

      {/* Hidden full-height render — used by html2canvas AND @media print */}
      <div id="resume-print-target" style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: `${A4_W}px`, zIndex: -1 }}>
        <div ref={printRef} style={{ width: `${A4_W}px` }}>
          <Template data={data} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>visibility</span>
          <span className="font-body-sm text-body-sm font-semibold text-on-surface">Live Preview</span>
          <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest ml-1">A4</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-body-sm text-body-sm text-outline">{Math.round(scale * 100)}%</span>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>print</span>
            Print
          </button>

          {/* Download PDF button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-semibold ai-sparkle-button text-white disabled:opacity-60"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '14px', animation: downloading ? 'spin 1s linear infinite' : 'none' }}
            >
              {downloading ? 'refresh' : 'download'}
            </span>
            {downloading ? 'Generating…' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Scaled A4 preview */}
      <div className="flex-1 flex justify-center py-8 px-6">
        <div
          style={{
            width:      `${A4_W * scale}px`,
            height:     `${A4_H * scale}px`,
            position:   'relative',
            flexShrink: 0,
            overflow:   'hidden',
            borderRadius: '4px',
            boxShadow:  '0 8px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              transform:       `scale(${scale})`,
              transformOrigin: 'top left',
              width:           `${A4_W}px`,
              height:          `${A4_H}px`,
              position:        'absolute',
              top: 0, left: 0,
            }}
          >
            <Template data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
