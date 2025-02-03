import { type RefObject, useEffect } from 'react'
import { animate, useInView } from 'framer-motion'

type AnimatedCounterProps = {
  from: number
  to: number
  speed: number
  elementRef: RefObject<HTMLElement>
}

export function useAnimatedCounter({
  from,
  to,
  speed,
  elementRef,
}: AnimatedCounterProps) {
  const isInView = useInView(elementRef, { once: true })

  useEffect(() => {
    const element = elementRef.current
    if (!element || !isInView) return

    element.textContent = String(from)

    const animation = animate(from, to, {
      duration: speed,
      ease: 'easeOut',
      onUpdate: (value) => {
        element.textContent = value.toFixed(0)
      },
    })

    return () => animation.stop()
  }, [from, to, speed, elementRef.current, isInView])
}
