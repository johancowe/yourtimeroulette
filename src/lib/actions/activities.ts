'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/server-auth'

// Activity Actions
export async function createActivity(formData: FormData) {
  const user = await getCurrentUser()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const typeId = formData.get('activityType') as string
  const weight = parseInt(formData.get('weight') as string)
  const isActive = formData.get('isActive') === 'on'

  if (!name?.trim() || !typeId) {
    throw new Error('Name and type are required')
  }

  if (isNaN(weight) || weight < 0 || weight > 100) {
    throw new Error('Weight must be a number between 0 and 100')
  }

  try {
    // Verify that the activity type belongs to the current user
    const activityType = await prisma.activityType.findFirst({
      where: {
        id: typeId,
        userId: user.id
      }
    })

    if (!activityType) {
      throw new Error('Invalid activity type')
    }

    await prisma.activity.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        typeId,
        userId: user.id,
        weight,
        isActive
      }
    })

    revalidatePath('/manage/activities')
  } catch (error) {
    console.error('Error creating activity:', error)
    throw new Error('Failed to create activity')
  }

  redirect('/manage/activities')
}

export async function updateActivity(formData: FormData) {
  const user = await getCurrentUser()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const typeId = formData.get('activityType') as string
  const weight = parseInt(formData.get('weight') as string)
  const isActive = formData.get('isActive') === 'on'

  if (!id || !name?.trim() || !typeId) {
    throw new Error('ID, name and type are required')
  }

  if (isNaN(weight) || weight < 0 || weight > 100) {
    throw new Error('Weight must be a number between 0 and 100')
  }

  try {
    // Verify that the activity belongs to the current user
    const activity = await prisma.activity.findFirst({
      where: {
        id,
        userId: user.id
      }
    })

    if (!activity) {
      throw new Error('Activity not found')
    }

    // Verify that the activity type belongs to the current user
    const activityType = await prisma.activityType.findFirst({
      where: {
        id: typeId,
        userId: user.id
      }
    })

    if (!activityType) {
      throw new Error('Invalid activity type')
    }

    await prisma.activity.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        typeId,
        weight,
        isActive
      }
    })

    revalidatePath('/manage/activities')
  } catch (error) {
    console.error('Error updating activity:', error)
    throw new Error('Failed to update activity')
  }
}

export async function deleteActivity(formData: FormData) {
  const id = formData.get('id') as string

  if (!id) {
    throw new Error('ID is required')
  }

  try {
    await prisma.activity.delete({
      where: { id }
    })

    revalidatePath('/manage/activities')
  } catch (error) {
    console.error('Error deleting activity:', error)
    throw new Error('Failed to delete activity')
  }
}

export async function toggleActivityStatus(formData: FormData) {
  const id = formData.get('id') as string

  if (!id) {
    throw new Error('ID is required')
  }

  try {
    const activity = await prisma.activity.findUnique({
      where: { id }
    })

    if (!activity) {
      throw new Error('Activity not found')
    }

    await prisma.activity.update({
      where: { id },
      data: {
        isActive: !activity.isActive
      }
    })

    revalidatePath('/manage/activities')
  } catch (error) {
    console.error('Error toggling activity status:', error)
    throw new Error('Failed to toggle activity status')
  }
}
