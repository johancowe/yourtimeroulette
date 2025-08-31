'use client'

import { useState } from 'react'

interface SatisfactionPickerProps {
  defaultSatisfaction?: number | null
  name: string
}

export default function SatisfactionPicker({ defaultSatisfaction, name }: SatisfactionPickerProps) {
  const [satisfaction, setSatisfaction] = useState(defaultSatisfaction || 0)

  return (
    <div>
      <input type="hidden" name={name} value={satisfaction || ''} />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setSatisfaction(star)}
            className="text-2xl transition-colors duration-200 hover:scale-110"
          >
            <span
              style={{
                color: star <= satisfaction ? '#282C44' : '#f2ecd9',
                textShadow: star <= satisfaction
                  ? '0 0 3px rgba(40, 44, 68, 0.6)'
                  : '-1px -1px 0 #282C44, 1px -1px 0 #282C44, -1px 1px 0 #282C44, 1px 1px 0 #282C44'
              }}
            >
              ★
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
