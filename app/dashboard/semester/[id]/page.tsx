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

interface SemesterDetailPageProps {
  params: Promise<{
    id: string
  }>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/semesters" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-flex items-center">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to Semesters
          </Link>
          <h1 className="text-3xl font-bold">{semester.name}</h1>
          <p className="text-muted-foreground">
            {semester.year} {semester.term && `• ${semester.term}`}
          </p>
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Semester GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gpa.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {creditScored.toFixed(1)} ÷ {totalCredits.toFixed(1)}
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
              {subjects.length} subjects × 10
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Scored</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditScored.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Grade points × credits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
          <CardDescription>
            {subjects.length === 0
              ? 'No subjects added yet'
              : `${subjects.length} subject${subjects.length !== 1 ? 's' : ''} in this semester`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No subjects added yet. Add your first subject to start tracking your grades.
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
    </div>
  )
}
