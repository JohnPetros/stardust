'use client'
import Lottie from 'lottie-react'

import RewardShinning from '../../../../../../public/animations/reward-shinning.json'

interface ShinningAnimationProps {
  size: number
}

export function ShinningAnimation({ size }: ShinningAnimationProps) {
  return (
    <Lottie
      animationData={RewardShinning}
      loop={true}
      style={{ width: size, zIndex: 0 }}
    />
  )
}
