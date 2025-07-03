import type { RefObject } from 'react'
import { type ClassNameValue, twMerge } from 'tailwind-merge'

import { AnimatedPanel } from './AnimatedPanel'
import { StyledButton } from './StyledButton'
import { Icon } from '../Icon'

export type Props = {
  buttonRef: RefObject<HTMLButtonElement>
  isAnswered: boolean
  isAnswerVerified: boolean
  isAnswerCorrect: boolean
  isLoading?: boolean
  className?: ClassNameValue
  title: string
  onClick: () => void
  onFocus: () => void
  onBlur: () => void
}

export const VerificationButtonView = ({
  buttonRef,
  isAnswerCorrect,
  isAnswerVerified,
  isLoading,
  isAnswered,
  className,
  title,
  onClick,
  onFocus,
  onBlur,
}: Props) => {
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
            {isAnswerVerified && !isAnswerCorrect ? (
              <div className='grid place-content-center p-2 bg-transparent border-4 border-red-700 rounded-full'>
                <Icon name='close' size={24} className='text-red-700' />
              </div>
            ) : (
              <div className='grid place-content-center p-2 bg-transparent border-4 border-green-400 rounded-full'>
                <Icon name='check' size={24} className='text-green-400' />
              </div>
            )}
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
        disabled={!isAnswered}
        isLoading={isLoading}
        color={isAnswerVerified && !isAnswerCorrect ? 'red' : 'green'}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {title}
      </StyledButton>
    </div>
  )
}
