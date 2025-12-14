import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { getGradeConfigs } from '@/app/actions/grades'
import { Palette, Award, User, LogOut, Plus } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const gradeConfigs = await getGradeConfigs()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the app looks</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Grade System */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Grade System</CardTitle>
                  <CardDescription>Configure your grading scale ({gradeConfigs.length} grades)</CardDescription>
                </div>
              </div>
              <Link href="/dashboard/settings/grades">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Manage Grades
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium mb-3">Current Grade Scale:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {gradeConfigs.slice(0, 8).map((grade: any) => (
                  <div key={grade.id} className="flex items-center justify-between px-3 py-2 rounded-md border bg-muted/50">
                    <span className="font-medium">{grade.name}</span>
                    <span className="text-sm text-muted-foreground">{grade.points.toFixed(1)}</span>
                  </div>
                ))}
              </div>
              {gradeConfigs.length > 8 && (
                <p className="text-xs text-muted-foreground mt-2">
                  +{gradeConfigs.length - 8} more grades
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email || 'Not available'}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">User ID</p>
              <p className="text-sm text-muted-foreground font-mono text-xs">{user?.id || 'Not available'}</p>
            </div>
            <div className="pt-4 border-t">
              <form action="/auth/signout" method="post">
                <Button type="submit" variant="destructive" className="w-full sm:w-auto">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Decimal Precision</p>
                <p className="text-sm text-muted-foreground">Number of decimal places for GPA</p>
              </div>
              <p className="text-sm font-medium">2</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Default Grading System</p>
                <p className="text-sm text-muted-foreground">10-point scale</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
