import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, BookOpen, Award, Target } from 'lucide-react'
import Link from 'next/link'
import { calculateCGPA } from '@/lib/utils/calculations'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: semesters } = await supabase
    .from('semesters')
    .select('*, subjects(*)')
    .order('year', { ascending: false })
    .order('order', { ascending: true })

  const allSemesters = (semesters as any) || []

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

  // CGPA = (Credit Scored / Total Credit) × 10
  const cgpa = totalCredits > 0 ? (totalCreditScored / totalCredits) * 10 : 0

  totalCredits = parseFloat(totalCredits.toFixed(2))
  totalCreditScored = parseFloat(totalCreditScored.toFixed(2))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your academic overview</p>
        </div>
        <Link href="/dashboard/semester/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Semester
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall CGPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cgpa.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {totalCreditScored.toFixed(1)} ÷ {totalCredits.toFixed(1)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Credits × 10 (max possible)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credit Scored</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCreditScored.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Grade points × credits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Semesters</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allSemesters.length}</div>
            <p className="text-xs text-muted-foreground">
              Total semesters
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Semesters List */}
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
