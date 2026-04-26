import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

const Tabs        = TabsPrimitive.Root
const TabsContent = TabsPrimitive.Content

function TabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex items-center justify-start rounded-lg bg-surface-container p-1 gap-0.5',
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded px-3 py-1.5 font-body-sm text-body-sm font-medium',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'disabled:pointer-events-none disabled:opacity-50',
        'text-on-surface-variant hover:bg-surface-container-high',
        'data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm',
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
