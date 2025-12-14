'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'

interface GradeDistributionChartProps {
  data: { grade: string; count: number; percentage: number }[]
}

// Color palette for grades
const COLORS = [
  'hsl(142, 76%, 36%)',  // Green for top grades
  'hsl(160, 84%, 39%)',  // Teal
  'hsl(199, 89%, 48%)',  // Blue
  'hsl(48, 96%, 53%)',   // Yellow
  'hsl(25, 95%, 53%)',   // Orange
  'hsl(0, 84%, 60%)',    // Red for lower grades
]

export function GradeDistributionChart({ data }: GradeDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Overview of your grades across all subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
        <CardDescription>Breakdown of grades across {data.reduce((sum, item) => sum + item.count, 0)} subjects</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="grade"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number, name: string) => {
                if (name === 'count') return [value, 'Subjects']
                if (name === 'percentage') return [`${value}%`, 'Percentage']
                return [value, name]
              }}
            />
            <Legend />
            <Bar dataKey="count" name="Subjects" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Grade breakdown table */}
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={item.grade} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-medium">{item.grade}</span>
              </div>
              <div className="text-muted-foreground">
                {item.count} subjects ({item.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
