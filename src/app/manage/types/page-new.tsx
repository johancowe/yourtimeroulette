import { prisma } from '@/lib/prisma'
import TypesClient from './types-client'
import type { ActivityType } from '@prisma/client'
import type { Metadata } from 'next'

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
    const activityTypes: ActivityTypeWithCount[] = await prisma.activityType.findMany({
        include: {
            _count: {
                select: { activities: true }
            }
        },
        orderBy: { name: 'asc' }
    })

    return <TypesClient initialActivityTypes={activityTypes} />
}
