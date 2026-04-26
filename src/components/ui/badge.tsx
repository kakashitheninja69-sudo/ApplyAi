import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success'
  onRemove?: () => void
}

export function Badge({ className, variant = 'default', onRemove, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-body-sm text-body-sm font-medium transition-colors',
        {
          'bg-primary text-white':                             variant === 'default',
          'bg-surface-container text-on-surface-variant':     variant === 'secondary',
          'border border-outline-variant text-on-surface-variant': variant === 'outline',
          'bg-secondary-container text-on-secondary-container': variant === 'success',
        },
        className
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 rounded-full hover:opacity-70 transition-opacity leading-none"
          aria-label="Remove"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
        </button>
      )}
    </span>
  )
}
