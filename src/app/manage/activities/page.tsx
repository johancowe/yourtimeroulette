import { prisma } from '@/lib/prisma'
import ActivitiesClient from './activities-client'
import type { Activity, ActivityType } from '@prisma/client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Activiteiten Beheer - YourTimeRoulette",
  description: "Beheer je favoriete activiteiten, voeg nieuwe toe en bewerk bestaande.",
}

type ActivityWithType = Activity & {
  type: ActivityType
}

export default async function ActivitiesPage() {
  const [activities, activityTypes]: [ActivityWithType[], ActivityType[]] = await Promise.all([
    prisma.activity.findMany({
      include: { type: true },
      orderBy: { name: 'asc' }
    }),
    prisma.activityType.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  return (
    <ActivitiesClient
      initialActivities={activities}
      initialActivityTypes={activityTypes}
    />
  )
}
