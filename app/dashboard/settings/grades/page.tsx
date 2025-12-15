import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getGradeConfigs } from '@/app/actions/grades'
import { Plus, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { AddGradeButton } from '@/components/grades/AddGradeButton'
import { EditGradeButton } from '@/components/grades/EditGradeButton'
import { DeleteGradeButton } from '@/components/grades/DeleteGradeButton'
import { PageAnimationWrapper, AnimatedHeader, AnimatedSection } from '@/components/dashboard/PageAnimationWrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Grade System | GPA Tracker',
  description: 'Configure and manage your grading system. Set up grade names, point values, and customize your grading scale to match your institution.',
  keywords: ['grade system', 'grading scale', 'grade configuration', 'grade points', 'custom grades'],
  openGraph: {
    title: 'Grade System | GPA Tracker',
    description: 'Configure and manage your grading system and scale.',
    type: 'website',
  },
}

export default async function GradesPage() {
  const gradeConfigs = await getGradeConfigs()

  return (
    <PageAnimationWrapper>
      {/* Enhanced Header with Gradient */}
      <AnimatedHeader>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 border border-green-500/20 p-8 shadow-lg">
          <div className="relative z-10">
            <Link
              href="/dashboard/settings"
              className="text-sm text-muted-foreground hover:text-foreground mb-3 inline-flex items-center group"
            >
              <ArrowLeft className="mr-1 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
              Back to Settings
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/10 rounded-lg backdrop-blur-sm">
                    <Plus className="h-8 w-8 text-green-500" />
                  </div>
                  <h1 className="text-4xl font-bold">Grade System</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                  Manage your grading scale and grade configurations
                </p>
              </div>
              <AddGradeButton />
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10">
            <Plus className="h-64 w-64" />
          </div>
        </div>

        {/* Enhanced Info Card */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950 shadow-md">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg h-fit">
                <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Grade Configuration
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  These grades are used when adding subjects to your semesters. Each grade represents a grade point value on a 10-point scale.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Grades Table */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Your Grades</CardTitle>
                <CardDescription className="mt-1">
                  {gradeConfigs.length} grade{gradeConfigs.length !== 1 ? 's' : ''} configured
                </CardDescription>
              </div>
              {gradeConfigs.length > 0 && <AddGradeButton />}
            </div>
          </CardHeader>
          <CardContent>
            {gradeConfigs.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <div className="mx-auto w-fit p-4 bg-primary/10 rounded-full mb-4">
                  <Plus className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No grades configured yet</h3>
                <p className="text-muted-foreground mb-6">Add your first grade to start using the grade system</p>
                <AddGradeButton />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Grade</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Points</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Type</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeConfigs.map((grade: any) => (
                      <tr key={grade.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                            {grade.name}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">{grade.points.toFixed(2)}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {grade.description || '-'}
                        </td>
                        <td className="py-3 px-4">
                          {grade.is_default ? (
                            <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                              Default
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                              Custom
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <EditGradeButton
                              gradeId={grade.id}
                              currentName={grade.name}
                              currentPoints={grade.points}
                              currentDescription={grade.description || ''}
                            />
                            <DeleteGradeButton
                              gradeId={grade.id}
                              gradeName={grade.name}
                              isDefault={grade.is_default}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedHeader>
    </PageAnimationWrapper>
  )
}
