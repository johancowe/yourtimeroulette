import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { createActivityType, deleteActivityType } from '@/lib/actions/activity-types'
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

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#d4c4a8', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold px-2 py-2" style={{ color: '#3d4a6b' }}>
            Categorie Beheer
          </h1>
          <Link href="/">
            <Button variant="outline" className="border-2 font-semibold py-2 px-4 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#3d4a6b', color: '#d4c4a8', borderColor: '#3d4a6b' }}>
              ← Terug naar Home
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Create New Type Form */}
          <Card className="shadow-lg border-2 overflow-hidden" style={{ backgroundColor: '#e8d8b9', borderColor: '#3d4a6b' }}>
            <             <CardHeader className="py-6 m-0 p-6" style={{ backgroundColor: '#3d4a6b', color: '#e8d8b9', paddingTop: '1.65rem', paddingBottom: '1.65rem' }}>.Value -replace '#3d4a6b', '#1c2340' , color: '#e8d8b9', paddingTop: '1.65rem', paddingBottom: '1.65rem' }}>
              <CardTitle className="px-2 text-xl flex items-center justify-between" style={{ color: '#e8d8b9' }}>
                <span className="flex items-center gap-3">
                  <Plus className="h-6 w-6" />
                  Nieuwe Categorie Toevoegen
                </span>
                <span className="text-sm font-normal">
                  Voeg categorie toe
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <form action={createActivityType} className="space-y-3">
                <div>
                  <Label htmlFor="name" className="px-2 py-1 text-sm font-medium" style={{ color: '#3d4a6b' }}>Naam *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Bijv. Boek lezen"
                    required
                    className="border-2 py-2 px-3 mt-1"
                    style={{ borderColor: '#3d4a6b', backgroundColor: '#f2ecd9' }}
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="px-2 py-1 text-sm font-medium" style={{ color: '#3d4a6b' }}>Beschrijving</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Optionele beschrijving van deze categorie"
                    rows={2}
                    className="border-2 py-2 px-3 mt-1"
                    style={{ borderColor: '#3d4a6b', backgroundColor: '#f2ecd9' }}
                  />
                </div>
                <Button type="submit" className="w-full font-semibold py-3 px-4 border-2 hover:shadow-md transition-all duration-200 mt-4" style={{ backgroundColor: '#3d4a6b', color: '#d4c4a8', borderColor: '#3d4a6b' }}>
                  Categorie Toevoegen
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Types List */}
          <Card className="shadow-lg border-2 overflow-hidden" style={{ backgroundColor: '#e8d8b9', borderColor: '#3d4a6b' }}>
            <             <CardHeader className="py-6 m-0 p-6" style={{ backgroundColor: '#3d4a6b', color: '#e8d8b9', paddingTop: '1.65rem', paddingBottom: '1.65rem' }}>.Value -replace '#3d4a6b', '#1c2340' , color: '#e8d8b9', paddingTop: '1.65rem', paddingBottom: '1.65rem' }}>
              <CardTitle className="px-2 text-xl flex items-center justify-between" style={{ color: '#e8d8b9' }}>
                <span>Bestaande Categorieën</span>
                <span className="text-sm font-normal">
                  {activityTypes.length} categorie(s) gevonden
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="space-y-3">
                {activityTypes.length === 0 ? (
                  <p className="text-center py-8 px-4" style={{ color: '#3d4a6b' }}>
                    Nog geen categorieën toegevoegd
                  </p>
                ) : (
                  activityTypes.map((type: ActivityTypeWithCount) => (
                    <div
                      key={type.id}
                      className="border-2 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300"
                      style={{ backgroundColor: '#f2ecd9', borderColor: '#3d4a6b' }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-bold text-base px-1 mb-1" style={{ color: '#3d4a6b' }}>
                            {type.name}
                          </h3>
                          {type.description && (
                            <p className="text-sm mt-1 px-2" style={{ color: '#3d4a6b' }}>
                              {type.description}
                            </p>
                          )}
                          <p className="text-xs font-medium px-2 py-1 rounded border mt-2 inline-block" style={{ color: '#3d4a6b', backgroundColor: '#e8d8b9', borderColor: '#3d4a6b' }}>
                            {type._count.activities} activiteit(en)
                          </p>
                        </div>
                        <div className="flex gap-3 ml-4">
                          <Link href={`/manage/types/${type.id}/edit`}>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-2 font-medium py-2 px-3 hover:shadow-md transition-all duration-200"
                              style={{ backgroundColor: '#6ECFF6', borderColor: '#3d4a6b', color: '#3d4a6b' }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <form action={deleteActivityType} className="inline">
                            <input type="hidden" name="id" value={type.id} />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="bg-red-500 hover:bg-red-600 border-0 py-2 px-3"
                              type="submit"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="rounded-xl p-8 shadow-lg border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#3d4a6b' }}>
            <Link href="/manage/activities">
              <Button variant="outline" className="mr-6 border-2 font-semibold py-3 px-6 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#3d4a6b', borderColor: '#3d4a6b', color: '#d4c4a8' }}>
                Naar Activiteiten Beheer
              </Button>
            </Link>
            <Link href="/roulette">
              <Button className="font-semibold py-3 px-6 border-2 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#3d4a6b', color: '#6ECFF6', borderColor: '#3d4a6b' }}>
                Start Roulette
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
