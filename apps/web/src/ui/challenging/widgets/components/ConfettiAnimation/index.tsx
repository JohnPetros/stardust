'use client'

import ReactConfetti from 'react-confetti'
import { useConfettiAnimation } from './useConfettiAnimation'

type ConfettiAnimationProps = {
  delay?: number // seconds
}

export function ConfettiAnimation({ delay = 0 }: ConfettiAnimationProps) {
  const { width, height, isVisible } = useConfettiAnimation(delay)

  if (isVisible)
    return (
      <ReactConfetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={800}
        tweenDuration={15000}
        gravity={0.15}
      />
    )
}
