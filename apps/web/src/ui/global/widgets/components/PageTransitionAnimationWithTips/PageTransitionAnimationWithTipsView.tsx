import { motion, type Variants } from 'motion/react'

import { Mdx } from '../Mdx'

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
  visible: { opacity: 1 },
}

type Props = {
  codeTip: string
}

export const PageTransitionAnimationWithTipsView = ({ codeTip }: Props) => {
  return (
    <motion.div
      variants={containerVariants}
      initial='initial'
      animate='visible'
      transition={{ delay: 0.5 }}
      className='mx-auto w-[32rem] max-w-[90%] -translate-y-10 rounded-md bg-gray-700 p-2 text-center leading-8 text-gray-100'
    >
      <Mdx>{codeTip}</Mdx>
    </motion.div>
  )
}
