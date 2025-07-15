'use client'

import type { Ref } from 'react'
import { type Variants, motion } from 'motion/react'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'

const rocketVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: ROCKET_ANIMATION_DELAY / 1000,
      duration: 1,
    },
  },
}

type RocketProps = {
  animationRef: Ref<AnimationRef>
  isVisible: boolean
}

export function RocketAnimation({ animationRef, isVisible }: RocketProps) {
  return (
    <motion.div
      variants={rocketVariants}
      initial='hidden'
      animate={isVisible ? 'visible' : ''}
      className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-20'
      aria-live='polite'
    >
      <Animation ref={animationRef} name='rocket-lauching' size={640} hasLoop={false} />
    </motion.div>
  )
}
