import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Star, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteAllActivityLogs, deleteActivityLogAction } from '@/lib/actions/activity-logs'
import FeedbackMessage from '@/components/feedback-message'

// Force dynamic rendering to handle database connectivity issues during build
export const dynamic = 'force-dynamic'

export default async function ActivityLogPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let activityLogs: any[] = []
    let error = false

    try {
        // Fetch all activity logs with activity and type information
        const logs = await prisma.activityLog.findMany({
            include: {
                activity: {
                    include: {
                        type: true
                    }
                }
            },
            orderBy: {
                selectedAt: 'desc'
            }
        })
        activityLogs = logs
    } catch (e) {
        console.error('Failed to fetch activity logs:', e)
        error = true
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date))
    }

    const formatDuration = (minutes: number | null) => {
        if (!minutes) return 'Niet ingevuld'

        if (minutes < 60) {
            return `${minutes} min`
        }

        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60

        if (remainingMinutes === 0) {
            return `${hours}u`
        }

        return `${hours}u ${remainingMinutes}min`
    }

    const renderSatisfactionStars = (rating: number | null) => {
        if (!rating) return <span className="text-gray-500 text-xs">Niet beoordeeld</span>

        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-3 w-3 ${star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
                <span className="ml-1 text-xs font-medium" style={{ color: '#282C44' }}>
                    {rating}/5
                </span>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: '#3d4a6b' }}>
            <FeedbackMessage />
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold px-2 py-2" style={{ color: '#e8d8b9' }}>
                        Activiteiten Log
                    </h1>
                    <div className="flex gap-2">
                        {activityLogs.length > 0 && (
                            <form action={deleteAllActivityLogs}>
                                <Button
                                    type="submit"
                                    variant="outline"
                                    className="border-2 font-semibold py-2 px-4 hover:shadow-md transition-all duration-200"
                                    style={{ backgroundColor: '#dc2626', color: '#ffffff', borderColor: '#dc2626' }}
                                >
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Alle Logs Verwijderen
                                </Button>
                            </form>
                        )}
                        <Button asChild variant="outline" className="border-2 font-semibold py-2 px-4 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}>
                            <Link href="/" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Terug naar Home
                            </Link>
                        </Button>
                    </div>
                </div>

                {error ? (
                    <Card className="border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
                        <CardContent className="p-6 text-center">
                            <p style={{ color: '#282C44' }}>
                                Kon geen verbinding maken met de database. Probeer later opnieuw.
                            </p>
                        </CardContent>
                    </Card>
                ) : activityLogs.length === 0 ? (
                    <Card className="border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
                        <CardContent className="p-6 text-center">
                            <p style={{ color: '#282C44' }}>
                                Nog geen activiteiten uitgevoerd. Ga naar de roulette om je eerste activiteit te selecteren!
                            </p>
                            <Button asChild className="mt-4" style={{ backgroundColor: '#282C44', color: '#d4c4a8' }}>
                                <Link href="/roulette">
                                    Naar Roulette
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b-2" style={{ backgroundColor: '#282C44', borderColor: '#282C44' }}>
                                        <TableHead className="text-left font-bold py-4" style={{ color: '#e8d8b9' }}>
                                        </TableHead>
                                        <TableHead className="text-left font-bold py-4" style={{ color: '#e8d8b9' }}>
                                            Activiteit
                                        </TableHead>
                                        <TableHead className="text-left font-bold py-4 min-w-[120px] whitespace-nowrap" style={{ color: '#e8d8b9' }}>
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <Calendar className="h-4 w-4" />
                                                Dag
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-left font-bold py-4 min-w-[100px]" style={{ color: '#e8d8b9' }}>
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <Clock className="h-4 w-4" />
                                                Duurtijd
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-left font-bold py-4" style={{ color: '#e8d8b9' }}>
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4" />
                                                Review Score
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-left font-bold py-4 min-w-[100px]" style={{ color: '#e8d8b9' }}>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {activityLogs.map((log) => (
                                        <TableRow key={log.id} className="border-b hover:bg-opacity-50 transition-colors" style={{ backgroundColor: '#f2ecd9', borderColor: '#282C44' }}>
                                            {/* Categorie */}
                                            <TableCell className="py-2">
                                                <Badge variant="secondary" className="text-xs" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44', color: '#282C44' }}>
                                                    {log.activity.type.name}
                                                </Badge>
                                            </TableCell>

                                            {/* Activiteit */}
                                            <TableCell className="py-2">
                                                <div>
                                                    <p className="font-medium text-sm" style={{ color: '#282C44' }}>
                                                        {log.activity.name}
                                                    </p>
                                                    {log.activity.description && (
                                                        <p className="text-xs opacity-75" style={{ color: '#282C44' }}>
                                                            {log.activity.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Dag */}
                                            <TableCell className="py-2 min-w-[140px] whitespace-nowrap">
                                                <div className="whitespace-nowrap">
                                                    <p className="text-sm" style={{ color: '#282C44' }}>
                                                        {formatDate(log.selectedAt)} {new Intl.DateTimeFormat('nl-NL', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }).format(new Date(log.selectedAt))}
                                                    </p>
                                                </div>
                                            </TableCell>

                                            {/* Duurtijd */}
                                            <TableCell className="py-2 min-w-[100px]">
                                                <p className="text-sm whitespace-nowrap" style={{ color: '#282C44' }}>
                                                    {formatDuration(log.timeSpentMinutes)}
                                                </p>
                                            </TableCell>

                                            {/* Review Score */}
                                            <TableCell className="py-2">
                                                {renderSatisfactionStars(log.satisfaction)}
                                            </TableCell>

                                            {/* Acties */}
                                            <TableCell className="py-2 min-w-[100px]">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 w-7 p-0"
                                                        style={{ backgroundColor: '#282C44', borderColor: '#282C44', color: '#e8d8b9' }}
                                                    >
                                                        <Link href={`/activity-log/${log.id}/edit`}>
                                                            <Edit className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                    <form action={deleteActivityLogAction} className="inline">
                                                        <input type="hidden" name="logId" value={log.id} />
                                                        <Button
                                                            type="submit"
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 w-7 p-0"
                                                            style={{ backgroundColor: '#dc2626', borderColor: '#dc2626', color: '#ffffff' }}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </form>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Notes section for logs with notes */}
                            {activityLogs.some(log => log.notes) && (
                                <div className="p-4 border-t" style={{ borderColor: '#282C44' }}>
                                    <h4 className="font-semibold mb-2" style={{ color: '#282C44' }}>Notities:</h4>
                                    {activityLogs.filter(log => log.notes).map((log) => (
                                        <div key={`${log.id}-note`} className="mb-2 p-2 rounded" style={{ backgroundColor: '#f2ecd9' }}>
                                            <p className="text-xs font-medium" style={{ color: '#282C44' }}>
                                                {log.activity.name} ({formatDate(log.selectedAt)}):
                                            </p>
                                            <p className="text-xs" style={{ color: '#282C44' }}>
                                                {log.notes}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
