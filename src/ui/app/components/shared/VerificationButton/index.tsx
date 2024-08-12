import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { AnimatedPanel } from './AnimatedPanel'
import { StyledButton } from './StyledButton'
import { useVerificationButton } from './useVerificationButton'
import type { VerificationButtonProps } from './VerificationButtonProps'

export function VerificationButton({
  onClick,
  isAnswerCorrect,
  isAnswerVerified,
  isAnswered,
  className,
}: VerificationButtonProps) {
  const { buttonRef, buttonTitle, buttonHasFocus, handleButtonClick } =
    useVerificationButton({
      onClick,
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
        className,
      )}
    >
      <div>
        <AnimatedPanel isAnswerVerified={isAnswerVerified}>
          <div className='flex h-20 flex-col items-center gap-1 overflow-hidden'>
            <Image
              src={`/icons/${
                isAnswerVerified && !isAnswerCorrect
                  ? 'incorrect-answer.svg'
                  : 'correct-answer.svg'
              }`}
              width={48}
              height={48}
              priority
              alt=''
            />
            <strong
              className={twMerge(
                'text-lg',
                isAnswerVerified && !isAnswerCorrect ? 'text-red-700' : 'text-green-400',
              )}
            >
              {isAnswerCorrect ? 'Correto, parabéns!' : 'Oops, tente denovo!'}
            </strong>
          </div>
        </AnimatedPanel>
      </div>

      <StyledButton
        ref={buttonRef}
        onClick={handleButtonClick}
        onFocus={() => (buttonHasFocus.current = true)}
        onBlur={() => (buttonHasFocus.current = false)}
        disabled={!isAnswered}
        color={isAnswerVerified && !isAnswerCorrect ? 'red' : 'green'}
      >
        {buttonTitle}
      </StyledButton>
    </div>
  )
}
