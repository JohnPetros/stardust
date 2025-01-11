import { useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeCodeField() {
  const { control, register } = useFormContext<ChallengeSchema>()

  return {
    formControl: control,
    registerInput: register,
  }
}
