'use client'

// YourTimeRoulette - Roulette Client Component (v2.0)

import { useState, useTransition, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Activity, ActivityType } from '@prisma/client'
import { logActivity, selectRandomActivity, updateActivityLog } from '@/lib/actions/roulette'
import { ArrowLeft, Play, Star, Scale } from 'lucide-react'
import Link from 'next/link'

type ActivityWithType = Activity & {
  type: ActivityType
}

interface RouletteClientProps {
  activities: ActivityWithType[]
}

export default function RouletteClient({ activities }: RouletteClientProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithType | null>(null)
  const [showTimeLog, setShowTimeLog] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [timeSpent, setTimeSpent] = useState('')
  const [satisfaction, setSatisfaction] = useState(0)
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
      // Version tracking for development
    }
  }, [displayActivities, isMounted]);

  // Spin execution that uses server-selected activity as the single source of truth
  const spinRoulette = async () => {
    console.log('🎰 spinRoulette called', {
      isSpinning,
      showModal,
      hasSelectedActivity: !!selectedActivity,
      isPending
    })

    // Prevent spinning if already spinning, pending, or modal is shown
    if (isSpinning || showModal || selectedActivity || isPending) {
      console.log('🚫 Spin blocked - already in progress')
      return
    }

    console.log('✅ Starting new spin')
    setIsSpinning(true)
    setSelectedActivity(null)
    setShowTimeLog(false)
    setShowModal(false)
    setPendingSelection(null)

    try {
      // Ask server to pick a random activity (but don't log it yet)
      const result = await selectRandomActivity()

      // Result shape: { activity: ActivityWithType }
      const serverActivity: ActivityWithType = result.activity

      // compute rotation for the selected activity index in our current displayActivities ordering
      const segmentAngle = 360 / displayActivities.length
      const selectedIndex = displayActivities.findIndex(a => a.id === serverActivity.id)
      const baseCenter = -90 + selectedIndex * segmentAngle + (segmentAngle / 2)

      // Target angle is 90° (bottom pointer position)
      const targetAngle = 90
      const rotationToGo = ((targetAngle - baseCenter) % 360 + 360) % 360
      const spins = 4 + Math.floor(Math.random() * 3)
      const rotationDelta = (spins * 360) + rotationToGo

      // Snap wheel to 0 degrees without animation
      flushSync(() => {
        setAnimateWheel(false)
        setWheelRotation(0)
      })

      // On next frame, animate to final rotation
      requestAnimationFrame(() => {
        setAnimateWheel(true)
        setWheelRotation(rotationDelta)
      })

      // Save pending selection so transition end handler can reveal it
      setPendingSelection({ activity: serverActivity })
    } catch (error) {
      console.error('Error selecting activity from server:', error)
      setIsSpinning(false)
    }
  }

  // Improved transition end handler with event filtering
  const handleWheelTransitionEnd = (event: React.TransitionEvent) => {
    // Only handle transition end for the wheel element itself, not child elements
    if (event.target !== event.currentTarget) return

    // Only handle if we're actually spinning and have a pending selection
    if (!isSpinning || !pendingSelection) return

    // Prevent multiple transition end events
    if (selectedActivity) return

    console.log('🎯 Wheel transition ended, showing modal')

    const activity = pendingSelection.activity
    setSelectedActivity(activity)
    setPendingSelection(null)
    setIsSpinning(false)

    // Show modal immediately (no setTimeout to avoid race conditions)
    setShowModal(true)
    setShowTimeLog(true)

    // Don't log to DB here - wait for user confirmation
  }

  const handleTimeLog = async (formData: FormData) => {
    if (!selectedActivity) return

    const timeSpentValue = formData.get('timeSpent') as string
    const timeSpent = timeSpentValue ? parseInt(timeSpentValue) : null
    const satisfactionValue = satisfaction || null

    startTransition(async () => {
      try {
        // First log the activity to create a new record
        const result = await logActivity(selectedActivity.id)

        // Then update it with time and satisfaction if provided
        if (timeSpent || satisfactionValue) {
          await updateActivityLog(result.id, timeSpent, satisfactionValue)
        }

        console.log('✅ Activity logged successfully')

        // Reset all state completely
        setTimeSpent('')
        setSatisfaction(0)
        setShowTimeLog(false)
        setShowModal(false)
        setSelectedActivity(null)
        setPendingSelection(null)
        setIsSpinning(false)
      } catch (error) {
        console.error('Error logging activity:', error)
      }
    })
  }

  const handleSkip = () => {
    console.log('🚫 User skipped activity')

    // Reset all modal and selection state completely
    setShowModal(false)
    setShowTimeLog(false)
    setSelectedActivity(null)
    setTimeSpent('')
    setSatisfaction(0)
    setPendingSelection(null)

    // Ensure spinning state is properly reset
    setIsSpinning(false)
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#3d4a6b', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section - Simple layout like manage pages */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold px-2 py-1" style={{ color: '#e8d8b9' }}>
              Activiteiten Roulette
            </h1>
          </div>
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
        </div>

        {/* Stats */}
        <div className="text-sm mb-8 px-2" style={{ color: '#e8d8b9' }}>
          <strong>{activities.length}</strong> actieve activiteiten beschikbaar voor de roulette
        </div>

        {/* Roulette Wheel */}
        <div className="flex flex-col items-center space-y-8">
          <Card className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl shadow-lg border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
            <CardContent className="p-8">
              {/* Wheel Container */}
              <div className="relative flex justify-center mb-8">
                <div className="relative w-96 h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem]">
                  {/* Central Pointer - Like Wheel of Fortune */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-40"
                    style={{ color: '#282C44', transformOrigin: 'center top', marginTop: '32px' }}
                  >
                    {/* Arrow pointing down from center - starts just outside center circle */}
                    <div className="relative w-2 h-40 flex flex-col items-center">
                      {/* Arrow shaft - thinner and starts outside center circle */}
                      <div
                        className="w-2 h-28 shadow-lg"
                        style={{ backgroundColor: '#282C44' }}
                      ></div>
                      {/* Arrow head pointing down at the edge */}
                      <div
                        className="w-0 h-0 border-l-8 border-r-8 border-t-14 border-transparent border-t-current shadow-lg"
                        style={{
                          borderLeftWidth: '8px',
                          borderRightWidth: '8px',
                          borderTopWidth: '14px'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Fixed Shadow Background */}
                  <div
                    className="absolute w-96 h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem] rounded-full shadow-2xl"
                    style={{ backgroundColor: 'transparent' }}
                  ></div>

                  {/* Wheel */}
                  <div
                    className={`w-96 h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem] rounded-full border-8 relative overflow-hidden ${animateWheel ? 'transition-transform duration-[10000ms] ease-out' : 'transition-none'}`}
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

                          // Text position - positioned closer to the edge for better readability
                          const midAngle = startAngle + segmentAngle / 2
                          const textRadius = radius * 0.75 // Position for text
                          const textX = centerX + textRadius * Math.cos((midAngle * Math.PI) / 180)
                          const textY = centerY + textRadius * Math.sin((midAngle * Math.PI) / 180)

                          // Calculate rotation for text to be radial (along the spoke/rib direction)
                          // All text should point outward from center in the same orientation
                          const textRotation = midAngle

                          // Keep all text in the same orientation - no flipping
                          // This ensures all text reads in the same direction relative to their radial axis

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
                                transform={`rotate(${textRotation} ${textX} ${textY})`}
                                style={{ fontSize: activities.length > 8 ? '6px' : '8px' }}
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

                    {/* Center circle - smaller to accommodate pointer */}
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center z-10 border-4"
                      style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}
                    >
                      <div
                        className="w-4 h-4 border-2 rounded-sm"
                        style={{ backgroundColor: '#d4c4a8', borderColor: '#d4c4a8' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spin Button */}
              <div className="text-center">
                <Button
                  onClick={spinRoulette}
                  disabled={isSpinning || isPending || showModal || !!selectedActivity}
                  className="text-xl px-8 py-4 font-bold border-2 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}
                >
                  {isSpinning ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current mr-3"></div>
                      Draait...
                    </div>
                  ) : showModal || selectedActivity ? (
                    <div className="flex items-center">
                      <Play className="h-6 w-6 mr-3" />
                      Kies eerst Doe ik of Skip
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

          {/* Modal for Selected Activity */}
          <Dialog open={showModal}>
            <DialogContent className="max-w-md mx-auto" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
              <DialogHeader style={{ backgroundColor: '#6ECFF6', color: '#282C44' }} className="text-center">
                <DialogTitle className="text-xl flex items-center justify-center">
                  <Star className="h-6 w-6 mr-3" />
                  Jouw Gekozen Activiteit!
                </DialogTitle>
              </DialogHeader>

              {selectedActivity && (
                <div className="p-6">
                  <div className="text-center space-y-4 mb-4">
                    <h3 className="text-2xl font-bold" style={{ color: '#282C44' }}>
                      {selectedActivity.name}
                    </h3>
                    {selectedActivity.description && (
                      <p className="text-lg" style={{ color: '#282C44' }}>
                        {selectedActivity.description}
                      </p>
                    )}
                  </div>

                  {/* Category and Weight */}
                  <div className="flex justify-between items-end mb-4">
                    <Badge
                      variant="outline"
                      className="text-sm font-medium px-3 py-1"
                      style={{ borderColor: '#282C44', color: '#282C44', backgroundColor: '#f2ecd9' }}
                    >
                      {selectedActivity.type.name}
                    </Badge>
                    <div className="flex flex-col items-center" style={{ color: '#282C44' }}>
                      <span className="text-sm font-bold">{selectedActivity.weight}</span>
                      <Scale className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Time Logging Section */}
                  {showTimeLog && (
                    <div className="border-t-2 pt-4" style={{ borderColor: '#282C44' }}>
                      <form action={handleTimeLog} className="space-y-4">
                        {/* Time Input */}
                        <div className="flex items-center gap-2">
                          <Label htmlFor="timeSpent" className="text-sm font-medium" style={{ color: '#282C44' }}>
                            Tijd (min):
                          </Label>
                          <input
                            type="number"
                            id="timeSpent"
                            name="timeSpent"
                            value={timeSpent}
                            onChange={(e) => setTimeSpent(e.target.value)}
                            placeholder="30"
                            min="1"
                            className="w-20 border-2 py-1 px-2 rounded"
                            style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                          />
                        </div>

                        {/* Satisfaction Rating */}
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium" style={{ color: '#282C44' }}>
                            Rating:
                          </Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setSatisfaction(star)}
                                className="text-2xl transition-colors duration-200 hover:scale-110"
                                style={{
                                  color: star <= satisfaction ? '#282C44' : '#f2ecd9',
                                  textShadow: star <= satisfaction
                                    ? '0 0 3px rgba(40, 44, 68, 0.6)'
                                    : '-1px -1px 0 #282C44, 1px -1px 0 #282C44, -1px 1px 0 #282C44, 1px 1px 0 #282C44'
                                }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 justify-end">
                          <Button
                            type="button"
                            onClick={handleSkip}
                            size="sm"
                            className="border-2 hover:shadow-md transition-all duration-200"
                            style={{ backgroundColor: '#dc2626', color: 'white', borderColor: '#dc2626' }}
                          >
                            Skip
                          </Button>
                          <Button
                            type="submit"
                            disabled={isPending}
                            size="sm"
                            className="font-semibold border-2 hover:shadow-md transition-all duration-200"
                            style={{ backgroundColor: '#16a34a', color: 'white', borderColor: '#16a34a' }}
                          >
                            {isPending ? 'Bezig...' : 'Doe ik!'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Selected Activity with Time Logging */}
          {selectedActivity && (
            <Card className="w-full max-w-2xl shadow-lg border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
              <CardHeader style={{ backgroundColor: '#6ECFF6', color: '#282C44' }}>
                <CardTitle className="text-center text-xl">
                  <Star className="inline h-6 w-6 mr-3" />
                  Jouw Gekozen Activiteit!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 relative">
                <div className="text-center space-y-4 mb-4">
                  <h3 className="text-2xl font-bold" style={{ color: '#282C44' }}>
                    {selectedActivity.name}
                  </h3>
                  {selectedActivity.description && (
                    <p className="text-lg" style={{ color: '#282C44' }}>
                      {selectedActivity.description}
                    </p>
                  )}
                </div>

                {/* Category and Weight positioned above the border */}
                <div className="flex justify-between items-end mb-2">
                  <Badge
                    variant="outline"
                    className="text-sm font-medium px-3 py-1"
                    style={{ borderColor: '#282C44', color: '#282C44', backgroundColor: '#f2ecd9' }}
                  >
                    {selectedActivity.type.name}
                  </Badge>
                  <div className="flex flex-col items-center" style={{ color: '#282C44' }}>
                    <span className="text-sm font-bold">{selectedActivity.weight}</span>
                    <Scale className="h-4 w-4" />
                  </div>
                </div>

                {/* Time Logging Section */}
                {showTimeLog && (
                  <div className="border-t-2 pt-4 -mx-6 flex items-center justify-center min-h-[20px]" style={{ borderColor: '#282C44' }}>
                    <div className="px-6">
                      <form action={handleTimeLog} className="flex items-center gap-4 justify-center">
                        {/* Time Input */}
                        <div className="flex items-center gap-2">
                          <Label htmlFor="timeSpent" className="text-sm font-medium whitespace-nowrap" style={{ color: '#282C44' }}>
                            Tijd (min):
                          </Label>
                          <input
                            type="number"
                            id="timeSpent"
                            name="timeSpent"
                            value={timeSpent}
                            onChange={(e) => setTimeSpent(e.target.value)}
                            placeholder="30"
                            min="1"
                            className="w-20 border-2 py-1 px-2"
                            style={{ borderColor: '#282C44', backgroundColor: '#f2ecd9' }}
                          />
                        </div>

                        {/* Satisfaction Rating */}
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium whitespace-nowrap" style={{ color: '#282C44' }}>
                            Rating:
                          </Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setSatisfaction(star)}
                                className="text-2xl transition-colors duration-200 hover:scale-110"
                                style={{
                                  color: star <= satisfaction ? '#282C44' : '#f2ecd9',
                                  textShadow: star <= satisfaction
                                    ? '0 0 3px rgba(40, 44, 68, 0.6)'
                                    : '-1px -1px 0 #282C44, 1px -1px 0 #282C44, -1px 1px 0 #282C44, 1px 1px 0 #282C44'
                                }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowTimeLog(false)}
                            size="sm"
                            className="border-2"
                            style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}
                          >
                            Overslaan
                          </Button>
                          <Button
                            type="submit"
                            disabled={isPending}
                            size="sm"
                            className="font-semibold border-2 hover:shadow-md transition-all duration-200"
                            style={{ backgroundColor: '#282C44', color: '#d4c4a8', borderColor: '#282C44' }}
                          >
                            {isPending ? 'Bezig...' : 'Opslaan'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
