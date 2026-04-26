import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-h2 text-body-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none',
  {
    variants: {
      variant: {
        default: 'ai-sparkle-button text-white',
        outline:
          'border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container hover:border-primary',
        ghost:
          'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
        secondary: 'bg-surface-container text-on-surface hover:bg-surface-container-high',
        destructive: 'bg-error text-on-error hover:opacity-90',
        link: 'text-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto font-medium',
      },
      size: {
        sm: 'h-8 px-3 text-body-sm',
        md: 'h-10 px-5',
        lg: 'h-12 px-8 text-body-md',
        xl: 'h-14 px-10 text-body-lg',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
