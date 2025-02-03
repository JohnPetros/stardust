'use client'

import { useRef, type PropsWithChildren } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import { Animation } from '@/ui/global/widgets/components/Animation'

export function AnimatedContent({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const contentXPosition = useTransform(scrollYProgress, [0, 1], [0, '-100%'])
  const animationXPosition = useTransform(scrollYProgress, [0, 1], [0, '100%'])

  return (
    <div ref={ref} className='flex flex-col md:flex-row mt-6 w-full'>
      <motion.div
        style={{ x: animationXPosition }}
        className='hidden sm:block absolute right-0'
      >
        <Animation name='planets-exploration' size={610} />
      </motion.div>
      <motion.div
        style={{ x: contentXPosition }}
        className='w-96 flex flex-col gap-6 mt-6'
      >
        {children}
      </motion.div>
    </div>
  )
}
