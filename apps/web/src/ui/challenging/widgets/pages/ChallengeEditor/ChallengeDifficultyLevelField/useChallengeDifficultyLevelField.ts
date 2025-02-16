import { useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeDifficultyLevelField() {
  const { control, formState } = useFormContext<ChallengeSchema>()

  return {
    formControl: control,
    errorMessage: formState.errors.difficultyLevel?.message,
  }
}
