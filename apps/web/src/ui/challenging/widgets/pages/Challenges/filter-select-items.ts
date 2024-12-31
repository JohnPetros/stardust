'use client'

import type { ClassNameValue } from 'tailwind-merge'

import type { IconName } from '@/ui/global/widgets/components/Icon/types'
import type {
  ChallengeCompletionStatus,
  ChallengeDifficultyLevel,
} from '@stardust/core/challenging/types'

type SelectsItem = {
  value: ChallengeCompletionStatus | ChallengeDifficultyLevel | 'all'
  text: string
  textStyles?: ClassNameValue
  icon?: IconName
  iconStyles?: string
}

export const FILTER_SELECTS_ITEMS: SelectsItem[] = [
  {
    value: 'all',
    text: 'Todos',
    icon: 'minus',
    iconStyles: 'text-gray-500 text-sm',
  },
  {
    value: 'completed',
    text: 'Resolvido',
    icon: 'check',
    iconStyles: 'text-green-500 text-sm',
  },
  {
    value: 'not-completed',
    text: 'Não Resolvido',
    icon: 'unchecked',
    iconStyles: 'text-red-700 text-sm',
  },
  {
    value: 'all',
    text: 'Todos',
    textStyles: 'text-gray-500',
  },
  {
    value: 'easy',
    text: 'Fácil',
    textStyles: 'text-green-400',
  },
  {
    value: 'medium',
    text: 'Médio',
    textStyles: 'text-yellow-400',
  },
  {
    value: 'hard',
    text: 'Difícil',
    textStyles: 'text-red-700',
  },
]
