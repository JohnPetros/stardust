'use client'

import { useCallback, useEffect, useState } from 'react'
import type { LottieRef } from 'lottie-react'
import type { AnimationSpeed } from '../types/AnimationSpeed'

export function useLottieAnimation(lottieRef: LottieRef) {
  const [windowWidth, setWindowWidth] = useState(0)

  const restart = useCallback(() => {
    lottieRef.current?.goToAndPlay(0)
  }, [lottieRef.current?.goToAndPlay])

  const stopAt = useCallback(
    (second: number) => {
      lottieRef.current?.goToAndStop(second * 100, true)
    },
    [lottieRef.current?.goToAndStop],
  )

  const setSpeed = useCallback(
    (speed: AnimationSpeed) => {
      const speeds: Record<AnimationSpeed, number> = {
        '0.5x': 0.5,
        '1x': 1,
        '1.5x': 1.5,
        '2x': 2,
      }

      lottieRef.current?.setSpeed(speeds[speed])
    },
    [lottieRef.current?.setSpeed],
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
    }
  }, [])

  return {
    windowWidth,
    lottieRef,
    restart,
    stopAt,
    setSpeed,
  }
}
