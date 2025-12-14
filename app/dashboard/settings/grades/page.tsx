import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getGradeConfigs } from '@/app/actions/grades'
import { Plus, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { AddGradeButton } from '@/components/grades/AddGradeButton'
import { EditGradeButton } from '@/components/grades/EditGradeButton'
import { DeleteGradeButton } from '@/components/grades/DeleteGradeButton'

export default async function GradesPage() {
  const gradeConfigs = await getGradeConfigs()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/settings"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold">Grade System</h1>
          <p className="text-muted-foreground">Manage your grading scale and grade configurations</p>
        </div>
        <AddGradeButton />
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Grade Configuration
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                These grades are used when adding subjects to your semesters. Each grade represents a grade point value on a 10-point scale.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Grades</CardTitle>
          <CardDescription>
            {gradeConfigs.length} grade{gradeConfigs.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gradeConfigs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No grades configured yet.</p>
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
    </div>
  )
}
