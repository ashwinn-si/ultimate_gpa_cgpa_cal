import { Spinner } from '@/components/ui/spinner'

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-9 w-32 bg-muted animate-pulse rounded-md" />
        <div className="h-5 w-80 bg-muted animate-pulse rounded-md" />
      </div>

      {/* Settings Content Skeleton */}
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="h-6 w-40 bg-muted animate-pulse rounded-md" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
            <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="h-6 w-40 bg-muted animate-pulse rounded-md" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
            <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
          </div>
        </div>
      </div>

      {/* Center Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    </div>
  )
}
