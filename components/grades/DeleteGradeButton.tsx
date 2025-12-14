'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deleteGradeConfig } from '@/app/actions/grades'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

interface DeleteGradeButtonProps {
  gradeId: string
  gradeName: string
  isDefault: boolean
}

export function DeleteGradeButton({
  gradeId,
  gradeName,
  isDefault,
}: DeleteGradeButtonProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteGradeConfig(gradeId)
        toast.success('Grade deleted successfully')
        setOpen(false)
        router.refresh()
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete grade')
      }
    })
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Grade</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the grade "{gradeName}"?
              {isDefault && (
                <span className="block mt-2 font-semibold text-orange-600 dark:text-orange-400">
                  This is a default grade. You can recreate it by resetting to default grades.
                </span>
              )}
              <span className="block mt-2">
                This action cannot be undone.
              </span>
              <span className="block mt-2 font-semibold text-blue-600 dark:text-blue-400">
                If any subjects are using this grade, they will be automatically reassigned to your second-highest grade.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Grade'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
