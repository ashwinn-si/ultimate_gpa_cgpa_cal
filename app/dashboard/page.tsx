import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, BookOpen, Award } from 'lucide-react'
import Link from 'next/link'
import { calculateCGPA } from '@/lib/utils/calculations'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: semesters } = await supabase
    .from('semesters')
    .select('*, subjects(*)')
    .order('year', { ascending: false })
    .order('order', { ascending: true })

  const allSemesters = semesters || []
  const cgpa = calculateCGPA(allSemesters as any)
  const totalCredits = allSemesters.reduce((sum, sem) => sum + sem.total_credits, 0)

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
              Out of 10.00
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits}</div>
            <p className="text-xs text-muted-foreground">
              Credits completed
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cgpa >= 8.5 ? 'Excellent' : cgpa >= 7 ? 'Good' : cgpa >= 6 ? 'Average' : 'Below Average'}
            </div>
            <p className="text-xs text-muted-foreground">
              Current standing
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
              {allSemesters.map((semester) => (
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
