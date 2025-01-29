'use client'

import { useRef, type PropsWithChildren } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import { Animation } from '@/ui/global/widgets/components/Animation'

export function AnimatedContent({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentXPosition = useTransform(scrollY, [0, 1], [0, '100%'])
  const animationXPosition = useTransform(scrollY, [0, 1], [0, '-100%'])
  const opacity = useTransform(scrollY, [0, 1], [1, 0])

  return (
    <div ref={ref} className='flex mt-6'>
      <motion.div style={{ x: animationXPosition, opacity: opacity.get() }}>
        <Animation name='planets-exploration' size={610} />
      </motion.div>
      <motion.div
        style={{ x: contentXPosition, opacity: opacity.get() }}
        className='w-96 flex flex-col gap-6 mt-6'
      >
        {children}
      </motion.div>
    </div>
  )
}
