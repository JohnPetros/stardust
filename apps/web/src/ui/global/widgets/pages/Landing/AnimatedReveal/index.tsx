'use client'

import { motion, useAnimationControls, useInView } from 'framer-motion'
import { type PropsWithChildren, useEffect, useRef } from 'react'

export function AnimatedReveal({ children }: PropsWithChildren) {
  const containerRef = useRef(null)
  const contentAnimationControls = useAnimationControls()
  const slideAnimationControls = useAnimationControls()
  const isInView = useInView(containerRef, { once: true })

  useEffect(() => {
    if (isInView) {
      contentAnimationControls.start('visible')
      slideAnimationControls.start('visible')
    }
  }, [isInView, contentAnimationControls.start, slideAnimationControls.start])

  return (
    <div ref={containerRef} className='relative w-fit'>
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: 75,
          },
          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        initial='hidden'
        animate={contentAnimationControls}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{
          hidden: {
            left: 0,
          },
          visible: {
            left: '100%',
          },
        }}
        initial='hidden'
        animate={slideAnimationControls}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        className='absolute top-1 right-1 left-0 bottom-0 z-20 bg-green-400'
      />
    </div>
  )
}
