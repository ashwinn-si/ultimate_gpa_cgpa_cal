'use client'

import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface LoadingOverlayProps {
  message?: string
  fullScreen?: boolean
  className?: string
}

export function LoadingOverlay({ message = 'Loading...', fullScreen = false, className }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullScreen ? 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm' : 'absolute inset-0 z-10 bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <Spinner size="lg" />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  )
}
