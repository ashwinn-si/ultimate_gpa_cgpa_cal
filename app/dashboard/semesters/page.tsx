import { getSemesters } from '@/app/actions/semesters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil } from 'lucide-react'
import Link from 'next/link'
import { DeleteSemesterButton } from '@/components/semester/DeleteSemesterButton'
import { PageAnimationWrapper, AnimatedHeader, AnimatedSection } from '@/components/dashboard/PageAnimationWrapper'

export default async function SemestersPage() {
  const semesters = await getSemesters()

  return (
    <PageAnimationWrapper>
      {/* Enhanced Header with Gradient */}
      <AnimatedHeader>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-blue-500/20 to-cyan-500/20 border border-primary/20 p-6 md:p-8 shadow-lg mb-2">
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg backdrop-blur-sm">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-4xl font-bold">Semesters</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                  Manage all your academic semesters
                </p>
              </div>
              <Link href="/dashboard/semester/new">
                <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Semester
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10">
            <Plus className="h-64 w-64" />
          </div>
        </div>

        {semesters.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="text-center py-16">
              <div className="mx-auto w-fit p-4 bg-primary/10 rounded-full mb-4">
                <Plus className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No semesters yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                No semesters found. Create your first semester to get started.
              </p>
              <Link href="/dashboard/semester/new">
                <Button size="lg" className="shadow-md">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Semester
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {semesters.map((semester: any) => {
              const gpa = semester.gpa ?? 0
              const performanceColor = gpa >= 8.5 ? 'text-success' : gpa >= 7.0 ? 'text-info' : gpa >= 6.0 ? 'text-warning' : 'text-error'
              const performanceBg = gpa >= 8.5 ? 'bg-success/10' : gpa >= 7.0 ? 'bg-info/10' : gpa >= 6.0 ? 'bg-warning/10' : 'bg-error/10'

              return (
                <Card key={semester.id} className="hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col group shadow-md">
                  <Link href={`/dashboard/semester/${semester.id}`} className="flex-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">{semester.name}</CardTitle>
                          <CardDescription className="mt-1.5">
                            {semester.year} {semester.term && `• ${semester.term}`}
                          </CardDescription>
                        </div>
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${performanceBg} ${performanceColor}`}>
                          {gpa.toFixed(2)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                          <span className="text-sm text-muted-foreground">GPA</span>
                          <span className={`text-sm font-bold ${performanceColor}`}>{gpa.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                          <span className="text-sm text-muted-foreground">Credits</span>
                          <span className="text-sm font-bold text-blue-500">{semester.total_credits ?? 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                          <span className="text-sm text-muted-foreground">Subjects</span>
                          <span className="text-sm font-bold text-purple-500">{semester.subjects?.length || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                  <CardContent className="pt-0 border-t mt-auto">
                    <div className="flex items-center justify-end gap-2 mt-4">
                      <Link href={`/dashboard/semester/${semester.id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          <Pencil className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <DeleteSemesterButton
                        semesterId={semester.id}
                        semesterName={semester.name}
                        subjectCount={semester.subjects?.length || 0}
                        redirectAfterDelete={false}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </AnimatedHeader>
    </PageAnimationWrapper>
  )
}
