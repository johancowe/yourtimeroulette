'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteActivityLog(logId: string) {
  try {
    await prisma.activityLog.delete({
      where: {
        id: logId
      }
    })
    
    revalidatePath('/activity-log')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete activity log:', error)
    return { success: false, error: 'Failed to delete activity log' }
  }
}

export async function deleteActivityLogAction(formData: FormData) {
  const logId = formData.get('logId') as string
  if (!logId) return

  try {
    await prisma.activityLog.delete({
      where: {
        id: logId
      }
    })
    
    revalidatePath('/activity-log')
  } catch (error) {
    console.error('Failed to delete activity log:', error)
    throw new Error('Failed to delete activity log')
  }
}

export async function deleteAllActivityLogs() {
  try {
    await prisma.activityLog.deleteMany({})
    revalidatePath('/activity-log')
    redirect('/activity-log?deleted=true')
  } catch (error) {
    console.error('Failed to delete all activity logs:', error)
    throw new Error('Failed to delete all activity logs')
  }
}

export async function updateActivityLog(logId: string, data: {
  timeSpentMinutes?: number | null
  notes?: string | null
}) {
  try {
    await prisma.activityLog.update({
      where: {
        id: logId
      },
      data: {
        timeSpentMinutes: data.timeSpentMinutes,
        notes: data.notes,
        updatedAt: new Date()
      }
    })
    
    revalidatePath('/activity-log')
    redirect('/activity-log')
  } catch (error) {
    console.error('Failed to update activity log:', error)
    throw new Error('Failed to update activity log')
  }
}

export async function updateActivityLogAction(formData: FormData) {
  const logId = formData.get('logId') as string
  const timeSpentValue = formData.get('timeSpent') as string
  const satisfactionValue = formData.get('satisfaction') as string
  const notes = formData.get('notes') as string

  if (!logId) return

  try {
    const data: {
      timeSpentMinutes?: number | null
      satisfaction?: number | null
      notes?: string | null
    } = {}

    if (timeSpentValue && timeSpentValue.trim() !== '') {
      data.timeSpentMinutes = parseInt(timeSpentValue)
    }

    if (satisfactionValue && satisfactionValue.trim() !== '') {
      data.satisfaction = parseInt(satisfactionValue)
    }

    if (notes && notes.trim() !== '') {
      data.notes = notes.trim()
    } else {
      data.notes = null
    }

    await prisma.activityLog.update({
      where: {
        id: logId
      },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
    
    revalidatePath('/activity-log')
  } catch (error) {
    console.error('Failed to update activity log:', error)
    throw new Error('Failed to update activity log')
  }

  // Redirect outside try-catch to avoid catching the redirect error
  redirect('/activity-log')
}
