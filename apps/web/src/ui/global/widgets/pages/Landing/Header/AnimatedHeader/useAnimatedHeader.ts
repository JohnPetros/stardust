import { useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

export function useAnimatedHeader() {
  const { scrollY } = useScroll()
  const [isVisible, setIsVisible] = useState(false)

  function handleScrollYChange(currentScrollYValue: number) {
    const previosScrollYValue = scrollY.getPrevious()
    if (
      currentScrollYValue > previosScrollYValue &&
      currentScrollYValue > window.innerHeight
    ) {
      setIsVisible(false)
      return
    }
    setIsVisible(true)
  }

  useMotionValueEvent(scrollY, 'change', handleScrollYChange)

  return {
    isVisible,
  }
}
