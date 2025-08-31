'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Activity, ActivityType } from '@prisma/client'

type ActivityWithType = Activity & {
  type: ActivityType
}

// Roulette Actions
export async function selectRandomActivity() {
  try {
    // Get all active activities with their weights
    const activities: ActivityWithType[] = await prisma.activity.findMany({
      where: { isActive: true },
      include: { type: true }
    })

    if (activities.length === 0) {
      throw new Error('No active activities found')
    }

    // Create weighted selection
    const weightedActivities: string[] = []

    activities.forEach((activity: ActivityWithType) => {
      // Ensure minimum weight of 1, and scale weights
      const effectiveWeight = Math.max(1, activity.weight)

      // Add activity ID multiple times based on weight
      for (let i = 0; i < effectiveWeight; i++) {
        weightedActivities.push(activity.id)
      }
    })

    // Select random activity
    const randomIndex = Math.floor(Math.random() * weightedActivities.length)
    const selectedActivityId = weightedActivities[randomIndex]

    const selectedActivity = activities.find((a: ActivityWithType) => a.id === selectedActivityId)!

    // Don't log here - just return the selected activity
    return {
      activity: selectedActivity
    }
  } catch (error) {
    console.error('Error selecting random activity:', error)
    throw new Error('Failed to select random activity')
  }
}

export async function logActivity(activityId: string) {
  try {
    const activityLog = await prisma.activityLog.create({
      data: {
        activityId: activityId
      },
      include: {
        activity: {
          include: {
            type: true
          }
        }
      }
    })

    revalidatePath('/roulette')
    return {
      id: activityLog.id,
      activity: activityLog.activity,
      selectedAt: activityLog.selectedAt,
      timeSpentMinutes: activityLog.timeSpentMinutes,
      satisfaction: activityLog.satisfaction,
      notes: activityLog.notes
    }
  } catch (error) {
    console.error('Error logging activity:', error)
    throw new Error('Failed to log activity')
  }
}

export async function logActivityTime(formData: FormData) {
  const logId = formData.get('logId') as string
  const timeSpentMinutes = parseInt(formData.get('timeSpentMinutes') as string)
  const notes = formData.get('notes') as string

  if (!logId) {
    throw new Error('Log ID is required')
  }

  if (isNaN(timeSpentMinutes) || timeSpentMinutes < 0) {
    throw new Error('Time spent must be a positive number')
  }

  try {
    await prisma.activityLog.update({
      where: { id: logId },
      data: {
        timeSpentMinutes,
        notes: notes?.trim() || null
      }
    })

    revalidatePath('/tracking')
  } catch (error) {
    console.error('Error logging activity time:', error)
    throw new Error('Failed to log activity time')
  }
}

export async function updateActivityLog(
  logId: string,
  timeSpentMinutes: number | null,
  satisfaction: number | null
) {
  try {
    const updatedLog = await prisma.activityLog.update({
      where: { id: logId },
      data: {
        timeSpentMinutes,
        satisfaction
      },
      include: {
        activity: {
          include: {
            type: true
          }
        }
      }
    })

    revalidatePath('/roulette')
    return {
      id: updatedLog.id,
      activity: updatedLog.activity,
      selectedAt: updatedLog.selectedAt,
      timeSpentMinutes: updatedLog.timeSpentMinutes,
      satisfaction: updatedLog.satisfaction,
      notes: updatedLog.notes
    }
  } catch (error) {
    console.error('Error updating activity log:', error)
    throw new Error('Failed to update activity log')
  }
}
