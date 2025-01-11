import { useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeTitleField() {
  const { register } = useFormContext<ChallengeSchema>()

  return {
    registerInput: register,
  }
}
