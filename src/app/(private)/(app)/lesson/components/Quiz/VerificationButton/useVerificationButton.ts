import { useCallback, useEffect, useMemo, useRef } from 'react'

import { VerificationButtonProps } from '.'

import { playAudio } from '@/utils/helpers'

export function useVerificationButton({
  answerHandler,
  isAnswerCorrect,
  isAnswerVerified,
  isAnswered,
}: VerificationButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const buttonHasFocus = useRef(false)

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
      if (key === 'Enter' && isAnswered && !buttonHasFocus.current) {
        answerHandler()
      }
    },
    [answerHandler, isAnswered]
  )

  useEffect(() => {
    if (isAnswerVerified) {
      playAudio(isAnswerCorrect ? 'success.wav' : 'fail.wav')
    }
  }, [isAnswerVerified, isAnswerCorrect, handleGlobalKeyDown])

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [handleGlobalKeyDown])

  return {
    buttonRef,
    buttonHasFocus,
    buttonTitle,
    handleButtonClick,
  }
}