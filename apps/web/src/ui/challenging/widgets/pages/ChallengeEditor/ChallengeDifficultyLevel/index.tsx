import { Controller } from 'react-hook-form'

import type { ChallengeDifficultyLevel } from '@stardust/core/challenging/types'

import * as Select from '@/ui/global/widgets/components/Select'
import { ChallengeField } from '../ChallengeField'
import { CHALLENGE_DIFFICULTY_LEVELS } from '../challenge-difficulty-levels'
import { useChallengeDifficultyLevelField } from './useChallengeDifficultyLevelField'

export function ChallengeDifficultyLevelField() {
  const { formControl, errorMessage } = useChallengeDifficultyLevelField()

  return (
    <ChallengeField
      title='Nível de dificuldade'
      icon='level'
      hasError={Boolean(errorMessage)}
    >
      <Controller
        control={formControl}
        name='difficultyLevel'
        render={({ field: { value, onChange } }) => (
          <Select.Container<ChallengeDifficultyLevel>
            defaultValue={value}
            errorMessage={errorMessage}
            onValueChange={onChange}
          >
            <Select.Trigger value='Nível de dificuldade' />
            <Select.Content>
              {CHALLENGE_DIFFICULTY_LEVELS.map((difficultyLevel) => (
                <Select.Item key={difficultyLevel.value} value={difficultyLevel.value}>
                  <Select.Text>{difficultyLevel.label}</Select.Text>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Container>
        )}
      />
    </ChallengeField>
  )
}
