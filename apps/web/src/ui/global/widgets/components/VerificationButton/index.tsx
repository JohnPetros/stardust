import type { ClassNameValue } from 'tailwind-merge'

import { useVerificationButton } from './useVerificationButton'
import { VerificationButtonView } from './VerificationButtonView'

type Props = {
  isAnswered: boolean
  isAnswerVerified: boolean
  isAnswerCorrect: boolean
  isLoading?: boolean
  className?: ClassNameValue
  onClick: () => void
}

export const VerificationButton = ({
  isAnswerCorrect,
  isAnswerVerified,
  isLoading,
  isAnswered,
  className,
  onClick,
}: Props) => {
  const { buttonRef, buttonTitle, buttonHasFocus, handleButtonClick } =
    useVerificationButton({
      onClick,
      isAnswerCorrect,
      isAnswerVerified,
      isAnswered,
    })

  return (
    <VerificationButtonView
      buttonRef={buttonRef}
      title={buttonTitle}
      isAnswerCorrect={isAnswerCorrect}
      isAnswerVerified={isAnswerVerified}
      isLoading={isLoading}
      isAnswered={isAnswered}
      className={className}
      onFocus={() => (buttonHasFocus.current = true)}
      onBlur={() => (buttonHasFocus.current = false)}
      onClick={handleButtonClick}
    />
  )
}
