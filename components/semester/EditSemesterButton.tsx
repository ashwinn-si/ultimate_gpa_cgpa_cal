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
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { updateSemester } from '@/app/actions/semesters'
import { useRouter } from 'next/navigation'

interface EditSemesterButtonProps {
  semesterId: string
  currentName: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function EditSemesterButton({
  semesterId,
  currentName,
  variant = 'ghost',
  size = 'sm',
}: EditSemesterButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(currentName)

  // Reset form when dialog opens or current value changes
  useEffect(() => {
    setName(currentName)
  }, [currentName, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate name is not empty
    if (!name.trim()) {
      toast.error('Semester name cannot be empty')
      return
    }

    setLoading(true)

    try {
      await updateSemester(semesterId, {
        name: name.trim(),
      })

      toast.success('Semester name updated successfully!')
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update semester name')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <Pencil className="h-4 w-4 mr-1" />
        Edit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Edit Semester Name</DialogTitle>
            <DialogDescription>
              Update the semester name. This will not affect your GPA calculations.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-semester-name">Semester Name</Label>
                <Input
                  id="edit-semester-name"
                  placeholder="e.g., Fall 2024"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(false)
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
