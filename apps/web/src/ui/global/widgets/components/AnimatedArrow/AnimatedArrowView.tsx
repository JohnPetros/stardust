import { ArrowDown } from '@phosphor-icons/react'
import { motion, type Variants } from 'framer-motion'

const arrowAnimations: Variants = {
  down: {
    rotate: '0',
  },
  up: {
    rotate: '180deg',
  },
}

type Props = {
  isUp: boolean
}

export const AnimatedArrowView = ({ isUp }: Props) => {
  return (
    <motion.span
      variants={arrowAnimations}
      initial='down'
      animate={isUp ? 'up' : ''}
      transition={{ type: 'tween', ease: 'linear' }}
    >
      <ArrowDown weight='bold' className='text-lg text-gray-200' />
    </motion.span>
  )
}
