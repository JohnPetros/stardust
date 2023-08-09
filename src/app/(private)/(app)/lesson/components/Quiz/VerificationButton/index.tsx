import { Button } from '@/app/components/Button'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

const buttonStyles = tv({
  variants: {
    color: {
      green: 'border-gray-100 text-gray-900',
      red: 'border-red-300 text-red-300',
    },
  },
})

interface VerificationButtonProps {
  answerHandler: () => void
  isAnswerWrong: boolean
  isAnswerVerified: boolean
  isAnswered: boolean
}

export function VerificationButton({
  answerHandler,
  isAnswerWrong,
  isAnswerVerified,
  isAnswered,
}: VerificationButtonProps) {
  function getButtonTitle() {
    if (isAnswerVerified && isAnswerWrong) {
      return 'Tentar novamente'
    } else if (isAnswerVerified) {
      return 'Continuar'
    } else {
      return 'Verificar'
    }
  }

  return (
    <div
      className={twMerge(
        'border w-full px-6 py-8',
        isAnswerVerified && isAnswerWrong
          ? 'border-red-700'
          : 'border-green-500'
      )}
    >
      <div>
        <Image
          src={`/images/${
            isAnswerWrong ? 'wrong-answer.svg' : 'correct-answer.svg'
          }`}
          width={40}
          height={40}
          alt=""
        />
        <strong>
          {isAnswerWrong ? 'Oops, tente denovo!' : 'Correto, parabéns!'}
        </strong>
      </div>
      <Button
        onClick={answerHandler}
        className={buttonStyles({
          color: isAnswerVerified && isAnswerWrong ? 'red' : 'green',
        })}
        disabled={!isAnswered}
      >
        {getButtonTitle()}
      </Button>
    </div>
  )
}
