'use client'
import Lottie from 'lottie-react'

import StreakAnimation from '../../../../../../public/animations/streak.json'

interface StreakIconProps {
  size: number
}

export function StreakIcon({ size }: StreakIconProps) {
  return (
    <>
      <Lottie
        animationData={StreakAnimation}
        style={{ width: size }}
        loop={false}
      />
    </>
  )
}
