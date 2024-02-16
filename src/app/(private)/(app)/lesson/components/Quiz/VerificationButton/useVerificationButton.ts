import { useCallback, useEffect, useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'

import { VerificationButtonProps } from '.'

import { playAudio } from '@/global/helpers'
import { useEventListener } from '@/global/hooks/useEventListener'

export function useVerificationButton({
  answerHandler,
  isAnswerCorrect,
  isAnswerVerified,
  isAnswered,
}: VerificationButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const buttonHasFocus = useRef(false)

  const pathname = usePathname()

  const buttonTitle = useMemo(() => {
    if (isAnswerVerified && !isAnswerCorrect) {
      return 'Tentar novamente'
    } else if (isAnswerVerified) {
      return 'Continuar'
    } else {
      return 'Verificar'
    }
  }, [isAnswerVerified, isAnswerCorrect])

  function handleButtonClick() {
    answerHandler()
  }

  const handleGlobalKeyDown = useCallback(
    ({ key }: KeyboardEvent) => {
      if (key === 'Enter' && isAnswered && pathname.includes('/lesson')) {
        answerHandler()
      }
    },
    [answerHandler, isAnswered, pathname]
  )

  useEffect(() => {
    if (isAnswerVerified) {
      playAudio(isAnswerCorrect ? 'success.wav' : 'fail.wav')
    }
  }, [isAnswerVerified, isAnswerCorrect, handleGlobalKeyDown])

  useEventListener('keydown', handleGlobalKeyDown)

  return {
    buttonRef,
    buttonHasFocus,
    buttonTitle,
    handleButtonClick,
  }
}
