import type { ReactNode } from 'react'
import { type Variants, motion } from 'framer-motion'

const formVariants: Variants = {
  hidden: {
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
}

type AnimatedFormProps = {
  children: ReactNode
}

export function AnimatedForm({ children }: AnimatedFormProps) {
  return (
    <motion.form
      variants={formVariants}
      initial='hidden'
      animate='visible'
      className='flex w-full flex-col gap-8'
      onSubmit={(event) => event.preventDefault()}
    >
      {children}
    </motion.form>
  )
}
