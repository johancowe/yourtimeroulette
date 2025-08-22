import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { updateActivity } from '@/lib/actions/activities'
import { notFound } from 'next/navigation'
import type { Activity, ActivityType } from '@prisma/client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Activiteit Bewerken - YourTimeRoulette",
  description: "Bewerk de eigenschappen van een activiteit zoals naam, beschrijving, gewicht en categorie.",
}

type ActivityWithType = Activity & {
  type: ActivityType
}

interface EditActivityPageProps {
  params: {
    id: string
  }
}

export default async function EditActivityPage({ params }: EditActivityPageProps) {
  const { id } = await params

  const [activity, activityTypes]: [ActivityWithType | null, ActivityType[]] = await Promise.all([
    prisma.activity.findUnique({
      where: { id },
      include: { type: true }
    }),
    prisma.activityType.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  if (!activity) {
    notFound()
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#d4c4a8', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/manage/activities">
            <Button variant="outline" size="sm" className="border-2 font-semibold py-2 px-4 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#1c2340', borderColor: '#1c2340', color: '#d4c4a8' }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Terug naar Activiteiten
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold px-2" style={{ color: '#1c2340' }}>
              Activiteit Bewerken
            </h1>
            <p className="text-lg px-3 py-2" style={{ color: '#1c2340' }}>
              Bewerk de details van &ldquo;{activity.name}&rdquo;
            </p>
          </div>
        </div>

        <Card className="shadow-lg border-2 overflow-hidden" style={{ backgroundColor: '#e8d8b9', borderColor: '#1c2340' }}>
          <CardHeader className="py-6" style={{ backgroundColor: '#e8d8b9' }}>
            <CardTitle className="text-xl px-2" style={{ color: '#1c2340' }}>
              <Edit className="h-6 w-6 inline mr-3" />
              Activiteit Details
            </CardTitle>
            <CardDescription className="text-base px-3 py-2" style={{ color: '#1c2340' }}>
              Wijzig de eigenschappen van deze activiteit
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <form action={updateActivity} className="space-y-6">
              <input type="hidden" name="id" value={activity.id} />

              <div>
                <Label htmlFor="name" className="px-2 py-1 text-base font-medium" style={{ color: '#1c2340' }}>Naam *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={activity.name}
                  placeholder="Bijv. Lezen van 'De Zee'"
                  required
                  className="border-2 py-3 px-4 mt-2"
                  style={{ borderColor: '#1c2340', backgroundColor: '#f2ecd9' }}
                />
              </div>

              <div>
                <Label htmlFor="description" className="px-2 py-1 text-base font-medium" style={{ color: '#1c2340' }}>Beschrijving</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={activity.description || ''}
                  placeholder="Optionele beschrijving van deze activiteit"
                  rows={3}
                  className="border-2 py-3 px-4 mt-2"
                  style={{ borderColor: '#1c2340', backgroundColor: '#f2ecd9' }}
                />
              </div>

              <div>
                <Label htmlFor="activityType" className="px-2 py-1 text-base font-medium" style={{ color: '#1c2340' }}>Categorie *</Label>
                <Select name="activityType" defaultValue={activity.typeId} required>
                  <SelectTrigger className="border-2 py-3 px-4 mt-2" style={{ borderColor: '#1c2340', backgroundColor: '#f2ecd9' }}>
                    <SelectValue placeholder="Kies een categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type: ActivityType) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="weight" className="px-2 py-1 text-base font-medium" style={{ color: '#1c2340' }}>Gewicht (0-100) *</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={activity.weight}
                  required
                  className="border-2 py-3 px-4 mt-2"
                  style={{ borderColor: '#1c2340', backgroundColor: '#f2ecd9' }}
                />
                <p className="text-sm mt-2 px-3 py-1" style={{ color: '#1c2340' }}>
                  50 = gemiddeld, hoger = meer kans om gekozen te worden
                </p>
              </div>

              <div className="flex items-center space-x-3 px-2 py-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  defaultChecked={activity.isActive}
                  className="rounded w-4 h-4"
                />
                <Label htmlFor="isActive" className="text-base font-medium" style={{ color: '#1c2340' }}>Actief</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 font-semibold py-4 px-6 border-2 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#6ECFF6', color: '#1c2340', borderColor: '#1c2340' }}>
                  Activiteit Bijwerken
                </Button>
                <Link href="/manage/activities">
                  <Button variant="outline" type="button" className="border-2 font-semibold py-4 px-6 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#6ECFF6', borderColor: '#1c2340', color: '#1c2340' }}>
                    Annuleren
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
