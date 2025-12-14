'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { createSubject } from '@/app/actions/subjects'
import { getGradeConfigs } from '@/app/actions/grades'
import { useRouter } from 'next/navigation'

interface AddSubjectButtonProps {
  semesterId: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function AddSubjectButton({ semesterId, variant = 'default', size = 'default' }: AddSubjectButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gradeConfigs, setGradeConfigs] = useState<any[]>([])

  const [name, setName] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  const [credits, setCredits] = useState('3')

  useEffect(() => {
    async function loadGrades() {
      try {
        const configs = await getGradeConfigs()
        setGradeConfigs(configs)
      } catch (error) {
        console.error('Failed to load grade configs:', error)
      }
    }
    if (open) {
      loadGrades()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const gradeConfig = gradeConfigs.find(g => g.name === selectedGrade)

      if (!gradeConfig) {
        toast.error('Please select a valid grade')
        return
      }

      await createSubject({
        semesterId,
        name,
        grade: selectedGrade,
        gradePoints: gradeConfig.points,
        credits: parseFloat(credits),
      })

      toast.success('Subject added successfully!')
      setOpen(false)
      setName('')
      setSelectedGrade('')
      setCredits('3')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to add subject')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Add a subject to this semester. Enter the subject name, grade, and credits.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name</Label>
              <Input
                id="name"
                placeholder="e.g., Mathematics"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeConfigs.map((grade) => (
                    <SelectItem key={grade.id} value={grade.name}>
                      {grade.name} - {grade.points.toFixed(2)} points
                      {grade.description && ` (${grade.description})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                step="0.5"
                min="0.5"
                max="10"
                placeholder="3.0"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter credits between 0.5 and 10 (in increments of 0.5)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedGrade}>
              {loading ? 'Adding...' : 'Add Subject'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
