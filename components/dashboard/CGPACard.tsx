'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getPerformanceLevel } from '@/lib/utils/calculations'

interface CGPACardProps {
  cgpa: number
  totalCredits: number
  className?: string
}

export function CGPACard({ cgpa, totalCredits, className }: CGPACardProps) {
  const performance = getPerformanceLevel(cgpa)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Overall CGPA</CardTitle>
        <CardDescription>Cumulative Grade Point Average</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* CGPA Display */}
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">{cgpa.toFixed(2)}</span>
            <span className="text-2xl text-muted-foreground">/ 10.0</span>
          </div>

          {/* Performance Level */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full ${performance.bgColor}`}>
            <span className={`text-sm font-medium ${performance.color}`}>
              {performance.level}
            </span>
          </div>

          {/* Total Credits */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Credits</span>
              <span className="font-semibold">{totalCredits}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-muted-foreground">Performance</span>
              <span className="font-semibold">{performance.description}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{((cgpa / 10) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${cgpa >= 8.5
                    ? 'bg-success'
                    : cgpa >= 7.0
                      ? 'bg-info'
                      : cgpa >= 6.0
                        ? 'bg-warning'
                        : 'bg-error'
                  }`}
                style={{ width: `${(cgpa / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
