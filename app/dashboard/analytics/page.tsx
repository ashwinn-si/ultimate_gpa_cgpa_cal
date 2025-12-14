import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Visualize your academic performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>Detailed charts and insights coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will include GPA trends, grade distribution charts, and performance insights.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
