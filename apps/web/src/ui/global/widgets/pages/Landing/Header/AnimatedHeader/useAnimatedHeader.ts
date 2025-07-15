import { useScroll, useMotionValueEvent } from 'motion/react'
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
      setIsVisible(true)
      return
    }
    setIsVisible(false)
  }

  useMotionValueEvent(scrollY, 'change', handleScrollYChange)

  return {
    isVisible,
  }
}
