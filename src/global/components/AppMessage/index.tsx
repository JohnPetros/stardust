'use client'
import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'
import Lottie from 'lottie-react'

import Animation from '../../../../public/animations/apollo-asking.json'

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
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{
        type: 'spring',
        duration: 0.8,
      }}
      className="z-50 mx-auto flex w-full flex-col items-center space-y-5"
    >
      <Lottie animationData={Animation} style={{ width: 200 }} loop={true} />
      <h1 className="text-center text-lg text-gray-50">{title}</h1>
      <p className="text-center text-gray-300">{subtitle}</p>
      {footer}
    </motion.div>
  )
}
