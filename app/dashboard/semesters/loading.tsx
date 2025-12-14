import { Spinner } from '@/components/ui/spinner'

export default function SemestersLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-9 w-40 bg-muted animate-pulse rounded-md" />
          <div className="h-5 w-80 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="h-10 w-40 bg-muted animate-pulse rounded-md" />
      </div>

      {/* Semesters Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-6 w-32 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-20 bg-muted animate-pulse rounded-md" />
              <div className="h-3 w-28 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="flex justify-end gap-2">
              <div className="h-9 w-16 bg-muted animate-pulse rounded-md" />
              <div className="h-9 w-16 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Center Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <Spinner size="lg" />
      </div>
    </div>
  )
}
