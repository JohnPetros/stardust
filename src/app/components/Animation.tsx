'use client'
import Lottie, { LottieRef } from 'lottie-react'

interface AnimationProps {
  animationRef?: LottieRef
  src: Object
  size: number
  hasLoop?: boolean
}

export function Animation({
  animationRef,
  src,
  size,
  hasLoop = true,
}: AnimationProps) {
  return (
    <Lottie
      lottieRef={animationRef}
      animationData={src}
      style={{ width: size, height: size }}
      loop={hasLoop}
    />
  )
}
