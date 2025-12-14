import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAnalytics } from '@/app/actions/analytics'
import { GPATrendChart } from '@/components/dashboard/GPATrendChart'
import { GradeDistributionChart } from '@/components/dashboard/GradeDistributionChart'
import { CGPACard } from '@/components/dashboard/CGPACard'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { Award, TrendingUp, Target } from 'lucide-react'

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

  const {
    gpaBySemester,
    gradeDistribution,
    performanceMetrics,
    creditsByYear,
    gpaByYear,
    subjectsByGrade,
  } = analytics

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your academic performance
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Subjects"
          value={performanceMetrics.totalSubjects}
          description="Across all semesters"
          iconName="BookOpen"
        />
        <StatsCard
          title="Total Credits"
          value={performanceMetrics.totalCredits}
          description="Cumulative credits earned"
          iconName="Target"
        />
        <StatsCard
          title="Avg Credits/Semester"
          value={performanceMetrics.averageCreditsPerSemester.toFixed(1)}
          description="Average workload"
          iconName="Calendar"
        />
        <StatsCard
          title="Semesters"
          value={gpaBySemester.length}
          description="Total completed"
          iconName="BarChart3"
        />
      </div>

      {/* CGPA Overview and Best/Worst Performance */}
      <div className="grid gap-6 md:grid-cols-3">
        <CGPACard
          cgpa={performanceMetrics.cgpa}
          totalCredits={performanceMetrics.totalCredits}
          className="md:col-span-1"
        />

        {/* Best & Worst Semester Cards */}
        <div className="space-y-4 md:col-span-2">
          {performanceMetrics.bestSemester && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-success" />
                  Best Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {performanceMetrics.bestSemester.name}
                    </p>
                    <p className="text-3xl font-bold text-success">
                      {performanceMetrics.bestSemester.gpa.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
          )}

          {performanceMetrics.worstSemester && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-warning" />
                  Room for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {performanceMetrics.worstSemester.name}
                    </p>
                    <p className="text-3xl font-bold text-warning">
                      {performanceMetrics.worstSemester.gpa.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GPATrendChart data={gpaBySemester} />
        <GradeDistributionChart data={gradeDistribution} />
      </div>

      {/* GPA by Year */}
      {gpaByYear.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Year-wise Performance</CardTitle>
            <CardDescription>Average GPA for each academic year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gpaByYear.map((item) => {
                const performance = item.gpa >= 8.5 ? 'excellent' : item.gpa >= 7.0 ? 'good' : item.gpa >= 6.0 ? 'average' : 'below-average'
                const color = performance === 'excellent' ? 'bg-success' : performance === 'good' ? 'bg-info' : performance === 'average' ? 'bg-warning' : 'bg-error'

                return (
                  <div key={item.year} className="flex items-center gap-4">
                    <span className="text-sm font-medium w-20">{item.year}</span>
                    <div className="flex-1">
                      <div className="w-full h-8 bg-secondary rounded-lg overflow-hidden">
                        <div
                          className={`h-full flex items-center px-3 text-white font-semibold text-sm ${color} transition-all duration-500`}
                          style={{ width: `${(item.gpa / 10) * 100}%` }}
                        >
                          {item.gpa.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground w-24">
                      {creditsByYear.find((c) => c.year === item.year)?.credits || 0} credits
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Grade Analysis */}
      {subjectsByGrade.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subjects by Grade</CardTitle>
            <CardDescription>Detailed breakdown of subjects for each grade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subjectsByGrade
                .sort((a, b) => b.subjects.length - a.subjects.length)
                .map((item) => (
                  <div key={item.grade} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Grade {item.grade}</h3>
                      <span className="text-sm text-muted-foreground">
                        {item.subjects.length} subject{item.subjects.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="px-3 py-1 bg-secondary rounded-full text-sm"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
