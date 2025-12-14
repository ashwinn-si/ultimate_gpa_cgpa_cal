import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Calculator, TrendingUp, Award, BookOpen, Github } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  // Check if user is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-purple-500/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">CGPA Calculator</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Track Your Academic Success
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Calculate and monitor your GPA and CGPA across semesters with powerful analytics,
            beautiful visualizations, and secure cloud storage.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg">
                Start Calculating Free
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Calculator className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Accurate Calculations</CardTitle>
              <CardDescription>
                Weighted GPA and CGPA calculations with customizable grading systems
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Visualize your progress with interactive charts and trend analysis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Semester Management</CardTitle>
              <CardDescription>
                Organize subjects by semester and track credits efficiently
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>
                Understand your grade patterns with detailed distribution charts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Performance Badges</CardTitle>
              <CardDescription>
                Get instant feedback on your academic performance level
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Github className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Cloud Sync</CardTitle>
              <CardDescription>
                Access your data anywhere with secure Supabase cloud storage
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl p-12 border">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of students tracking their academic progress
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 CGPA Calculator. Built with Next.js and Supabase.</p>
        </div>
      </footer>
    </div>
  )
}
