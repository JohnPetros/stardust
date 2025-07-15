import { type RefObject, useEffect } from 'react'
import { useScroll, useTransform, useInView } from 'motion/react'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

export function useAnimatedSection(
  sectionRef: RefObject<HTMLDivElement | null>,
  animationRef: RefObject<AnimationRef | null>,
) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const isInView = useInView(sectionRef)
  const textBlockYPosition = useTransform(scrollYProgress, [0, 1], ['0%', '300%'])
  const shopPreviewXPosition = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    if (isInView) animationRef.current?.restart()
  }, [isInView, animationRef.current?.restart])

  return {
    textBlockYPosition,
    shopPreviewXPosition,
  }
}
