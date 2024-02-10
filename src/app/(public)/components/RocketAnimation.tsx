'use client'
import { motion, Variants } from 'framer-motion'
import Lottie, { LottieRef } from 'lottie-react'

import RocketLaunching from '../../../../public/animations/rocket-launching.json'

import { ROCKET_ANIMATION_DELAY } from '@/global/constants'

const rocketVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: ROCKET_ANIMATION_DELAY,
      duration: 0.8,
    },
  },
}

interface RocketProps {
  animationRef: LottieRef
  isVisible: boolean
}

export function RocketAnimation({ animationRef, isVisible }: RocketProps) {
  return (
    <motion.div
      variants={rocketVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : ''}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      aria-live="polite"
    >
      <Lottie
        lottieRef={animationRef}
        animationData={RocketLaunching}
        style={{ width: 640, height: 640 }}
        loop={false}
      />
    </motion.div>
  )
}
