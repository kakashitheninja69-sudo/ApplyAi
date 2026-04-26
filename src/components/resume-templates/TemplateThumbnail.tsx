import { useRef, useEffect, useState, useMemo } from 'react'
import ModernSidebar        from './ModernSidebar'
import ClassicProfessional  from './ClassicProfessional'
import MinimalClean         from './MinimalClean'
import Executive            from './Executive'
import { SAMPLE_RESUME_DATA } from '@/lib/sampleResumeData'
import type { TemplateId, AccentColor } from '@/types/resume'

const COMPONENTS = {
  'modern-sidebar':       ModernSidebar,
  'classic-professional': ClassicProfessional,
  'minimal-clean':        MinimalClean,
  'executive':            Executive,
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
