import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[80px] w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-sm text-body-sm text-on-surface placeholder:text-outline resize-none',
      'transition-all duration-150',
      'hover:border-outline',
      'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-container-low',
      className
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Textarea }
