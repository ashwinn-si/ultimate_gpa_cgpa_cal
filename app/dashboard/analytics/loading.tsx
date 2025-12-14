import { Spinner } from '@/components/ui/spinner'

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-9 w-32 bg-muted animate-pulse rounded-md" />
        <div className="h-5 w-96 bg-muted animate-pulse rounded-md" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded-md" />
            <div className="h-8 w-20 bg-muted animate-pulse rounded-md" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
            <div className="h-6 w-40 bg-muted animate-pulse rounded-md" />
            <div className="h-64 bg-muted/50 animate-pulse rounded-md" />
          </div>
        ))}
      </div>

      {/* Center Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    </div>
  )
}
