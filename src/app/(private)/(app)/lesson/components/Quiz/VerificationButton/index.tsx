import { Button } from '@/app/components/Button'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'
import { Variants, motion } from 'framer-motion'

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
  hidden: {
    height: 0,
  },
  visible: {
    height: '100%',
  },
}

interface VerificationButtonProps {
  answerHandler: () => void
  isAnswerCorrect: boolean
  isAnswerVerified: boolean
  isAnswered: boolean
}

export function VerificationButton({
  answerHandler,
  isAnswerCorrect,
  isAnswerVerified,
  isAnswered,
}: VerificationButtonProps) {
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

  return (
    <div
      className={twMerge(
        'fixed bottom-0 border-t w-full px-6 py-6 flex flex-col items-center justify-center gap-6',
        isAnswerVerified && !isAnswerCorrect
          ? 'border-red-700 bg-green-900'
          : 'border-green-500 bg-green-900'
      )}
    >
      {isAnswerVerified && (
        <motion.div
          variants={feedbackAnimations}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-1"
        >
          <Image
            src={`/icons/${
              isAnswerVerified && !isAnswerCorrect
                ? 'incorrect-answer.svg'
                : 'correct-answer.svg'
            }`}
            width={48}
            height={48}
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
            {isAnswerCorrect ? 'Oops, tente denovo!' : 'Correto, parabéns!'}
          </strong>
        </motion.div>
      )}
      <Button
        onClick={handleButtonClick}
        className={buttonStyles({
          color: isAnswerVerified && !isAnswerCorrect ? 'red' : 'green',
        })}
        disabled={false}
      >
        {getButtonTitle()}
      </Button>
    </div>
  )
}
