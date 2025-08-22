'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteActivityType } from '@/lib/actions/activity-types'

interface DeleteButtonProps {
  id: string
  name: string
}

export function DeleteTypeButton({ id, name }: DeleteButtonProps) {
  const handleDelete = async () => {
    if (confirm(`Weet je zeker dat je "${name}" wilt verwijderen?`)) {
      const formData = new FormData()
      formData.append('id', id)
      await deleteActivityType(formData)
    }
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
