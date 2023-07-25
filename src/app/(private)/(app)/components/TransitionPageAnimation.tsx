import { Animation } from '@/app/components/Animation'

import Transition from '../../../../../public/animations/transition.json'

import { AnimatePresence, Variants, motion } from 'framer-motion'

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

interface TransitionPageAnimationProps {
  isVisible: boolean
}

export function TransitionPageAnimation({
  isVisible,
}: TransitionPageAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="visible"
          exit="hidden"
          className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 z-50 flex items-center justify-center"
        >
          <motion.div variants={apolloVariants}>
            <Animation src={Transition} size={540} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
