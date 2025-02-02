'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { LottieRef } from 'lottie-react'

export function useLottieAnimation() {
  const [windowWidth, setWindowWidth] = useState(0)
  const lottieRef = useRef(null) as LottieRef

  const restart = useCallback(() => {
    lottieRef.current?.goToAndPlay(0)
  }, [lottieRef.current?.goToAndPlay])

  const stopAt = useCallback(
    (second: number) => {
      lottieRef.current?.goToAndStop(second * 100, true)
    },
    [lottieRef.current?.goToAndStop],
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
  }
}
