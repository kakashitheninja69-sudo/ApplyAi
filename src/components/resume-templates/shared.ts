import type { ResumeData } from '@/types/resume'
import { ACCENT_COLORS, formatDateRange } from '@/lib/utils'

export interface TemplateProps {
  data: ResumeData
  scale?: number
}

export function accentHex(data: ResumeData): string {
  return ACCENT_COLORS[data.accentColor]?.hex ?? '#003fb1'
}

export function headingFont(data: ResumeData): string {
  switch (data.typography) {
    case 'classic-serif':   return 'Newsreader, serif'
    case 'modern-rounded':  return 'DM Sans, sans-serif'
    case 'executive-serif': return 'Lora, serif'
    default:                return 'Manrope, sans-serif'
  }
}

export { formatDateRange }
