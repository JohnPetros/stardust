'use client'

import { motion, useAnimationControls, useInView } from 'motion/react'
import { type PropsWithChildren, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

type AnimatedRevealProps = {
  delay?: number
  className?: string
}

export function AnimatedReveal({
  children,
  delay = 0.25,
  className,
}: PropsWithChildren<AnimatedRevealProps>) {
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
    <div ref={containerRef} className={twMerge('relative w-fit h-fit', className)}>
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: 35,
          },
          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        initial='hidden'
        animate={contentAnimationControls}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
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
        transition={{ duration: 0.5, delay, ease: 'easeIn' }}
        className='absolute top-1 right-1 left-0 bottom-0 z-20 bg-green-500'
      />
    </div>
  )
}
