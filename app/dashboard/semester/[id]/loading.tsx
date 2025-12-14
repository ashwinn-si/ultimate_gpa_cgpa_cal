import { Spinner } from '@/components/ui/spinner'

export default function SemesterDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-muted animate-pulse rounded-md" />
          <div className="h-5 w-64 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded-md" />
            <div className="h-8 w-20 bg-muted animate-pulse rounded-md" />
            <div className="h-3 w-32 bg-muted animate-pulse rounded-md" />
          </div>
        ))}
      </div>

      {/* Subjects Table Skeleton */}
      <div className="rounded-lg border bg-card">
        <div className="p-6 space-y-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-48 bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-20 bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded-md ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading semester details...</p>
        </div>
      </div>
    </div>
  )
}
