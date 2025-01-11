import { useFormContext } from 'react-hook-form'
import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeDescriptionField() {
  const { control, register } = useFormContext<ChallengeSchema>()

  return {
    formControl: control,
    registerInput: register,
  }
}
