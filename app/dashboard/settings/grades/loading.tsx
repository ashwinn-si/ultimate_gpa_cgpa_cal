import { Spinner } from '@/components/ui/spinner'

export default function GradesSettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-muted animate-pulse rounded-md" />
          <div className="h-5 w-96 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
      </div>

      {/* Grades Table Skeleton */}
      <div className="rounded-lg border bg-card">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-md">
              <div className="h-6 w-12 bg-muted animate-pulse rounded-md" />
              <div className="h-6 w-20 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
              <div className="flex gap-2 ml-auto">
                <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading grade configurations...</p>
        </div>
      </div>
    </div>
  )
}
