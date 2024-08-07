import { useCallback, useEffect, useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'

import { useEventListener } from '@/ui/global/hooks/useEventListener'
import { playAudio } from '@/ui/global/utils'
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
  }, [isAnswerVerified, isAnswerCorrect])

  useEventListener('keydown', handleGlobalKeyDown)

  return {
    buttonRef,
    buttonHasFocus,
    buttonTitle,
    handleButtonClick,
  }
}