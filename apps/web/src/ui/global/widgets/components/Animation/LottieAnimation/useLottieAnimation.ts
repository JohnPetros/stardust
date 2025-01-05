'use client'

import { useEffect, useRef, useState } from 'react'
import type { LottieRef } from 'lottie-react'

export function useLottieAnimation() {
  const [windowWidth, setWindowWidth] = useState(0)
  const lottieRef = useRef(null) as LottieRef

  function restart() {
    lottieRef.current?.goToAndPlay(0)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') setWindowWidth(window.innerWidth)
  }, [])

  return {
    windowWidth,
    lottieRef,
    restart,
  }
}
