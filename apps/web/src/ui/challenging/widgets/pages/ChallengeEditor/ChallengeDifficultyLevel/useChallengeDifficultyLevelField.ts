import { useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeDifficultyLevelField() {
  const { control } = useFormContext<ChallengeSchema>()

  return {
    formControl: control,
  }
}
