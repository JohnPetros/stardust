import { motion, type Variants } from 'framer-motion'

import { Animation } from '@/modules/global/components/shared/Animation'

const variants: Variants = {
  default: {
    scale: 1,
  },
  pulse: {
    scale: 1.15,
    transition: {
      repeat: Infinity,
      repeatType: 'mirror',
      duration: 0.4,
    },
  },
}

type AnimatedImageProps = {
  shouldAnimate: boolean
}

export function AnimatedImage({ shouldAnimate }: AnimatedImageProps) {
  return (
    <motion.div
      variants={variants}
      initial='default'
      animate={shouldAnimate ? 'pulse' : ''}
      className='-ml-[36px]'
    >
      <Animation name='unlocked-star' size={100} hasLoop={false} />
    </motion.div>
  )
}
