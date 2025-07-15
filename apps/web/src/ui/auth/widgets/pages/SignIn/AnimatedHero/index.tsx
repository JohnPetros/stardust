'use client'

import { AnimatePresence, type Variants, motion } from 'motion/react'
import { Hero } from '../../../components/Hero'

const variants: Variants = {
  hidden: {
    opacity: 0,
    x: '75vw',
    transition: {
      duration: 2,
    },
  },
}

type AnimatedHeroProps = {
  isVisible: boolean
}

export function AnimatedHero({ isVisible }: AnimatedHeroProps) {
  return (
    <AnimatePresence>
      {!isVisible && (
        <motion.div
          variants={variants}
          exit='hidden'
          className='hidden bg-gray-800 lg:grid lg:place-content-center'
        >
          <Hero />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
