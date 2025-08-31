'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Filter, Scale } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createActivity, deleteActivity, toggleActivityStatus, updateActivity } from '@/lib/actions/activities'
import type { Activity, ActivityType } from '@prisma/client'

type ActivityWithType = Activity & {
  type: ActivityType
}

interface ActivitiesClientProps {
  initialActivities: ActivityWithType[]
  initialActivityTypes: ActivityType[]
}

export default function ActivitiesClient({ initialActivities, initialActivityTypes }: ActivitiesClientProps) {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all')
  const [editingActivity, setEditingActivity] = useState<ActivityWithType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Filter activities based on selected type
  const filteredActivities = selectedTypeFilter === 'all'
    ? initialActivities
    : initialActivities.filter(activity => activity.typeId === selectedTypeFilter)

  const handleEditActivity = (activity: ActivityWithType) => {
    setEditingActivity(activity)
    setIsEditDialogOpen(true)
  }

  const handleCreateActivity = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createActivity(formData)
        router.refresh()
      } catch (error) {
        console.error('Error creating activity:', error)
      }
    })
  }

  const handleDeleteActivity = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await deleteActivity(formData)
        router.refresh()
      } catch (error) {
        console.error('Error deleting activity:', error)
      }
    })
  }

  const handleToggleActivity = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await toggleActivityStatus(formData)
        router.refresh()
      } catch (error) {
        console.error('Error toggling activity:', error)
      }
    })
  }

  const handleUpdateActivity = async (formData: FormData) => {
    if (!editingActivity) return

    startTransition(async () => {
      try {
        console.log('Starting update...')
        await updateActivity(formData)
        console.log('Update successful, closing modal...')
        setIsEditDialogOpen(false)
        setEditingActivity(null)
        router.refresh()
        console.log('Modal should be closed now')
      } catch (error) {
        console.error('Error updating activity:', error)
      }
    })
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#3d4a6b', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-4 px-2" style={{ color: '#e8d8b9' }}>
              Activiteiten Beheer
            </h1>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-2 font-semibold py-3 px-6 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}>
              ← Terug naar Home
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Create New Activity Form */}
          <Card className="shadow-lg border-2 overflow-hidden" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
            <CardHeader className="py-6 m-0 p-6" style={{ backgroundColor: '#282C44', color: '#e8d8b9', paddingTop: '1.65rem', paddingBottom: '1.65rem' }}>
              <CardTitle className="px-2 text-xl flex items-center" style={{ color: '#e8d8b9' }}>
                <Plus className="h-6 w-6 mr-3" />
                Nieuwe Activiteit Toevoegen
              </CardTitle>
              {/* Info Section to Match Height */}
              <div className="mt-4 px-2 flex items-center gap-4">
                <div className="flex items-center gap-2 text-base font-medium py-1" style={{ color: '#e8d8b9' }}>
                  <span className="text-sm">💡</span>
                  <span className="text-sm">Vul onderstaand formulier in om een nieuwe activiteit toe te voegen</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-3">
              {initialActivityTypes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="mb-6 px-4 py-2" style={{ color: '#282C44' }}>
                    Je moet eerst een activiteit categorie aanmaken voordat je activiteiten kunt toevoegen.
                  </p>
                  <Link href="/manage/types">
                    <Button className="font-semibold py-3 px-6 border-2 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}>
                      Ga naar Categorieën Beheer
                    </Button>
                  </Link>
                </div>
              ) : (
                <form action={handleCreateActivity} className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="px-2 py-1 text-base font-medium" style={{ color: '#282C44' }}>Naam *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="bijv. De Zee lezen"
                      required
                      className="border-2 py-3 px-4 mt-1"
                      style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="px-2 py-1 text-base font-medium" style={{ color: '#282C44' }}>Beschrijving</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Optionele beschrijving..."
                      className="resize-none border-2 py-3 px-4 mt-1"
                      style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="activityType" className="px-2 py-1 text-base font-medium" style={{ color: '#282C44' }}>Activiteit Categorie *</Label>
                    <Select name="activityType" required>
                      <SelectTrigger className="border-2 py-3 px-4 mt-1" style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}>
                        <SelectValue placeholder="Selecteer een categorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {initialActivityTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="weight" className="px-2 py-1 text-base font-medium" style={{ color: '#282C44' }}>Gewicht (0-100) *</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue="50"
                      required
                      className="border-2 py-3 px-4 mt-1"
                      style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                    />
                    <p className="text-sm mt-1 px-3 py-1" style={{ color: '#282C44' }}>
                      50 = gemiddeld, hoger = meer kans om gekozen te worden
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 px-2 py-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      defaultChecked
                      className="rounded w-4 h-4"
                    />
                    <Label htmlFor="isActive" className="text-base font-medium" style={{ color: '#282C44' }}>Actief</Label>
                  </div>
                  <Button type="submit" className="w-full font-semibold py-4 px-6 border-2 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}>
                    Activiteit Toevoegen
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Existing Activities List */}
          <Card className="shadow-lg border-2 overflow-hidden" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
            <CardHeader className="py-6 m-0 p-6" style={{ backgroundColor: '#282C44', color: '#e8d8b9', paddingTop: '1.65rem', paddingBottom: '1.65rem' }}>
              <CardTitle className="px-2 text-xl flex items-center justify-between" style={{ color: '#e8d8b9' }}>
                <span>Bestaande Activiteiten</span>
                <span className="text-sm font-normal">
                  {filteredActivities.length} van {initialActivities.length} activiteit(en) getoond
                </span>
              </CardTitle>
              {/* Filter Dropdown */}
              <div className="mt-4 px-2 flex items-center gap-4">
                <Label htmlFor="typeFilter" className="flex items-center gap-2 text-base font-medium py-1 whitespace-nowrap" style={{ color: '#e8d8b9' }}>
                  <Filter className="h-5 w-5" />
                  Filter op Categorie
                </Label>
                <Select value={selectedTypeFilter} onValueChange={setSelectedTypeFilter}>
                  <SelectTrigger className="border-2 py-3 px-4 flex-1" style={{ backgroundColor: '#f2ecd9', borderColor: '#282C44', color: '#282C44' }}>
                    <SelectValue placeholder="Filter op categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Categorieën</SelectItem>
                    {initialActivityTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="py-6">
              <div className="space-y-3 overflow-y-auto">
                {filteredActivities.length === 0 ? (
                  <p className="text-center py-6 px-4" style={{ color: '#282C44' }}>
                    {selectedTypeFilter === 'all'
                      ? 'Nog geen activiteiten toegevoegd'
                      : 'Geen activiteiten gevonden voor geselecteerd type'
                    }
                  </p>
                ) : (
                  filteredActivities.map((activity: ActivityWithType) => (
                    <div
                      key={activity.id}
                      className="border-2 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300"
                      style={{ backgroundColor: '#f2ecd9', borderColor: '#282C44' }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-baseline gap-3 mb-1">
                            {/* Scale icon with number below */}
                            <div className="flex flex-col items-center">
                              <Scale className="w-7 h-7" style={{ color: '#282C44' }} />
                              <span className="text-xs font-bold" style={{ color: '#282C44' }}>
                                {activity.weight}
                              </span>
                            </div>
                            <h3 className="font-bold text-base px-1" style={{ color: '#282C44' }}>
                              {activity.name}
                            </h3>
                          </div>
                          {activity.description && (
                            <p className="text-sm mt-1 px-2" style={{ color: '#282C44' }}>
                              {activity.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-3 ml-4">
                          <form action={handleToggleActivity} className="inline">
                            <input type="hidden" name="id" value={activity.id} />
                            <Button
                              size="sm"
                              variant="outline"
                              type="submit"
                              disabled={isPending}
                              className="border-2 font-medium py-2 px-3 hover:shadow-md transition-all duration-200"
                              style={activity.isActive
                                ? { backgroundColor: '#22c55e', borderColor: '#16a34a', color: 'white' }
                                : { backgroundColor: '#f97316', borderColor: '#ea580c', color: 'white' }
                              }
                            >
                              {activity.isActive ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </Button>
                          </form>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-2 font-medium py-2 px-3 hover:shadow-md transition-all duration-200"
                            style={{ backgroundColor: '#6ECFF6', borderColor: '#6ECFF6', color: '#282C44' }}
                            onClick={() => handleEditActivity(activity)}
                            disabled={isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <form action={handleDeleteActivity} className="inline">
                            <input type="hidden" name="id" value={activity.id} />
                            <Button
                              size="sm"
                              variant="destructive"
                              type="submit"
                              disabled={isPending}
                              className="bg-red-500 hover:bg-red-600 border-0 py-2 px-3"
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

        {/* Edit Activity Modal */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="border-2 max-w-lg" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
            <DialogHeader>
              <DialogTitle style={{ color: '#282C44' }}>Activiteit Bewerken</DialogTitle>
              <DialogDescription style={{ color: '#282C44' }}>
                Wijzig de details van deze activiteit.
              </DialogDescription>
            </DialogHeader>
            {editingActivity && (
              <form action={handleUpdateActivity} className="space-y-3">
                <input type="hidden" name="id" value={editingActivity.id} />
                <div>
                  <Label htmlFor="edit-name" className="px-2 py-1 text-base font-medium" style={{ color: '#282C44' }}>Naam *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingActivity.name}
                    required
                    disabled={isPending}
                    className="border-2 py-3 px-4 mt-1"
                    style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description" className="px-2 py-1 text-base font-medium" style={{ color: '#282C44' }}>Beschrijving</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingActivity.description || ''}
                    rows={2}
                    disabled={isPending}
                    className="border-2 py-3 px-4 mt-1"
                    style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-typeId" className="px-2 py-1 text-base font-medium" style={{ color: '#282C44' }}>Categorie *</Label>
                  <Select name="activityType" defaultValue={editingActivity.typeId} required disabled={isPending}>
                    <SelectTrigger className="border-2 py-3 px-4 mt-1" style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}>
                      <SelectValue placeholder="Selecteer een categorie" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: '#f2ecd9', borderColor: '#282C44' }}>
                      {initialActivityTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-weight" className="px-2 py-1 text-base font-medium" style={{ color: '#282C44' }}>Gewicht (0-100) *</Label>
                  <Input
                    id="edit-weight"
                    name="weight"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={editingActivity.weight}
                    required
                    disabled={isPending}
                    className="border-2 py-3 px-4 mt-1"
                    style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="edit-isActive"
                    name="isActive"
                    defaultChecked={editingActivity.isActive}
                    disabled={isPending}
                    className="w-4 h-4 border-2"
                    style={{ borderColor: '#282C44' }}
                  />
                  <Label htmlFor="edit-isActive" className="px-2 py-1 text-base font-medium" style={{ color: '#282C44' }}>
                    Activiteit is actief
                  </Label>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    disabled={isPending}
                    className="flex-1 border-2 py-2 px-4"
                    style={{ borderColor: '#282C44', color: '#282C44' }}
                  >
                    Annuleren
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 font-semibold py-2 px-4 border-2 hover:shadow-md transition-all duration-200"
                    style={{ backgroundColor: '#6ECFF6', color: '#282C44', borderColor: '#6ECFF6' }}
                  >
                    {isPending ? 'Bezig...' : 'Opslaan'}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
