'use client'

import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'

import { Animation } from '@/modules/global/components/shared/Animation'

const appMessageAnimations: Variants = {
  hidden: {
    opacity: 0,
    y: -150,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

type AppMessageProps = {
  title: string
  subtitle: string
  footer: ReactNode
}

export function AppMessage({ title, subtitle, footer }: AppMessageProps) {
  return (
    <motion.div
      variants={appMessageAnimations}
      initial='hidden'
      animate='visible'
      exit='hidden'
      transition={{
        type: 'spring',
        duration: 0.8,
      }}
      className='z-50 mx-auto flex w-full flex-col items-center space-y-5'
    >
      <Animation name='apollo-asking' size={200} hasLoop={true} />

      <h1 className='text-center text-lg text-gray-50'>{title}</h1>
      <p className='text-center text-gray-300'>{subtitle}</p>
      {footer}
    </motion.div>
  )
}
