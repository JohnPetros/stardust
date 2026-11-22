'use client'

import { useRef } from 'react'

import type { AnimationProps } from '../types'
import { useLottieAnimation } from './useLottieAnimation'
import { LottieAnimationView } from './LottieAnimationView'

export const LottieAnimation = ({
  ref,
  name,
  src,
  size,
  hasLoop = true,
  isStatic = false,
  onLoadError,
}: AnimationProps) => {
  const lottieRef = useRef(null)
  const { lottieData, windowWidth, shouldAutoplay, shouldLoop } = useLottieAnimation({
    ref,
    lottieRef,
    name,
    src,
    hasLoop,
    isStatic,
    onLoadError,
  })

  return (
    <LottieAnimationView
      lottieRef={lottieRef}
      lottieData={lottieData}
      size={size}
      windowWidth={windowWidth}
      autoplay={shouldAutoplay}
      loop={shouldLoop}
    />
  )
}
