'use client'

import { useState, useTransition, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Activity, ActivityType } from '@prisma/client'
import { logActivity } from '@/lib/actions/roulette'
import { ArrowLeft, Play, Clock, Star, Target } from 'lucide-react'
import Link from 'next/link'

type ActivityWithType = Activity & {
  type: ActivityType
}

interface RouletteClientProps {
  activities: ActivityWithType[]
}

interface ActivityLog {
  id: string
  activity: ActivityWithType
  selectedAt: Date
  timeSpentMinutes: number | null
  notes: string | null
}

export default function RouletteClient({ activities }: RouletteClientProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithType | null>(null)
  const [showTimeLog, setShowTimeLog] = useState(false)
  const [timeSpent, setTimeSpent] = useState('')
  const [notes, setNotes] = useState('')
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [isPending, startTransition] = useTransition()
  const [wheelRotation, setWheelRotation] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [displayActivities, setDisplayActivities] = useState<ActivityWithType[]>([])
  const [animateWheel, setAnimateWheel] = useState(true)
  const [pendingSelection, setPendingSelection] = useState<{
    activity: ActivityWithType
  } | null>(null)

  // The `activities` prop is pre-sorted on the server. We use it directly.
  useEffect(() => {
    setIsMounted(true);
    setDisplayActivities(activities);
  }, [activities]);

  // Log the render order for debugging
  useEffect(() => {
    if (isMounted) {
      console.log('Rendered wheel with activities (v1.2):', displayActivities.map(a => a.name));
    }
  }, [displayActivities, isMounted]);

  // Simplified spin preparation
  const prepareSpin = (): {
    activity: ActivityWithType
    rotationDelta: number
  } => {
    // Step 1: Weighted selection from the STABLE `displayActivities` state.
    // This ensures the selection logic and rendering logic use the same source.
    const totalWeight = displayActivities.reduce((sum, a) => sum + a.weight, 0)
    let random = Math.random() * totalWeight
    let selectedActivity = displayActivities[0]
    for (const activity of displayActivities) {
      random -= activity.weight
      if (random <= 0) {
        selectedActivity = activity
        break
      }
    }

    // Step 2: Calculate rotation needed.
    const segmentAngle = 360 / displayActivities.length
    const selectedIndex = displayActivities.findIndex(a => a.id === selectedActivity.id)
    
    // The center of the selected slice when the wheel is at 0 rotation.
    // Slices are drawn starting from -90 degrees (top).
    const baseCenter = -90 + selectedIndex * segmentAngle + (segmentAngle / 2)
    
    // The angle needed to move the slice's center to the pointer (180°)
    const targetAngle = 180
    const rotationToGo = ((targetAngle - baseCenter) % 360 + 360) % 360

    // Add full spins for visual effect
    const spins = 4 + Math.floor(Math.random() * 3) // 4, 5, or 6 spins
    const rotationDelta = (spins * 360) + rotationToGo

    console.log('🎯 PREPARED SPIN (v1.1):')
    console.log(`Selected: ${selectedActivity.name} (index: ${selectedIndex})`)
    console.log(`Layout is fixed. Base Center: ${baseCenter.toFixed(2)}°`)
    console.log(`Rotation to go: ${rotationToGo.toFixed(2)}°`)
    console.log(`Total Rotation: ${rotationDelta.toFixed(2)}°`)

    return { activity: selectedActivity, rotationDelta }
  }

  // Simplified spin execution
  const spinRoulette = async () => {
    if (isSpinning) return

    setIsSpinning(true)
    setSelectedActivity(null)
    setShowTimeLog(false)

    const { activity, rotationDelta } = prepareSpin()

    // 1. Snap wheel to 0 degrees without animation
    flushSync(() => {
      setAnimateWheel(false)
      setWheelRotation(0)
    })

    // 2. On the next frame, enable animation and apply the full rotation
    requestAnimationFrame(() => {
      setAnimateWheel(true)
      setWheelRotation(rotationDelta)
    })

    setPendingSelection({ activity })
  }

  // Simplified transition end handler
  const handleWheelTransitionEnd = () => {
    if (!isSpinning) return

    // Snap to the final angle modulo 360 to prevent accumulation issues
    const snapped = ((wheelRotation % 360) + 360) % 360
    setAnimateWheel(false)
    setWheelRotation(snapped)
    
    // Re-enable animation on the next frame for future spins
    requestAnimationFrame(() => setAnimateWheel(true))

    if (pendingSelection) {
      const activity = pendingSelection.activity
      setSelectedActivity(activity)
      setPendingSelection(null)
      setIsSpinning(false)
      setShowTimeLog(true)

      // Log to DB
      startTransition(async () => {
        try {
          const result = await logActivity(activity.id)
          setActivityLogs(prev => [result, ...prev])
        } catch (error) {
          console.error('Error logging activity:', error)
        }
      })
    }
  }

  const handleTimeLog = async (formData: FormData) => {
    if (!selectedActivity) return

    const timeSpentValue = formData.get('timeSpent') as string
    const notesValue = formData.get('notes') as string

    startTransition(async () => {
      try {
        // Update het laatste log record
        if (activityLogs.length > 0) {
          const updatedLog = {
            ...activityLogs[0],
            timeSpentMinutes: timeSpentValue ? parseInt(timeSpentValue) : null,
            notes: notesValue || null
          }
          setActivityLogs(prev => [updatedLog, ...prev.slice(1)])
        }
        
        setTimeSpent('')
        setNotes('')
        setShowTimeLog(false)
      } catch (error) {
        console.error('Error updating time log:', error)
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Link href="/">
          <Button 
            variant="outline" 
            className="border-2 font-semibold py-2 px-4 hover:shadow-md transition-all duration-200"
            style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar Home
          </Button>
        </Link>
        <div className="text-sm" style={{ color: '#282C44' }}>
          {activities.length} actieve activiteiten beschikbaar
        </div>
      </div>

      {/* Roulette Wheel */}
      <div className="flex flex-col items-center space-y-8">
        <Card className="w-full max-w-4xl shadow-lg border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
          <CardHeader style={{ backgroundColor: '#282C44', color: '#e8d8b9' }}>
            <CardTitle className="text-center text-2xl">
              <Target className="inline h-8 w-8 mr-3" />
              Activiteiten Roulette <span className="text-xs opacity-70 font-normal">(v1.1)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Wheel Container */}
            <div className="relative flex justify-center mb-8">
              <div className="relative w-96 h-96">
                {/* Large Bottom Pointer (South) - Very visible */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 z-30"
                  style={{ color: '#282C44' }}
                >
                  {/* Main arrow body */}
                  <div className="flex flex-col items-center">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-16 border-transparent border-t-current shadow-2xl"></div>
                    {/* Arrow shaft */}
                    <div 
                      className="w-4 h-8 shadow-lg"
                      style={{ backgroundColor: '#282C44' }}
                    ></div>
                    {/* Pointer label */}
                    <div 
                      className="mt-2 text-sm font-bold px-2 py-1 rounded"
                      style={{ backgroundColor: '#282C44', color: '#d4c4a8' }}
                    >
                      ↑ WINNER
                    </div>
                  </div>
                </div>
                
                {/* Pointer indicator inside circle at bottom */}
                <div 
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-25"
                  style={{ color: '#6ECFF6' }}
                >
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-current"></div>
                </div>
                
                {/* Wheel */}
                <div 
                  className={`w-96 h-96 rounded-full border-8 relative overflow-hidden shadow-2xl ${animateWheel ? 'transition-transform duration-2000 ease-out' : 'transition-none'}`}
                  style={{ 
                    borderColor: '#282C44',
                    backgroundColor: '#f2ecd9',
                    transform: `rotate(${wheelRotation}deg)`
                  }}
                  onTransitionEnd={handleWheelTransitionEnd}
                >
                  {/* Wheel segments - SVG approach for better text display */}
                  {isMounted && (
                    <svg 
                      className="w-full h-full absolute inset-0" 
                      viewBox="0 0 200 200"
                    >
                      {displayActivities.map((activity, index) => {
                        const totalSegments = displayActivities.length
                        const segmentAngle = 360 / totalSegments
                        const startAngle = -90 + index * segmentAngle
                        const endAngle = -90 + (index + 1) * segmentAngle
                        
                        // Convert to radians
                        const startRad = (startAngle * Math.PI) / 180
                        const endRad = (endAngle * Math.PI) / 180
                        
                        // Calculate path for pie segment
                        const radius = 90
                        const centerX = 100
                        const centerY = 100
                        
                        const x1 = centerX + radius * Math.cos(startRad)
                        const y1 = centerY + radius * Math.sin(startRad)
                        const x2 = centerX + radius * Math.cos(endRad)
                        const y2 = centerY + radius * Math.sin(endRad)
                        
                        const largeArcFlag = segmentAngle > 180 ? 1 : 0
                        
                        const pathData = [
                          `M ${centerX} ${centerY}`,
                          `L ${x1} ${y1}`,
                          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          'Z'
                        ].join(' ')
                        
                        // Colors alternating
                        const segmentColor = index % 2 === 0 ? '#e8d8b9' : '#f2ecd9'
                        
                        // Text position (midpoint of arc)
                        const midAngle = startAngle + segmentAngle / 2
                        const textRadius = radius * 0.7
                        const textX = centerX + textRadius * Math.cos((midAngle * Math.PI) / 180)
                        const textY = centerY + textRadius * Math.sin((midAngle * Math.PI) / 180)
                        
                        return (
                          <g key={activity.id}>
                            <path
                              d={pathData}
                              fill={segmentColor}
                              stroke="#282C44"
                              strokeWidth="1"
                            />
                            <text
                              x={textX}
                              y={textY}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-xs font-semibold pointer-events-none"
                              fill="#282C44"
                              transform={`rotate(${midAngle + 90} ${textX} ${textY})`}
                              style={{ fontSize: activities.length > 8 ? '8px' : '10px' }}
                            >
                              <tspan>
                                {activity.name.length > 15 ? activity.name.substring(0, 12) + '...' : activity.name}
                              </tspan>
                            </text>
                          </g>
                        )
                      })}
                    </svg>
                  )}
                  
                  {/* Loading placeholder for SSR */}
                  {!isMounted && (
                    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                      <div className="text-center" style={{ color: '#282C44' }}>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-4"></div>
                        <p>Laden...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Center circle */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center z-10 border-4"
                    style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}
                  >
                    <Play className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Spin Button */}
            <div className="text-center">
              <Button
                onClick={spinRoulette}
                disabled={isSpinning || isPending}
                className="text-xl px-8 py-4 font-bold border-2 hover:shadow-lg transition-all duration-200"
                style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}
              >
                {isSpinning ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current mr-3"></div>
                    Draait...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Play className="h-6 w-6 mr-3" />
                    Spin de Roulette!
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Selected Activity */}
        {selectedActivity && (
          <Card className="w-full max-w-2xl shadow-lg border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
            <CardHeader style={{ backgroundColor: '#6ECFF6', color: '#282C44' }}>
              <CardTitle className="text-center text-xl">
                <Star className="inline h-6 w-6 mr-3" />
                Jouw Gekozen Activiteit!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: '#282C44' }}>
                  {selectedActivity.name}
                </h3>
                {selectedActivity.description && (
                  <p className="text-lg" style={{ color: '#282C44' }}>
                    {selectedActivity.description}
                  </p>
                )}
                <div className="flex justify-center items-center space-x-4">
                  <Badge 
                    variant="outline" 
                    className="text-sm font-medium px-3 py-1"
                    style={{ borderColor: '#282C44', color: '#282C44', backgroundColor: '#f2ecd9' }}
                  >
                    {selectedActivity.type.name}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="text-sm font-medium px-3 py-1"
                    style={{ borderColor: '#282C44', color: '#282C44', backgroundColor: '#f2ecd9' }}
                  >
                    Gewicht: {selectedActivity.weight}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Logging */}
        {showTimeLog && selectedActivity && (
          <Card className="w-full max-w-2xl shadow-lg border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
            <CardHeader style={{ backgroundColor: '#282C44', color: '#e8d8b9' }}>
              <CardTitle className="text-center">
                <Clock className="inline h-5 w-5 mr-2" />
                Tijd Loggen
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form action={handleTimeLog} className="space-y-4">
                <div>
                  <Label htmlFor="timeSpent" className="text-sm font-medium" style={{ color: '#282C44' }}>
                    Hoeveel minuten heb je besteed aan &quot;{selectedActivity.name}&quot;?
                  </Label>
                  <input
                    type="number"
                    id="timeSpent"
                    name="timeSpent"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    placeholder="Bijv. 30"
                    min="1"
                    className="w-full border-2 py-2 px-3 mt-1"
                    style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium" style={{ color: '#282C44' }}>
                    Optionele notities
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Hoe was het? Wat heb je gedaan?"
                    rows={3}
                    className="border-2 mt-1"
                    style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTimeLog(false)}
                    className="flex-1 border-2"
                    style={{ borderColor: '#282C44', color: '#282C44' }}
                  >
                    Overslaan
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 font-semibold border-2 hover:shadow-md transition-all duration-200"
                    style={{ backgroundColor: '#6ECFF6', color: '#282C44', borderColor: '#6ECFF6' }}
                  >
                    {isPending ? 'Bezig...' : 'Tijd Opslaan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity Logs */}
        {activityLogs.length > 0 && (
          <Card className="w-full max-w-2xl shadow-lg border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
            <CardHeader style={{ backgroundColor: '#282C44', color: '#e8d8b9' }}>
              <CardTitle>
                <Clock className="inline h-5 w-5 mr-2" />
                Recente Activiteiten
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {activityLogs.slice(0, 5).map((log) => (
                  <div 
                    key={log.id}
                    className="p-3 rounded border-2"
                    style={{ backgroundColor: '#f2ecd9', borderColor: '#282C44' }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold" style={{ color: '#282C44' }}>
                          {log.activity.name}
                        </h4>
                        <p className="text-sm" style={{ color: '#282C44' }}>
                          {log.activity.type.name}
                        </p>
                      </div>
                      <div className="text-right text-sm" style={{ color: '#282C44' }}>
                        {log.timeSpentMinutes ? (
                          <p>{log.timeSpentMinutes} minuten</p>
                        ) : (
                          <p>Tijd niet gelogd</p>
                        )}
                        <p className="text-xs opacity-75">
                          {new Date(log.selectedAt).toLocaleString('nl-NL')}
                        </p>
                      </div>
                    </div>
                    {log.notes && (
                      <p className="text-sm mt-2 italic" style={{ color: '#282C44' }}>
                        &quot;{log.notes}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
