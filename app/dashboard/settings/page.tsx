import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { getGradeConfigs } from '@/app/actions/grades'
import { Palette, Award, User, LogOut, Plus } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { PageAnimationWrapper, AnimatedHeader, AnimatedSection } from '@/components/dashboard/PageAnimationWrapper'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const gradeConfigs = await getGradeConfigs()

  return (
    <PageAnimationWrapper>
      {/* Enhanced Header with Gradient */}
      <AnimatedHeader>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 border border-primary/20 p-6 md:p-8 shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg backdrop-blur-sm">
                <Palette className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
            <User className="h-64 w-64" />
          </div>
        </div>

        <div className="grid gap-6">
          {/* Enhanced Appearance Card */}
          <Card className="shadow-md hover:shadow-lg transition-all border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Appearance</CardTitle>
                  <CardDescription>Customize how the app looks</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold">Theme</p>
                  <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Grade System Card */}
          <Card className="shadow-md hover:shadow-lg transition-all border-green-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Award className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Grade System</CardTitle>
                    <CardDescription>Configure your grading scale ({gradeConfigs.length} grades)</CardDescription>
                  </div>
                </div>
                <Link href="/dashboard/settings/grades">
                  <Button variant="outline" size="sm" className="hover:bg-green-500/10">
                    <Plus className="h-4 w-4 mr-1" />
                    Manage Grades
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm font-semibold mb-3">Current Grade Scale:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {gradeConfigs.slice(0, 8).map((grade: any) => (
                    <div key={grade.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg border bg-gradient-to-br from-muted/50 to-muted/30 hover:border-primary/50 transition-colors">
                      <span className="font-semibold">{grade.name}</span>
                      <span className="text-sm font-medium text-primary">{grade.points.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
                {gradeConfigs.length > 8 && (
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    +{gradeConfigs.length - 8} more grades
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Account Card */}
          <Card className="shadow-md hover:shadow-lg transition-all border-blue-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <User className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Account</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold mb-1">Email</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'Not available'}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold mb-1">User ID</p>
                <p className="text-xs text-muted-foreground font-mono break-all">{user?.id || 'Not available'}</p>
              </div>
              <div className="pt-4 border-t">
                <form action="/auth/signout" method="post">
                  <Button type="submit" variant="destructive" className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Preferences Card */}
          <Card className="shadow-md hover:shadow-lg transition-all border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Award className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Preferences</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold">Decimal Precision</p>
                  <p className="text-sm text-muted-foreground">Number of decimal places for GPA</p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-lg">2</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold">Default Grading System</p>
                  <p className="text-sm text-muted-foreground">10-point scale</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedHeader>
    </PageAnimationWrapper>
  )
}
