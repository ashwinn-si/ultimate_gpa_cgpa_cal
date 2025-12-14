'use client'

import { useState, useTransition } from 'react'
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
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { createGradeConfig } from '@/app/actions/grades'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

export function AddGradeButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState('')
  const [points, setPoints] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !points) {
      toast.error('Grade name and points are required')
      return
    }

    startTransition(async () => {
      try {
        await createGradeConfig({
          name: name.trim(),
          points: parseFloat(points),
          description: description.trim() || undefined,
        })

        toast.success('Grade created successfully!')
        setOpen(false)

        // Reset form
        setName('')
        setPoints('')
        setDescription('')

        router.refresh()
      } catch (error: any) {
        toast.error(error.message || 'Failed to create grade')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Grade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Grade</DialogTitle>
          <DialogDescription>
            Create a new grade configuration for your grading system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Grade Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., A+, B, C"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">
                  Points (0-10) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="points"
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
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Excellent"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={100}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">*</span> Required fields
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name || !points}>
              {isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                'Create Grade'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
