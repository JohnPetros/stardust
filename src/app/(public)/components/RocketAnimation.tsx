'use client'
import Lottie, { LottieRef } from 'lottie-react'
import { motion, Variants } from 'framer-motion'

import RocketLaunching from '../../../../public/animations/rocket-launching.json'
import { ROCKET_ANIMATION_DURATION } from '@/utils/constants'

const rocketVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: ROCKET_ANIMATION_DURATION,
      duration: 0.4,
    },
  },
}

interface RocketProps {
  animationRef: LottieRef
  isVisible: boolean
}

export function RocketAnimation({
  animationRef,
  isVisible,
}: RocketProps) {
  return (
    <motion.div
      variants={rocketVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : ''}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
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
