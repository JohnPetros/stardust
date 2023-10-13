import { useEffect, useState } from 'react'

import { Animation } from '@/app/components/Animation'
import Transition from '../../../../../public/animations/transition.json'

import { AnimatePresence, Variants, motion } from 'framer-motion'

import { CODE_TIPS } from '@/utils/constants'
import { formatText } from '@/utils/functions'

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

export function TransitionPageAnimation({
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
  }, [hasTips, CODE_TIPS])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="visible"
          exit="hidden"
          className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 z-50 flex items-center justify-center"
        >
          <motion.div variants={apolloVariants}>
            <Animation src={Transition} size={540} />
            {hasTips && codeTip && (
              <p className="text-gray-100 text-center max-w-lg">
                Dica: {formatText(codeTip)}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
