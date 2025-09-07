'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/server-auth'

// Activity Type Actions
export async function createActivityType(formData: FormData) {
  const user = await getCurrentUser()

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name?.trim()) {
    throw new Error('Name is required')
  }

  try {
    await prisma.activityType.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        userId: user.id
      }
    })

    revalidatePath('/manage/types')
  } catch (error) {
    console.error('Error creating activity type:', error)
    throw new Error('Failed to create activity type')
  }

  redirect('/manage/types')
}

export async function updateActivityType(formData: FormData) {
  const user = await getCurrentUser()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!id || !name?.trim()) {
    throw new Error('ID and name are required')
  }

  try {
    // Verify that the activity type belongs to the current user
    const activityType = await prisma.activityType.findFirst({
      where: {
        id,
        userId: user.id
      }
    })

    if (!activityType) {
      throw new Error('Activity type not found')
    }

    await prisma.activityType.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null
      }
    })

    revalidatePath('/manage/types')
  } catch (error) {
    console.error('Error updating activity type:', error)
    throw new Error('Failed to update activity type')
  }
}

export async function deleteActivityType(formData: FormData) {
  const user = await getCurrentUser()

  const id = formData.get('id') as string

  if (!id) {
    throw new Error('ID is required')
  }

  try {
    // Verify that the activity type belongs to the current user
    const activityType = await prisma.activityType.findFirst({
      where: {
        id,
        userId: user.id
      }
    })

    if (!activityType) {
      throw new Error('Activity type not found')
    }

    await prisma.activityType.delete({
      where: { id }
    })

    revalidatePath('/manage/types')
  } catch (error) {
    console.error('Error deleting activity type:', error)
    throw new Error('Failed to delete activity type')
  }
}
