import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import RouletteClient from './roulette-client'

export default async function RoulettePage() {
  // Haal alle actieve activiteiten op
  const activities = await prisma.activity.findMany({
    where: {
      isActive: true
    },
    include: {
      type: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  // Als er geen actieve activiteiten zijn, redirect naar beheer
  if (activities.length === 0) {
    redirect('/manage/activities')
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#d4c4a8' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#282C44' }}>
            🎯 YourTimeRoulette
          </h1>
          <p className="text-lg" style={{ color: '#282C44' }}>
            Laat het toeval beslissen wat je volgende activiteit wordt!
          </p>
        </div>

        <RouletteClient activities={activities} />
      </div>
    </div>
  )
}
