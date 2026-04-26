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
  return data.typography === 'classic-serif' ? 'Newsreader, serif' : 'Manrope, sans-serif'
}

export { formatDateRange }
