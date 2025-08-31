import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { updateActivityLogAction } from '@/lib/actions/activity-logs'
import SatisfactionPicker from '@/components/satisfaction-picker'
import Link from 'next/link'
import { ArrowLeft, Clock, Star, Calendar } from 'lucide-react'
import { redirect } from 'next/navigation'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface EditActivityLogPageProps {
    params: {
        id: string
    }
}

export default async function EditActivityLogPage({ params }: EditActivityLogPageProps) {
    // Await params for Next.js 15 compatibility
    const { id } = await params

    try {
        // Fetch the activity log with related data
        const activityLog = await prisma.activityLog.findUnique({
            where: {
                id: id
            },
            include: {
                activity: {
                    include: {
                        type: true
                    }
                }
            }
        })

        if (!activityLog) {
            redirect('/activity-log')
        }

        const formatDate = (date: Date) => {
            return new Intl.DateTimeFormat('nl-NL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(new Date(date))
        }

        const formatTime = (date: Date) => {
            return new Intl.DateTimeFormat('nl-NL', {
                hour: '2-digit',
                minute: '2-digit'
            }).format(new Date(date))
        }

        return (
            <div className="min-h-screen p-4" style={{ backgroundColor: '#3d4a6b' }}>
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold" style={{ color: '#e8d8b9' }}>
                            Activiteit Log Bewerken
                        </h1>
                        <Button asChild variant="outline" className="border-2 font-semibold py-1 px-3 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}>
                            <Link href="/activity-log" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Terug naar Log
                            </Link>
                        </Button>
                    </div>

                    {/* Activity Info Card */}
                    <Card className="mb-4 border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
                        <CardHeader className="py-2" style={{ backgroundColor: '#282C44', color: '#e8d8b9' }}>
                            <h2 className="text-lg font-bold">Activiteit Informatie</h2>
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                <div className="p-2 rounded" style={{ backgroundColor: '#f2ecd9' }}>
                                    <h3 className="font-semibold text-sm mb-1" style={{ color: '#282C44' }}>Categorie</h3>
                                    <p className="text-sm" style={{ color: '#282C44' }}>{activityLog.activity.type.name}</p>
                                </div>
                                <div className="p-2 rounded" style={{ backgroundColor: '#f2ecd9' }}>
                                    <h3 className="font-semibold text-sm mb-1" style={{ color: '#282C44' }}>Activiteit</h3>
                                    <p className="text-sm" style={{ color: '#282C44' }}>{activityLog.activity.name}</p>
                                </div>
                                <div className="p-2 rounded" style={{ backgroundColor: '#f2ecd9' }}>
                                    <h3 className="font-semibold text-sm mb-1" style={{ color: '#282C44' }}>
                                        Datum
                                    </h3>
                                    <p className="text-sm" style={{ color: '#282C44' }}>{formatDate(activityLog.selectedAt)}</p>
                                </div>
                                <div className="p-2 rounded" style={{ backgroundColor: '#f2ecd9' }}>
                                    <h3 className="font-semibold text-sm mb-1" style={{ color: '#282C44' }}>
                                        Tijd
                                    </h3>
                                    <p className="text-sm" style={{ color: '#282C44' }}>{formatTime(activityLog.selectedAt)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit Form */}
                    <Card className="border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
                        <CardHeader className="py-3" style={{ backgroundColor: '#282C44', color: '#e8d8b9' }}>
                            <h2 className="text-lg font-bold">Bewerk Details</h2>
                        </CardHeader>
                        <CardContent className="p-4">
                            <form action={updateActivityLogAction} className="space-y-4">
                                <input type="hidden" name="logId" value={activityLog.id} />

                                {/* Time Spent and Satisfaction Score - Side by side */}
                                <div className="flex gap-12 items-start justify-center">
                                    {/* Time Spent */}
                                    <div className="space-y-2">
                                        <Label htmlFor="timeSpent" className="text-sm font-semibold" style={{ color: '#282C44' }}>
                                            Tijd Besteed (minuten)
                                        </Label>
                                        <input
                                            type="number"
                                            id="timeSpent"
                                            name="timeSpent"
                                            defaultValue={activityLog.timeSpentMinutes || ''}
                                            placeholder="Bijv. 30"
                                            min="0"
                                            className="w-32 border-2 py-2 px-3 rounded-md text-sm"
                                            style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9', color: '#282C44' }}
                                        />
                                    </div>

                                    {/* Satisfaction Score */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold" style={{ color: '#282C44' }}>
                                            Tevredenheid Score (1-5 sterren)
                                        </Label>
                                        <SatisfactionPicker
                                            defaultSatisfaction={(activityLog as any).satisfaction} // eslint-disable-line @typescript-eslint/no-explicit-any
                                            name="satisfaction"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label htmlFor="notes" className="text-sm font-semibold" style={{ color: '#282C44' }}>
                                        Notities (optioneel)
                                    </Label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        defaultValue={activityLog.notes || ''}
                                        placeholder="Voeg hier eventuele notities toe..."
                                        rows={3}
                                        className="w-full border-2 py-2 px-3 rounded-md text-sm resize-vertical"
                                        style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9', color: '#282C44' }}
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="submit"
                                        className="flex-1 font-semibold py-2 border-2 hover:shadow-md transition-all duration-200"
                                        style={{ backgroundColor: '#16a34a', color: '#ffffff', borderColor: '#16a34a' }}
                                    >
                                        Wijzigingen Opslaan
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="flex-1 font-semibold py-2 border-2 hover:shadow-md transition-all duration-200"
                                        style={{ backgroundColor: '#f2ecd9', color: '#282C44', borderColor: '#282C44' }}
                                    >
                                        <Link href="/activity-log">
                                            Annuleren
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    } catch (error) {
        console.error('Error loading activity log:', error)
        redirect('/activity-log')
    }
}
