import { useCallback, useEffect, useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'

import { useEventListener } from '@/ui/global/hooks/useEventListener'
import { useAudioContext } from '@/ui/global/contexts/AudioContext'
import type { VerificationButtonProps } from './VerificationButtonProps'

export function useVerificationButton({
  onClick,
  isAnswerCorrect,
  isAnswerVerified,
  isAnswered,
}: VerificationButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const buttonHasFocus = useRef(false)
  const pathname = usePathname()
  const { playAudio } = useAudioContext()

  const buttonTitle = useMemo(() => {
    if (isAnswerVerified && !isAnswerCorrect) {
      return 'Tentar novamente'
    }

    if (isAnswerVerified) {
      return 'Continuar'
    }

    return 'Verificar'
  }, [isAnswerVerified, isAnswerCorrect])

  function handleButtonClick() {
    onClick()
  }

  const handleGlobalKeyDown = useCallback(
    ({ key }: KeyboardEvent) => {
      if (key === 'Enter' && isAnswered && pathname.includes('/lesson')) {
        onClick()
      }
    },
    [onClick, isAnswered, pathname],
  )

  useEffect(() => {
    if (isAnswerVerified) {
      playAudio(isAnswerCorrect ? 'success.wav' : 'fail.wav')
    }
  }, [isAnswerVerified, isAnswerCorrect, playAudio])

  useEventListener('keydown', handleGlobalKeyDown)

  return {
    buttonRef,
    buttonHasFocus,
    buttonTitle,
    handleButtonClick,
  }
}
