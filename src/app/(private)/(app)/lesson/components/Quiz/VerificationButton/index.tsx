import { Button } from '@/app/components/Button'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { playSound } from '@/utils/functions'

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

interface VerificationButtonProps {
  answerHandler: () => void
  isAnswered: boolean
  isAnswerVerified: boolean
  isAnswerCorrect: boolean
  isChallenge: boolean
}

export function VerificationButton({
  answerHandler,
  isAnswerCorrect,
  isAnswerVerified,
  isAnswered,
  isChallenge = false,
}: VerificationButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const buttonHasFocus = useRef(false)

  function getButtonTitle() {
    if (isAnswerVerified && !isAnswerCorrect) {
      return 'Tentar novamente'
    } else if (isAnswerVerified) {
      return 'Continuar'
    } else {
      return 'Verificar'
    }
  }

  function handleButtonClick() {
    answerHandler()
  }

  function handleGlobalKeyDown({ key }: KeyboardEvent) {
    if (key === 'Enter' && isAnswered && !buttonHasFocus.current) {
      answerHandler()
    }
  }

  useEffect(() => {
    if (isAnswerVerified) {
      playSound(isAnswerCorrect ? 'success.wav' : 'fail.wav')
    }
  }, [isAnswerVerified])

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [handleGlobalKeyDown])

  return (
    <div
      className={twMerge(
        'fixed bottom-0 border-t w-full px-6 py-4 flex flex-col items-center justify-center gap-2 ',
        isAnswerVerified && !isAnswerCorrect
          ? 'border-red-700 bg-green-900'
          : 'border-green-500 bg-green-900'
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
              className="flex flex-col items-center gap-1 overflow-hidden h-20"
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
        buttonRef={buttonRef}
        onClick={handleButtonClick}
        onFocus={() => (buttonHasFocus.current = true)}
        onBlur={() => (buttonHasFocus.current = false)}
        className={buttonStyles({
          color: isAnswerVerified && !isAnswerCorrect ? 'red' : 'green',
        })}
        disabled={!isAnswered}
      >
        {getButtonTitle()}
      </Button>
    </div>
  )
}
