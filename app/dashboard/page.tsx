import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, BookOpen, Award, Target, GraduationCap, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { calculateCGPA, getPerformanceLevel } from '@/lib/utils/calculations'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: semesters } = await supabase
    .from('semesters')
    .select('*, subjects(*)')

  // Sort semesters lexically by year (descending) then by name (ascending)
  const allSemesters = ((semesters as any) || []).sort((a: any, b: any) => {
    // First sort by year (descending - most recent first)
    if (b.year !== a.year) {
      return b.year - a.year
    }
    // Then sort by name (ascending - alphabetically)
    return a.name.localeCompare(b.name)
  })

  // Calculate total credits and credit scored
  let totalCredits = 0
  let totalCreditScored = 0

  for (const semester of allSemesters) {
    if (semester.subjects && semester.subjects.length > 0) {
      for (const subject of semester.subjects) {
        const gradePoints = subject.grade_points ?? 0
        const credits = subject.credits ?? 0

        // Total credit = credits × 10 (max possible)
        totalCredits += credits * 10
        // Credit scored = grade_points × credits
        totalCreditScored += gradePoints * credits
      }
    }
  }

  const performance = getPerformanceLevel(cgpa)
  const avgCreditsPerSemester = allSemesters.length > 0
    ? (allSemesters.reduce((sum: number, s: any) => sum + (s.total_credits || 0), 0) / allSemesters.length).toFixed(1)
    : 0

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 border border-primary/20 p-8 shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Track your academic excellence
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/dashboard/semester/new">
              <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                <Plus className="mr-2 h-5 w-5" />
                Add New Semester
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
          <Sparkles className="h-64 w-64" />
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall CGPA</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-4xl font-bold ${performance.color}`}>
                {cgpa.toFixed(2)}
              </div>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${performance.bgColor} ${performance.color}`}>
                {performance.level}
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                {totalCreditScored.toFixed(1)} / {totalCredits.toFixed(1)} credits scored
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Credits</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-500">
                {totalCredits.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">
       div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Your Semesters</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sorted by year and name • {allSemesters.length} total
                    </p>
                  </div>
                </div>

                {allSemesters.length === 0 ? (
                  <Card className="border-dashed border-2">
                    <CardContent className="py-16">
                      <div className="text-center">
                        <div className="mx-auto w-fit p-4 bg-primary/10 rounded-full mb-4">
                          <BookOpen className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No semesters yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                          Start your academic journey by adding your first semester and tracking your performance
                        </p>
                        <Link href="/dashboard/semester/new">
                          <Button size="lg" className="shadow-md">
                            <Plus className="mr-2 h-5 w-5" />
                            Add Your First Semester
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {allSemesters.map((semester: any) => {
                      const semesterPerformance = getPerformanceLevel(semester.gpa || 0)
                      return (
                        <Link key={semester.id} href={`/dashboard/semester/${semester.id}`}>
                          <Card className="group hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden relative">
                            <div className={`absolute top-0 left-0 right-0 h-1.5 ${semesterPerformance.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                    {semester.name}
                                  </CardTitle>
                                  <CardDescription className="mt-1.5 flex items-center gap-2">
                                    <span className="font-medium">{semester.year}</span>
                                    {semester.term && (
                                      <>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span className="capitalize">{semester.term}</span>
                                      </>
                                    )}
                                  </CardDescription>
                                </div>
                                <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${semesterPerformance.bgColor} ${semesterPerformance.color}`}>
                                  {semester.gpa?.toFixed(2) || 'N/A'}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">GPA Score</p>
                                  <p className={`text-2xl font-bold ${semesterPerformance.color}`}>
                                    {semester.gpa?.toFixed(2) || 'N/A'}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Credits</p>
                                  <p className="text-2xl font-bold text-blue-500">
                                    {semester.total_credits || 0}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <BookOpen className="h-4 w-4" />
                                  <span>{semester.subjects?.length || 0} subjects</span>
                                </div>
                                <div className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                  View Details →
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </divmesters List */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Semesters</CardTitle>
                  <CardDescription>
                    View and manage all your academic semesters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {allSemesters.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No semesters yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Get started by adding your first semester
                      </p>
                      <Link href="/dashboard/semester/new">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Semester
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {allSemesters.map((semester: any) => (
                        <Link key={semester.id} href={`/dashboard/semester/${semester.id}`}>
                          <Card className="hover:border-primary transition-colors cursor-pointer">
                            <CardHeader>
                              <CardTitle className="text-lg">{semester.name}</CardTitle>
                              <CardDescription>
                                {semester.year} {semester.term && `• ${semester.term}`}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">GPA</span>
                                  <span className="text-sm font-medium">{semester.gpa?.toFixed(2) || "nNA"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Credits</span>
                                  <span className="text-sm font-medium">{semester.total_credits}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Subjects</span>
                                  <span className="text-sm font-medium">{semester.subjects?.length || 0}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            )
}
