/*import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

const Dialog          = DialogPrimitive.Root
const DialogTrigger   = DialogPrimitive.Trigger
const DialogPortal    = DialogPrimitive.Portal
const DialogClose     = DialogPrimitive.Close

function DialogOverlay({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  )
}

function DialogContent({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md border border-outline-variant/30',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
        <DialogClose className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
        </DialogClose>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 mb-6', className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('font-h1 text-h1 text-on-background', className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('font-body-md text-body-md text-on-surface-variant', className)}
      {...props}
    />
  )
}

export {
  Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogClose,
  DialogContent, DialogHeader, DialogTitle, DialogDescription,
}


*/




import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'
import * as React from 'react'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

// ─────────────────────────────────────────────
// Overlay (already correct)
// ─────────────────────────────────────────────
function DialogOverlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  )
}

// ─────────────────────────────────────────────
// Content (FIXED — THIS IS THE IMPORTANT PART)
// ─────────────────────────────────────────────
function DialogContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />

      {/* FULL SCREEN SAFE LAYER */}
      <DialogPrimitive.Content
        className={cn(
          // 🔥 KEY FIX: avoid transform/fixed bugs completely
          'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6',

          className
        )}
        {...props}
      >
        {/* MODAL BOX */}
        <div
          className={cn(
            'relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-outline-variant/30',
            'animate-in fade-in zoom-in-95 duration-200'
          )}
        >
          {children}

          <DialogClose className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              close
            </span>
          </DialogClose>
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

// ─────────────────────────────────────────────
// Header / Title / Description
// ─────────────────────────────────────────────
function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1.5 mb-6', className)} {...props} />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('font-h1 text-h1 text-on-background', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn(
        'font-body-md text-body-md text-on-surface-variant',
        className
      )}
      {...props}
    />
  )
}

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}