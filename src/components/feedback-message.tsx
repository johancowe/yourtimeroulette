'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function FeedbackMessage() {
  const [show, setShow] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const deleted = searchParams.get('deleted')
    if (deleted === 'true') {
      setShow(true)
      
      // Clear the URL parameter
      const url = new URL(window.location.href)
      url.searchParams.delete('deleted')
      router.replace(url.pathname, { scroll: false })
      
      // Hide message after 3 seconds
      const timer = setTimeout(() => {
        setShow(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  if (!show) return null

  return (
    <div 
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-md shadow-lg border-2 transition-all duration-300"
      style={{ 
        backgroundColor: '#22c55e', 
        color: '#ffffff', 
        borderColor: '#16a34a' 
      }}
    >
      <CheckCircle className="h-5 w-5" />
      <span className="font-medium">Alle activiteiten logs zijn succesvol verwijderd!</span>
    </div>
  )
}
