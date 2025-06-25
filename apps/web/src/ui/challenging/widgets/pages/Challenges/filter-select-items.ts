import type { ClassNameValue } from 'tailwind-merge'

import type { IconName } from '@/ui/global/widgets/components/Icon/types'
import type {
  ChallengeCompletionStatusValue,
  ChallengeDifficultyLevel,
} from '@stardust/core/challenging/types'

type SelectsItem = {
  value: ChallengeCompletionStatusValue | ChallengeDifficultyLevel | 'all'
  label: string
  labelStyles?: ClassNameValue
  icon?: IconName
  iconStyles?: string
}

export const FILTER_SELECTS_ITEMS: Record<
  'completionStatus' | 'difficultyLevel',
  SelectsItem[]
> = {
  completionStatus: [
    {
      value: 'all',
      label: 'Todos',
      icon: 'minus',
      iconStyles: 'text-gray-500 text-sm',
    },
    {
      value: 'completed',
      label: 'Resolvido',
      icon: 'check',
      iconStyles: 'text-green-500 text-sm',
    },
    {
      value: 'not-completed',
      label: 'Não Resolvido',
      icon: 'unchecked',
      iconStyles: 'text-red-700 text-sm',
    },
  ],
  difficultyLevel: [
    {
      value: 'all',
      label: 'Todos',
      labelStyles: 'text-gray-500',
    },
    {
      value: 'easy',
      label: 'Fácil',
      labelStyles: 'text-green-400',
    },
    {
      value: 'medium',
      label: 'Médio',
      labelStyles: 'text-yellow-400',
    },
    {
      value: 'hard',
      label: 'Difícil',
      labelStyles: 'text-red-700',
    },
  ],
} as const
