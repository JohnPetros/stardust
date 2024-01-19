import { useCallback, useEffect, useMemo, useRef } from 'react'

import { VerificationButtonProps } from '.'

import { useAudio } from '@/hooks/useAudio'

export function useVerificationButton({
  answerHandler,
  isAnswerCorrect,
  isAnswerVerified,
  isAnswered,
}: VerificationButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const buttonHasFocus = useRef(false)

  const successAudio = useAudio('success.wav')
  const failAudio = useAudio('fail.wav')

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
      isAnswerCorrect ? successAudio?.play() : failAudio?.play()
    }
  }, [
    isAnswerVerified,
    isAnswerCorrect,
    successAudio,
    failAudio,
    handleGlobalKeyDown,
  ])

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
