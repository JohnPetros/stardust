'use client'
import { CheckCircle, Circle, Icon, Minus } from '@phosphor-icons/react'

import { Difficulty, Status } from '@/contexts/ChallengesListContext'

type SelectsItem = {
  value: Status | Difficulty
  text: string
  textStyles?: string
  icon?: Icon
  iconStyles?: string
}

export const FILTER_SELECTS_ITEMS: SelectsItem[] = [
  {
    value: 'all',
    text: 'Todos',
    icon: Minus,
    iconStyles: 'text-gray-500 text-lg',
  },
  {
    value: 'completed',
    text: 'Resolvido',
    icon: CheckCircle,
    iconStyles: 'text-green-500 text-lg',
  },
  {
    value: 'not-completed',
    text: 'Não Resolvido',
    icon: Circle,
    iconStyles: 'text-red-700 text-lg',
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
