import { AnimatePresence, motion, Variants } from 'framer-motion'

import { usePageTransitionAnimation } from './usePageTransitionAnimation'

import { formatText } from '@/modules/global/utils'
import { Animation } from '../Animation'

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
  visible: { opacity: 1 },
}

const apolloVariants: Variants = {
  initial: {
    opacity: 0,
  },
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
}

type TransitionPageAnimationProps = {
  isVisible: boolean
  hasTips?: boolean
}

export function PageTransitionAnimation({
  isVisible,
  hasTips = false,
}: TransitionPageAnimationProps) {
  const { codeTip } = usePageTransitionAnimation(hasTips)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial='initial'
          animate='visible'
          exit='hidden'
          className='fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-900'
          data-testid='page transition'
        >
          <motion.div variants={apolloVariants}>
            <Animation name='apollo-riding-rocket' size={540} hasLoop={true} />
            {/* {hasTips && codeTip && (
              <div className='mx-auto w-[32rem] max-w-[90%] -translate-y-10 rounded-md bg-gray-700 p-2 text-center leading-8 text-gray-100'>
                <Mdx>{codeTip}</Mdx>
              </div>
            )} */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
