import { prisma } from '@/lib/prisma'
import TypesClient from './types-client'
import type { ActivityType } from '@prisma/client'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Categorieën Beheer - YourTimeRoulette",
  description: "Beheer de verschillende categorieën van activiteiten zoals 'Boek lezen' of 'Game spelen'.",
}

type ActivityTypeWithCount = ActivityType & {
  _count: {
    activities: number
  }
}

export default async function ActivityTypesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const activityTypes: ActivityTypeWithCount[] = await prisma.activityType.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      _count: {
        select: { activities: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  return <TypesClient initialActivityTypes={activityTypes} />
}
