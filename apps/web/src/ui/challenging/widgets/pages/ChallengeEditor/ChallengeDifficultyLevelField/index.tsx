import { Controller } from 'react-hook-form'

import type { ChallengeDifficultyLevel } from '@stardust/core/challenging/types'

import * as Select from '@/ui/global/widgets/components/Select'
import { ChallengeField } from '../ChallengeField'
import { CHALLENGE_DIFFICULTY_LEVELS } from '../challenge-difficulty-levels'
import { useChallengeDifficultyLevelField } from './useChallengeDifficultyLevelField'

const CHALLENGE_DIFFICULTY_LEVEL_LABELS: Record<ChallengeDifficultyLevel, string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
  any: 'Qualquer',
}

export function ChallengeDifficultyLevelField() {
  const { formControl, errorMessage } = useChallengeDifficultyLevelField()

  return (
    <ChallengeField
      title='Nível de dificuldade do seu desafio'
      icon='level'
      hasError={Boolean(errorMessage)}
    >
      <Controller
        control={formControl}
        name='difficultyLevel'
        render={({ field: { value, onChange } }) => (
          <Select.Container<ChallengeDifficultyLevel>
            defaultValue={value}
            value={value}
            errorMessage={errorMessage}
            onValueChange={onChange}
          >
            <Select.Trigger value={CHALLENGE_DIFFICULTY_LEVEL_LABELS[value]} />
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
