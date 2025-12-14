'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deleteSemester } from '@/app/actions/semesters'
import { toast } from 'sonner'

interface DeleteSemesterButtonProps {
  semesterId: string
  semesterName: string
  subjectCount?: number
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  redirectAfterDelete?: boolean
}

export function DeleteSemesterButton({
  semesterId,
  semesterName,
  subjectCount = 0,
  variant = 'ghost',
  size = 'sm',
  redirectAfterDelete = true,
}: DeleteSemesterButtonProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteSemester(semesterId)
        toast.success('Semester deleted successfully')
        setOpen(false)

        if (redirectAfterDelete) {
          router.push('/dashboard/semesters')
        }
      } catch (error) {
        toast.error('Failed to delete semester')
        console.error(error)
      }
    })
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delete Semester</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{semesterName}"?
              {subjectCount > 0 && (
                <span className="block mt-2 font-semibold text-destructive">
                  This will also delete {subjectCount} subject{subjectCount !== 1 ? 's' : ''} associated with this semester.
                </span>
              )}
              <span className="block mt-2">
                This action cannot be undone and will permanently remove all data for this semester.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete Semester'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
