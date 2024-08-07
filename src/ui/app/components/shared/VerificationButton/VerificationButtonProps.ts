import type { ClassNameValue } from 'tailwind-merge'

export type VerificationButtonProps = {
  onClick: () => void
  isAnswered: boolean
  isAnswerVerified: boolean
  isAnswerCorrect: boolean
  className?: ClassNameValue
}