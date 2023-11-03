import { useEffect, useState } from 'react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import Lottie from 'lottie-react'

import TransitionAnimation from '../../../public/animations/transition.json'

import { CODE_TIPS } from '@/utils/constants'
import { formatText } from '@/utils/helpers'

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
  hasTips?: boolean
}

export function PageTransitionAnimation({
  isVisible,
  hasTips = false,
}: TransitionPageAnimationProps) {
  const [codeTip, setCodeTip] = useState('')

  useEffect(() => {
    if (hasTips) {
      const randomNumber = Math.floor(Math.random() * CODE_TIPS.length - 1) + 1
      const codeTip = CODE_TIPS[randomNumber]
      setCodeTip(codeTip)
    }
  }, [hasTips])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="visible"
          exit="hidden"
          className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-900"
          data-testid="page transition"
        >
          <motion.div variants={apolloVariants}>
            <Lottie
              animationData={TransitionAnimation}
              style={{ width: 540 }}
              loop={false}
            />
            {hasTips && codeTip && (
              <p className="max-w-lg text-center text-gray-100">
                Dica: {formatText(codeTip)}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
