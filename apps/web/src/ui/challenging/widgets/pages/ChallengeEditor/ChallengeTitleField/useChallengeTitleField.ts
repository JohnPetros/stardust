import { useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeTitleField() {
  const { register, formState } = useFormContext<ChallengeSchema>()

  return {
    registerInput: register,
    errorMessage: formState.errors.title?.message,
  }
}
