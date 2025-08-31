import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { updateActivityType } from '@/lib/actions/activity-types'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Type Bewerken - YourTimeRoulette",
  description: "Bewerk de naam en beschrijving van een activiteit type.",
}

interface EditActivityTypePageProps {
  params: {
    id: string
  }
}

export default async function EditActivityTypePage({ params }: EditActivityTypePageProps) {
  const { id } = await params

  const activityType = await prisma.activityType.findUnique({
    where: { id }
  })

  if (!activityType) {
    notFound()
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#3d4a6b' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/manage/types">
            <Button variant="outline" size="sm" className="border-2 font-semibold" style={{ backgroundColor: '#1c2340', borderColor: '#1c2340', color: '#d4c4a8' }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Terug naar Categorieën
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold" style={{ color: '#e8d8b9' }}>
              📁 Categorie Bewerken
            </h1>
            <p className="text-lg" style={{ color: '#e8d8b9' }}>
              Bewerk de details van &ldquo;{activityType.name}&rdquo;
            </p>
          </div>
        </div>

        <Card className="shadow-lg border-2 overflow-hidden" style={{ backgroundColor: '#e8d8b9', borderColor: '#1c2340' }}>
          <CardHeader className="py-6" style={{ backgroundColor: '#e8d8b9' }}>
            <CardTitle className="text-xl px-2" style={{ color: '#1c2340' }}>
              <Edit className="h-6 w-6 inline mr-3" />
              Categorie Details
            </CardTitle>
            <CardDescription className="text-base px-3 py-2" style={{ color: '#1c2340' }}>
              Wijzig de naam en beschrijving van deze activiteit categorie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateActivityType} className="space-y-4">
              <input type="hidden" name="id" value={activityType.id} />

              <div>
                <Label htmlFor="name" style={{ color: '#1c2340' }}>Naam *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={activityType.name}
                  placeholder="Bijv. Boek lezen"
                  required
                  className="border-2"
                  style={{ borderColor: '#1c2340', backgroundColor: '#f2ecd9' }}
                />
              </div>

              <div>
                <Label htmlFor="description" style={{ color: '#1c2340' }}>Beschrijving</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={activityType.description || ''}
                  placeholder="Optionele beschrijving van deze categorie"
                  rows={3}
                  className="border-2"
                  style={{ borderColor: '#1c2340', backgroundColor: '#f2ecd9' }}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 font-semibold" style={{ backgroundColor: '#1c2340', color: '#d4c4a8' }}>
                  ✅ Categorie Bijwerken
                </Button>
                <Link href="/manage/types">
                  <Button variant="outline" type="button" className="border-2 font-semibold" style={{ backgroundColor: '#d4c4a8', borderColor: '#1c2340', color: '#1c2340' }}>
                    ❌ Annuleren
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
