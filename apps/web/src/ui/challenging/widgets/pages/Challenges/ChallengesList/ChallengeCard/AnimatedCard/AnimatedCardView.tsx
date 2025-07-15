import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

const challengeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

type Props = {
  children: ReactNode
}

export const AnimatedCardView = ({ children }: Props) => {
  return (
    <motion.article
      variants={challengeVariants}
      initial='hidden'
      animate='visible'
      className='flex flex-col gap-5 rounded-md bg-gray-800 p-6'
    >
      {children}
    </motion.article>
  )
}
