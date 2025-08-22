'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { createActivityType, deleteActivityType, updateActivityType } from '@/lib/actions/activity-types'
import type { ActivityType } from '@prisma/client'
import { useRouter } from 'next/navigation'

type ActivityTypeWithCount = ActivityType & {
    _count: {
        activities: number
    }
}

interface TypesClientProps {
    initialActivityTypes: ActivityTypeWithCount[]
}

export default function TypesClient({ initialActivityTypes }: TypesClientProps) {
    const [editingType, setEditingType] = useState<ActivityTypeWithCount | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleEditType = (type: ActivityTypeWithCount) => {
        setEditingType(type)
        setIsEditDialogOpen(true)
    }

    const handleCreateType = async (formData: FormData) => {
        startTransition(async () => {
            try {
                await createActivityType(formData)
                router.refresh()
            } catch (error) {
                console.error('Error creating activity type:', error)
            }
        })
    }

    const handleUpdateType = async (formData: FormData) => {
        if (!editingType) return

        startTransition(async () => {
            try {
                console.log('Starting type update...')
                await updateActivityType(formData)
                console.log('Type update successful, closing modal...')
                setIsEditDialogOpen(false)
                setEditingType(null)
                router.refresh()
                console.log('Type modal should be closed now')
            } catch (error) {
                console.error('Error updating activity type:', error)
            }
        })
    }

    const handleDeleteType = async (formData: FormData) => {
        startTransition(async () => {
            try {
                await deleteActivityType(formData)
                router.refresh()
            } catch (error) {
                console.error('Error deleting activity type:', error)
            }
        })
    }

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: '#d4c4a8', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold px-2 py-2" style={{ color: '#282C44' }}>
                        Categorie Beheer
                    </h1>
                    <Link href="/">
                        <Button variant="outline" className="border-2 font-semibold py-2 px-4 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}>
                            ← Terug naar Home
                        </Button>
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Create New Type Form */}
                    <Card className="shadow-lg border-2 overflow-hidden" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
                        <CardHeader className="py-6 m-0 p-6" style={{ backgroundColor: '#282C44', color: '#e8d8b9', paddingTop: '1.65rem', paddingBottom: '1.65rem' }}>
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
                            <form action={handleCreateType} className="space-y-3">
                                <div>
                                    <Label htmlFor="name" className="px-2 py-1 text-sm font-medium" style={{ color: '#282C44' }}>Naam *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Bijv. Boek lezen"
                                        required
                                        disabled={isPending}
                                        className="border-2 py-2 px-3 mt-1"
                                        style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description" className="px-2 py-1 text-sm font-medium" style={{ color: '#282C44' }}>Beschrijving</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Optionele beschrijving van deze categorie"
                                        rows={2}
                                        disabled={isPending}
                                        className="border-2 py-2 px-3 mt-1"
                                        style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full font-semibold py-3 px-4 border-2 hover:shadow-md transition-all duration-200 mt-4"
                                    style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}
                                >
                                    {isPending ? 'Bezig...' : 'Categorie Toevoegen'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Existing Types List */}
                    <Card className="shadow-lg border-2 overflow-hidden" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
                        <CardHeader className="py-6 m-0 p-6" style={{ backgroundColor: '#282C44', color: '#e8d8b9', paddingTop: '1.65rem', paddingBottom: '1.65rem' }}>
                            <CardTitle className="px-2 text-xl flex items-center justify-between" style={{ color: '#e8d8b9' }}>
                                <span>Bestaande Categorieën</span>
                                <span className="text-sm font-normal">
                                    {initialActivityTypes.length} categorie(s) gevonden
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-3">
                            <div className="space-y-3">
                                {initialActivityTypes.length === 0 ? (
                                    <p className="text-center py-8 px-4" style={{ color: '#282C44' }}>
                                        Nog geen categorieën toegevoegd
                                    </p>
                                ) : (
                                    initialActivityTypes.map((type: ActivityTypeWithCount) => (
                                        <div
                                            key={type.id}
                                            className="border-2 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300"
                                            style={{ backgroundColor: '#f2ecd9', borderColor: '#282C44' }}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-base px-1 mb-1" style={{ color: '#282C44' }}>
                                                        {type.name}
                                                    </h3>
                                                    {type.description && (
                                                        <p className="text-sm mt-1 px-2" style={{ color: '#282C44' }}>
                                                            {type.description}
                                                        </p>
                                                    )}
                                                    <p className="text-xs font-medium px-2 py-1 rounded border mt-2 inline-block" style={{ color: '#282C44', backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
                                                        {type._count.activities} activiteit(en)
                                                    </p>
                                                </div>
                                                <div className="flex gap-3 ml-4">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-2 font-medium py-2 px-3 hover:shadow-md transition-all duration-200"
                                                        style={{ backgroundColor: '#6ECFF6', borderColor: '#6ECFF6', color: '#282C44' }}
                                                        onClick={() => handleEditType(type)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <form action={handleDeleteType} className="inline">
                                                        <input type="hidden" name="id" value={type.id} />
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="bg-red-500 hover:bg-red-600 border-0 py-2 px-3"
                                                            type="submit"
                                                            disabled={isPending}
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

                {/* Edit Type Modal */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
                        <DialogHeader>
                            <DialogTitle style={{ color: '#282C44' }}>Categorie Bewerken</DialogTitle>
                            <DialogDescription style={{ color: '#282C44' }}>
                                Wijzig de naam en beschrijving van deze categorie.
                            </DialogDescription>
                        </DialogHeader>
                        {editingType && (
                            <form action={handleUpdateType} className="space-y-3">
                                <input type="hidden" name="id" value={editingType.id} />
                                <div>
                                    <Label htmlFor="edit-name" className="px-2 py-1 text-sm font-medium" style={{ color: '#282C44' }}>Naam *</Label>
                                    <Input
                                        id="edit-name"
                                        name="name"
                                        defaultValue={editingType.name}
                                        required
                                        disabled={isPending}
                                        className="border-2 py-2 px-3 mt-1"
                                        style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-description" className="px-2 py-1 text-sm font-medium" style={{ color: '#282C44' }}>Beschrijving</Label>
                                    <Textarea
                                        id="edit-description"
                                        name="description"
                                        defaultValue={editingType.description || ''}
                                        rows={2}
                                        disabled={isPending}
                                        className="border-2 py-2 px-3 mt-1"
                                        style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                                    />
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
