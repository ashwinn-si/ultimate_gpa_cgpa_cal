import { getSemesters } from '@/app/actions/semesters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function SemestersPage() {
  const semesters = await getSemesters()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Semesters</h1>
          <p className="text-muted-foreground">Manage all your academic semesters</p>
        </div>
        <Link href="/dashboard/semester/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Semester
          </Button>
        </Link>
      </div>

      {semesters.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No semesters found. Create your first semester to get started.</p>
            <Link href="/dashboard/semester/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Semester
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {semesters.map((semester) => (
            <Card key={semester.id} className="hover:border-primary transition-colors h-full">
              <Link href={`/dashboard/semester/${semester.id}`} className="block">
                <CardHeader>
                  <CardTitle>{semester.name}</CardTitle>
                  <CardDescription>
                    {semester.year} {semester.term && `• ${semester.term}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">GPA</span>
                      <span className="text-sm font-medium">{(semester.gpa ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Credits</span>
                      <span className="text-sm font-medium">{semester.total_credits ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Subjects</span>
                      <span className="text-sm font-medium">{semester.subjects?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
