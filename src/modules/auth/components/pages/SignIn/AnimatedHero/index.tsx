'use client'

import { AnimatePresence, Variants, motion } from 'framer-motion'

import { Hero } from '../../../shared/Hero'

const heroVariants: Variants = {
  initial: {
    opacity: 0,
    x: -250,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      duration: 0.4,
    },
  },
  hidden: {
    opacity: 0,
    x: -750,
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
          variants={heroVariants}
          exit='hidden'
          className='hidden bg-gray-800 lg:grid lg:place-content-center'
        >
          <Hero />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
