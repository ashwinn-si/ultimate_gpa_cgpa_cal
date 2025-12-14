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
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { updateSubject } from '@/app/actions/subjects'
import { getGradeConfigs } from '@/app/actions/grades'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { LoadingOverlay } from '@/components/shared/LoadingOverlay'

interface EditSubjectButtonProps {
  subjectId: string
  semesterId: string
  currentName: string
  currentGrade: string
  currentGradePoints: number
  currentCredits: number
}

export function EditSubjectButton({
  subjectId,
  semesterId,
  currentName,
  currentGrade,
  currentGradePoints,
  currentCredits,
}: EditSubjectButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingGrades, setLoadingGrades] = useState(false)
  const [gradeConfigs, setGradeConfigs] = useState<any[]>([])

  const [name, setName] = useState(currentName)
  const [selectedGrade, setSelectedGrade] = useState(currentGrade)
  const [credits, setCredits] = useState(currentCredits.toString())

  // Reset form when dialog opens or current values change
  useEffect(() => {
    setName(currentName)
    setSelectedGrade(currentGrade)
    setCredits(currentCredits.toString())
  }, [currentName, currentGrade, currentCredits, open])

  useEffect(() => {
    async function loadGrades() {
      setLoadingGrades(true)
      try {
        const configs = await getGradeConfigs()
        setGradeConfigs(configs)
      } catch (error) {
        console.error('Failed to load grade configs:', error)
        toast.error('Failed to load grade configurations')
      } finally {
        setLoadingGrades(false)
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

      await updateSubject(subjectId, semesterId, {
        name,
        grade: selectedGrade,
        gradePoints: gradeConfig.points,
        credits: parseFloat(credits),
      })

      toast.success('Subject updated successfully!')
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update subject')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4 mr-1" />
        Edit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update the subject information. Changes will recalculate your semester GPA.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Subject Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Mathematics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-grade">Grade</Label>
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
                <Label htmlFor="edit-credits">Credits</Label>
                <Input
                  id="edit-credits"
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
            {loadingGrades && <LoadingOverlay message="Loading grades..." />}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !selectedGrade || loadingGrades}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Subject'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
