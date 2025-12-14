import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Theme settings coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade System</CardTitle>
            <CardDescription>Configure your grading scale</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Grade configuration coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Account settings coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
