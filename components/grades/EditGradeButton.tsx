'use client'

import { useState, useEffect, useTransition } from 'react'
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
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { updateGradeConfig } from '@/app/actions/grades'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

interface EditGradeButtonProps {
  gradeId: string
  currentName: string
  currentPoints: number
  currentDescription?: string
}

export function EditGradeButton({
  gradeId,
  currentName,
  currentPoints,
  currentDescription = '',
}: EditGradeButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState(currentName)
  const [points, setPoints] = useState(currentPoints.toString())
  const [description, setDescription] = useState(currentDescription)

  // Reset form when dialog opens or current values change
  useEffect(() => {
    setName(currentName)
    setPoints(currentPoints.toString())
    setDescription(currentDescription)
  }, [currentName, currentPoints, currentDescription, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !points) {
      toast.error('Grade name and points are required')
      return
    }

    startTransition(async () => {
      try {
        await updateGradeConfig(gradeId, {
          name: name.trim(),
          points: parseFloat(points),
          description: description.trim() || undefined,
        })

        toast.success('Grade updated successfully!')
        setOpen(false)
        router.refresh()
      } catch (error: any) {
        toast.error(error.message || 'Failed to update grade')
      }
    })
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Pencil className="h-4 w-4 mr-1" />
        Edit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Grade</DialogTitle>
            <DialogDescription>
              Update the grade configuration.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">
                    Grade Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    placeholder="e.g., A+, B, C"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-points">
                    Points (0-10) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-points"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="9.0"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  placeholder="e.g., Excellent"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !name || !points}>
                {isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Grade'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
