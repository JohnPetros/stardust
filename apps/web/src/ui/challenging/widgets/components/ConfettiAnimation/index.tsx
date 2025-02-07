'use client'

import ReactConfetti from 'react-confetti'
import { useConfettiAnimation } from './useConfettiAnimation'

export function ConfettiAnimation() {
  const { width, height } = useConfettiAnimation()

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
