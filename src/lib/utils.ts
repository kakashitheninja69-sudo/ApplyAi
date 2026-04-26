import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { AccentColor } from '@/types/resume'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ACCENT_COLORS: Record<AccentColor, { hex: string; label: string; tailwind: string }> = {
  primary:   { hex: '#003fb1', label: 'Blue',        tailwind: 'bg-primary' },
  secondary: { hex: '#006c4a', label: 'Emerald',     tailwind: 'bg-secondary' },
  tertiary:  { hex: '#852b00', label: 'Deep Orange', tailwind: 'bg-tertiary' },
  slate:     { hex: '#1e293b', label: 'Slate',       tailwind: 'bg-[#1e293b]' },
  violet:    { hex: '#7c3aed', label: 'Violet',      tailwind: 'bg-[#7c3aed]' },
  pink:      { hex: '#db2777', label: 'Rose',        tailwind: 'bg-[#db2777]' },
  orange:    { hex: '#ea580c', label: 'Orange',      tailwind: 'bg-[#ea580c]' },
  teal:      { hex: '#0d9488', label: 'Teal',        tailwind: 'bg-[#0d9488]' },
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(month) - 1]} ${year}`
}

export function formatDateRange(start: string, end: string, current: boolean): string {
  if (!start) return ''
  return `${formatDateDisplay(start)} – ${current ? 'Present' : formatDateDisplay(end)}`
}
