'use client'

import { type ComponentProps, useRef } from 'react'
import { useAnimatedCounter } from './useAnimatedCounter'

type AnimatedCounterProps = {
  from: number
  to: number
} & ComponentProps<'span'>

export function AnimatedCounter({ from, to, ...spanProps }: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null)
  useAnimatedCounter(from, to, spanRef)

  return <span ref={spanRef} {...spanProps} />
}
