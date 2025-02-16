import { useFormContext } from 'react-hook-form'
import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeDescriptionField() {
  const { control, formState } = useFormContext<ChallengeSchema>()

  return {
    formControl: control,
    errorMessage: formState.errors.description?.message,
  }
}
