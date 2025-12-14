'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createSemester } from '@/app/actions/semesters'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NewSemesterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [term, setTerm] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createSemester({
        name,
        year,
        term: term || undefined,
      })

      toast.success('Semester created successfully!')
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create semester')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Semester</h1>
        <p className="text-muted-foreground">Add a new semester to track your courses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semester Details</CardTitle>
          <CardDescription>Enter the information for your new semester</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Semester Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Fall 2024, Semester 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Choose a descriptive name for this semester
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                min="2000"
                max="2100"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Term (Optional)</Label>
              <select
                id="term"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              >
                <option value="">Select a term</option>
                <option value="fall">Fall</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="winter">Winter</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Semester'}
              </Button>
              <Link href="/" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
