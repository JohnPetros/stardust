import { useAnimation } from 'framer-motion'
import { useCallback, useEffect } from 'react'

export function useAnimatedProgressBar(value: number) {
  const animation = useAnimation()

  const fill = useCallback(
    (percentage: number, animationDuration = 0.3) => {
      animation.start({
        width: `${percentage}%`,
        transition: { duration: animationDuration, ease: 'linear' },
      })
    },
    [animation.start],
  )

  useEffect(() => {
    fill(value)
  }, [value, fill])

  return {
    animation,
    fill,
  }
}
