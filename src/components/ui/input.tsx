import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-10 w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-sm text-body-sm text-on-surface placeholder:text-outline',
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
Input.displayName = 'Input'

export { Input }
