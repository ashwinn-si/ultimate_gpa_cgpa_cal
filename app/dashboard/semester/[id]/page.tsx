import { getSemesterById } from '@/app/actions/semesters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, BookOpen, Award, ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import { calculateSemesterGPA } from '@/lib/utils/calculations'
import { AddSubjectButton } from '@/components/subject/AddSubjectButton'
import { EditSubjectButton } from '@/components/subject/EditSubjectButton'
import { DeleteSubjectButton } from '@/components/subject/DeleteSubjectButton'
import { DeleteSemesterButton } from '@/components/semester/DeleteSemesterButton'
import { EditSemesterButton } from '@/components/semester/EditSemesterButton'
import { PageAnimationWrapper, AnimatedHeader, AnimatedSection } from '@/components/dashboard/PageAnimationWrapper'
import { Metadata } from 'next'

interface SemesterDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: SemesterDetailPageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const semester = await getSemesterById(id) as any
    return {
      title: `${semester.name} | GPA Tracker`,
      description: `View and manage subjects for ${semester.name} (${semester.year}). Track grades, credits, and GPA for this semester.`,
      keywords: ['semester detail', 'semester subjects', 'semester gpa', 'subject management'],
      openGraph: {
        title: `${semester.name} | GPA Tracker`,
        description: `View and manage subjects for ${semester.name} (${semester.year}).`,
        type: 'website',
      },
    }
  } catch (error) {
    return {
      title: 'Semester Details | GPA Tracker',
      description: 'View semester details, subjects, and grades.',
    }
  }
}

export default async function SemesterDetailPage({ params }: SemesterDetailPageProps) {
  const { id } = await params
  const semesterData = await getSemesterById(id)
  const semester = semesterData as any

  if (!semester) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold mb-2">Semester not found</h2>
        <p className="text-muted-foreground mb-4">This semester doesn't exist or you don't have access to it.</p>
        <Link href="/dashboard/semesters">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Semesters
          </Button>
        </Link>
      </div>
    )
  }

  const subjects = semester.subjects || []
  const gpa = calculateSemesterGPA(subjects)

  // Calculate total credits and credit scored
  let totalCredits = 0
  let creditScored = 0

  for (const subject of subjects) {
    const gradePoints = subject.grade_points ?? 0
    const credits = subject.credits ?? 0
    totalCredits += credits * 10  // Total credit = credits × 10
    creditScored += gradePoints * credits  // Credit scored = grade_points × credits
  }

  const performanceLevel = gpa >= 8.5 ? 'Excellent' : gpa >= 7.0 ? 'Good' : gpa >= 6.0 ? 'Average' : 'Needs Improvement'
  const performanceColor = gpa >= 8.5 ? 'text-success' : gpa >= 7.0 ? 'text-info' : gpa >= 6.0 ? 'text-warning' : 'text-error'
  const performanceBg = gpa >= 8.5 ? 'from-green-500/20 to-emerald-500/20' : gpa >= 7.0 ? 'from-blue-500/20 to-cyan-500/20' : gpa >= 6.0 ? 'from-yellow-500/20 to-orange-500/20' : 'from-red-500/20 to-pink-500/20'

  return (
    <PageAnimationWrapper>
      {/* Enhanced Header with Gradient */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${performanceBg} border border-primary/20 p-6 shadow-lg`}>
        <div className="relative z-10">
          <Link href="/dashboard/semesters" className="text-sm text-muted-foreground hover:text-foreground mb-3 inline-flex items-center group">
            <ArrowLeft className="mr-1 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Semesters
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{semester.name}</h1>
              <p className="text-muted-foreground text-lg">
                {semester.year} {semester.term && `• ${semester.term}`}
              </p>
              <div className={`inline-flex items-center mt-3 px-3 py-1.5 rounded-full text-sm font-semibold ${performanceColor} bg-background/80 backdrop-blur-sm`}>
                {performanceLevel} • {gpa.toFixed(2)} GPA
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EditSemesterButton
                semesterId={id}
                currentName={semester.name}
                variant="outline"
              />
              <DeleteSemesterButton
                semesterId={id}
                semesterName={semester.name}
                subjectCount={subjects.length}
                variant="outline"
              />
              <AddSubjectButton semesterId={id} />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10">
          <Award className="h-48 w-48" />
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="border-primary/20 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Semester GPA</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-4xl font-bold ${performanceColor}`}>
                {gpa.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {creditScored.toFixed(1)} ÷ {totalCredits.toFixed(1)} credits
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Credits</CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-500">
                {totalCredits.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                {subjects.length} subjects × 10
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Credit Scored</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Award className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-500">
                {creditScored.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                Grade points × credits
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Subjects Table */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Subjects</CardTitle>
              <CardDescription className="mt-1">
                {subjects.length === 0
                  ? 'No subjects added yet'
                  : `${subjects.length} subject${subjects.length !== 1 ? 's' : ''} in this semester`}
              </CardDescription>
            </div>
            {subjects.length > 0 && <AddSubjectButton semesterId={id} variant="outline" />}
          </div>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <div className="mx-auto w-fit p-4 bg-primary/10 rounded-full mb-4">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No subjects yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Add your first subject to start tracking your grades and calculating your GPA.
              </p>
              <AddSubjectButton semesterId={id} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm">Subject Name</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Grade</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Grade Points</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Credits</th>
                    <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject: any) => (
                    <tr key={subject.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">{subject.name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {subject.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4">{subject.grade_points.toFixed(2)}</td>
                      <td className="py-3 px-4">{subject.credits.toFixed(1)}</td>
                      <td className="py-3 px-4 text-right">
                        <EditSubjectButton
                          subjectId={subject.id}
                          semesterId={id}
                          currentName={subject.name}
                          currentGrade={subject.grade}
                          currentGradePoints={subject.grade_points}
                          currentCredits={subject.credits}
                        />
                        <DeleteSubjectButton
                          subjectId={subject.id}
                          semesterId={id}
                          subjectName={subject.name}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageAnimationWrapper>

  )
}
