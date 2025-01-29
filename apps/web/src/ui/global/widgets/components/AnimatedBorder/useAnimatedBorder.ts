'use client'

import { type RefObject, useEffect } from 'react'
import {
  animate,
  useMotionTemplate,
  useMotionValue,
  type ValueAnimationTransition,
} from 'framer-motion'

export function useAnimatedBorder(containerRef: RefObject<HTMLDivElement>) {
  const xPercentage = useMotionValue(0)
  const yPercentage = useMotionValue(0)
  const maskImage = useMotionTemplate`radial-gradient(80px 80px at ${xPercentage}% ${yPercentage}%, black, transparent)`

  useEffect(() => {
    if (!containerRef.current) return
    const { height, width } = containerRef.current.getBoundingClientRect()
    const circumference = height * 2 + width * 2

    const times = [
      0,
      width / circumference,
      (width + height) / circumference,
      (width * 2 + height) / circumference,
      1,
    ]
    const animationTransition: ValueAnimationTransition = {
      times,
      duration: 4,
      repeat: Infinity,
      ease: 'linear',
      repeatType: 'loop',
    }

    animate(xPercentage, [0, 100, 100, 0, 0], animationTransition)
    animate(yPercentage, [0, 0, 100, 100, 0], animationTransition)
  }, [xPercentage, yPercentage, containerRef.current])

  return {
    maskImage,
  }
}
