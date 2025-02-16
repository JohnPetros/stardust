'use client'

import { type ComponentProps, useRef } from 'react'
import { useAnimatedCounter } from './useAnimatedCounter'

type AnimatedCounterProps = {
  from: number
  to: number
  speed?: number
} & ComponentProps<'span'>

export function AnimatedCounter({ from, to, speed, ...spanProps }: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null)
  useAnimatedCounter({ from, to, speed: speed ?? 2.5, elementRef: spanRef })

  return <span ref={spanRef} {...spanProps} />
}
