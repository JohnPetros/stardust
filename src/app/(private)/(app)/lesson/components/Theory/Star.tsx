'use client'

import Lottie from 'lottie-react'

import UnlockedStar from '../../../../../../../public/animations/unlocked-star.json'

interface StarProps {
  number: number
}

export function Star({ number }: StarProps) {
  return (
    <div className="relative">
      <Lottie animationData={UnlockedStar} style={{ width: 80 }} loop={false} />
      <span className="absolute left-[52%] top-[51%] block -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-yellow-700">
        {number}
      </span>
    </div>
  )
}
