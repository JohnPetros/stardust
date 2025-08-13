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

type Props = {
  isVisible: boolean
}

export const AnimatedHeroView = ({ isVisible }: Props) => {
  return (
    <AnimatePresence>
      {!isVisible && (
        <motion.div
          variants={variants}
          data-testid='animated-hero'
          exit='hidden'
          className='hidden bg-gray-800 lg:grid lg:place-content-center'
        >
          <Hero />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
