'use client'

import type { ReactNode } from 'react'

import { motion, type Variants } from 'framer-motion'

const variants: Variants = {
  hidden: {
    width: 0,
    borderLeftWidth: 0,
  },
  visible: {
    width: 320,
    borderLeftWidth: 1,
    transition: {
      delay: 0.2,
      staggerChildren: 0.2,
      when: 'beforeChildren',
    },
  },
}

type AnimatedAchievementsListProps = {
  children: ReactNode
  isAchievementsListVisible: boolean
}

export function AnimatedAchievementsList({
  children,
  isAchievementsListVisible,
}: AnimatedAchievementsListProps) {
  return (
    <motion.div
      variants={variants}
      initial='hidden'
      animate={isAchievementsListVisible ? 'visible' : 'hidden'}
      exit='hidden'
      className='custom-scrollbar absolute right-0 top-0 mt-16 h-full translate-x-[100%] overflow-hidden overflow-y-scroll border-green-400 bg-gray-900'
    >
      {children}
    </motion.div>
  )
}
