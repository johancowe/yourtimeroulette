import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import RouletteClient from './roulette-client'
import Link from 'next/link'

// Force dynamic rendering - no prerendering at build time
export const dynamic = 'force-dynamic'

export default async function RoulettePage() {
  try {
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
      <div className="min-h-screen p-4" style={{ backgroundColor: '#3d4a6b' }}>
        <div className="max-w-6xl mx-auto">
          <RouletteClient activities={activities} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Database connection error:', error)

    // Fallback UI when database is not available
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" style={{ backgroundColor: '#3d4a6b' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#e8d8b9' }}>
            Database Verbinding Probleem
          </h1>
          <p className="mb-4" style={{ color: '#e8d8b9' }}>
            Kan geen verbinding maken met de database. Probeer het later opnieuw.
          </p>
          <Link href="/" className="underline" style={{ color: '#e8d8b9' }}>
            Terug naar Home
          </Link>
        </div>
      </div>
    )
  }
}
