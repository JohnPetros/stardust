'use client'

import { useEffect, useRef, type PropsWithChildren } from 'react'
import { motion, useInView } from 'framer-motion'

import { Animation } from '@/ui/global/widgets/components/Animation'
import { AnimatedCounter } from '@/ui/global/widgets/components/AnimatedCounter'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { AnimatedReveal } from '../../AnimatedReveal'

const variants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export function AnimatedBoard({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationRef>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      animationRef.current?.restart()
    }
  }, [isInView])

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ durantion: 1, delay: 0.2 }}
      className='grid place-content-center w-full'
    >
      <AnimatedReveal>{children}</AnimatedReveal>
      <div className='flex items-center w-max mx-auto mt-3'>
        <Animation ref={animationRef} name='streak' size={120} hasLoop={false} />
        <span className='block text-green-400 font-font-semibold w-24 text-4xl -translate-x-3'>
          <AnimatedCounter from={0} to={524} speed={3.5} />
        </span>
      </div>
    </motion.div>
  )
}
