import { AnimatePresence, motion, Variants } from 'framer-motion'
import Image from 'next/image'
import { ClassNameValue, twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { useVerificationButton } from './useVerificationButton'

import { Button } from '@/global/components/Button'

const buttonStyles = tv({
  base: 'w-64',
  variants: {
    color: {
      green: 'border-gray-100 text-gray-900',
      red: 'bg-red-700 text-gray-100',
    },
  },
})

const feedbackAnimations: Variants = {
  down: {
    height: 0,
  },
  up: {
    height: 80,
    transition: {
      type: 'spring',
      duration: 0.4,
    },
  },
}

export type VerificationButtonProps = {
  answerHandler: () => void
  isAnswered: boolean
  isAnswerVerified: boolean
  isAnswerCorrect: boolean
  className?: ClassNameValue
}

export function VerificationButton({
  answerHandler,
  isAnswerCorrect,
  isAnswerVerified,
  isAnswered,
  className,
}: VerificationButtonProps) {
  const { buttonRef, buttonTitle, buttonHasFocus, handleButtonClick } =
    useVerificationButton({
      answerHandler,
      isAnswerCorrect,
      isAnswerVerified,
      isAnswered,
    })

  return (
    <div
      className={twMerge(
        'fixed bottom-0 mt-auto flex w-full flex-col items-center justify-center gap-2 border-t px-6 py-3 ',
        isAnswerVerified && !isAnswerCorrect
          ? 'border-red-700 bg-green-900'
          : 'border-green-500 bg-green-900',
        className
      )}
    >
      <div>
        <AnimatePresence>
          {isAnswerVerified && (
            <motion.div
              variants={feedbackAnimations}
              initial="down"
              animate="up"
              exit="down"
              className="flex h-20 flex-col items-center gap-1 overflow-hidden"
            >
              <Image
                src={`/icons/${
                  isAnswerVerified && !isAnswerCorrect
                    ? 'incorrect-answer.svg'
                    : 'correct-answer.svg'
                }`}
                width={48}
                height={48}
                priority
                alt=""
              />
              <strong
                className={twMerge(
                  'text-lg',
                  isAnswerVerified && !isAnswerCorrect
                    ? 'text-red-700'
                    : 'text-green-400'
                )}
              >
                {isAnswerCorrect ? 'Correto, parabéns!' : 'Oops, tente denovo!'}
              </strong>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        ref={buttonRef}
        onClick={handleButtonClick}
        onFocus={() => (buttonHasFocus.current = true)}
        onBlur={() => (buttonHasFocus.current = false)}
        className={buttonStyles({
          color: isAnswerVerified && !isAnswerCorrect ? 'red' : 'green',
        })}
        disabled={!isAnswered}
      >
        {buttonTitle}
      </Button>
    </div>
  )
}
