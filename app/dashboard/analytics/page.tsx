import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAnalytics } from '@/app/actions/analytics'
import { GPATrendChart } from '@/components/dashboard/GPATrendChart'
import { GradeDistributionChart } from '@/components/dashboard/GradeDistributionChart'
import { CGPACard } from '@/components/dashboard/CGPACard'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { Award, TrendingUp, Target } from 'lucide-react'
import { PageAnimationWrapper, AnimatedHeader, AnimatedSection, AnimatedStatsGrid } from '@/components/dashboard/PageAnimationWrapper'

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

  const {
    gpaBySemester,
    cgpaBySemester,
    gradeDistribution,
    performanceMetrics,
    creditsByYear,
    gpaByYear,
    subjectsByGrade,
  } = analytics

  return (
    <PageAnimationWrapper>
      {/* Enhanced Header with Gradient */}
      <AnimatedHeader>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-blue-500/20 to-purple-500/20 border border-primary/20 p-8 shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg backdrop-blur-sm">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Analytics</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive insights into your academic performance
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
            <Award className="h-64 w-64" />
          </div>
        </div>
      </AnimatedHeader>

      {/* Enhanced Key Metrics Grid */}
      <AnimatedStatsGrid>
        <Card className="border-blue-500/20 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Subjects</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Award className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-500">
                {performanceMetrics.totalSubjects}
              </div>
              <p className="text-xs text-muted-foreground">Across all semesters</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Credits</CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-500">
                {performanceMetrics.totalCredits}
              </div>
              <p className="text-xs text-muted-foreground">Cumulative credits earned</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Credits/Semester</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-500">
                {performanceMetrics.averageCreditsPerSemester.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">Average workload</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Semesters</CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Award className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-500">
                {gpaBySemester.length}
              </div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </div>
          </CardContent>
        </Card>
      </AnimatedStatsGrid>

      {/* Enhanced CGPA Overview and Best/Worst Performance */}
      <AnimatedSection delay={0.2}>
        <div className="grid gap-6 md:grid-cols-3">
          <CGPACard
            cgpa={performanceMetrics.cgpa}
            totalCredits={performanceMetrics.totalCredits}
            className="md:col-span-1"
          />

          {/* Enhanced Best & Worst Semester Cards */}
          <div className="space-y-4 md:col-span-2">
            {performanceMetrics.bestSemester && (
              <Card className="border-green-500/30 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Award className="h-5 w-5 text-success" />
                    </div>
                    Best Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">
                        {performanceMetrics.bestSemester.name}
                      </p>
                      <p className="text-4xl font-bold text-success">
                        {performanceMetrics.bestSemester.gpa.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">Outstanding achievement 🎉</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-success/30" />
                  </div>
                </CardContent>
              </Card>
            )}

            {performanceMetrics.worstSemester && (
              <Card className="border-yellow-500/30 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Target className="h-5 w-5 text-warning" />
                    </div>
                    Room for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">
                        {performanceMetrics.worstSemester.name}
                      </p>
                      <p className="text-4xl font-bold text-warning">
                        {performanceMetrics.worstSemester.gpa.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">Opportunity to grow 💪</p>
                    </div>
                    <Target className="h-12 w-12 text-warning/30" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Enhanced Charts Section */}
      <AnimatedSection delay={0.3}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="shadow-md rounded-lg overflow-hidden">
            <GPATrendChart data={gpaBySemester} cgpaData={cgpaBySemester} />
          </div>
          <div className="shadow-md rounded-lg overflow-hidden">
            <GradeDistributionChart data={gradeDistribution} />
          </div>
        </div>
      </AnimatedSection>

      {/* Enhanced GPA by Year */}
      {gpaByYear.length > 0 && (
        <AnimatedSection delay={0.4}>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Year-wise Performance
              </CardTitle>
              <CardDescription>Average GPA for each academic year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {gpaByYear.map((item) => {
                  const performance = item.gpa >= 8.5 ? 'excellent' : item.gpa >= 7.0 ? 'good' : item.gpa >= 6.0 ? 'average' : 'below-average'
                  const color = performance === 'excellent' ? 'bg-success' : performance === 'good' ? 'bg-info' : performance === 'average' ? 'bg-warning' : 'bg-error'
                  const textColor = performance === 'excellent' ? 'text-success' : performance === 'good' ? 'text-info' : performance === 'average' ? 'text-warning' : 'text-error'

                  return (
                    <div key={item.year} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{item.year}</span>
                        <span className={`text-lg font-bold ${textColor}`}>{item.gpa.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="w-full h-10 bg-secondary rounded-lg overflow-hidden shadow-inner">
                            <div
                              className={`h-full flex items-center justify-start px-4 text-white font-semibold text-sm ${color} transition-all duration-500 shadow-md`}
                              style={{ width: `${(item.gpa / 10) * 100}%` }}
                            >
                              {item.gpa >= 3 && item.gpa.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground w-24">
                          {creditsByYear.find((c) => c.year === item.year)?.credits || 0} credits
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}

      {/* Enhanced Detailed Grade Analysis */}
      {subjectsByGrade.length > 0 && (
        <AnimatedSection delay={0.5}>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Subjects by Grade
              </CardTitle>
              <CardDescription>Detailed breakdown of subjects for each grade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subjectsByGrade
                  .sort((a, b) => b.subjects.length - a.subjects.length)
                  .map((item, index) => {
                    const isTopGrade = index === 0
                    return (
                      <div key={item.grade} className={`space-y-3 p-4 rounded-lg border ${isTopGrade ? 'border-primary/30 bg-primary/5' : 'border-border/50 bg-muted/30'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${isTopGrade ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                              Grade {item.grade}
                            </span>
                            {isTopGrade && <span className="text-xs text-primary font-medium">Most Common</span>}
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground">
                            {item.subjects.length} subject{item.subjects.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.subjects.map((subject) => (
                            <span
                              key={subject}
                              className="px-3 py-1.5 bg-background border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
              </div>

            </CardContent>

          </Card>

        </AnimatedSection>
      )
      }
    </PageAnimationWrapper>
  )
}