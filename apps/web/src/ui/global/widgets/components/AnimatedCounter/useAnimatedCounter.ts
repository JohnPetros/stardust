import { type RefObject, useEffect } from 'react'
import { animate, useInView } from 'framer-motion'

export function useAnimatedCounter(
  from: number,
  to: number,
  elementRef: RefObject<HTMLElement>,
) {
  const isInView = useInView(elementRef, { once: true })

  useEffect(() => {
    const element = elementRef.current
    if (!element || !isInView) return

    element.textContent = String(from)

    const animation = animate(from, to, {
      duration: 10,
      ease: 'easeOut',
      onUpdate: (value) => {
        element.textContent = value.toFixed(0)
      },
    })

    return () => {
      animation.stop()
    }
  }, [from, to, elementRef.current, isInView])
}
