import { tv } from 'tailwind-variants'

import { Tooltip } from '../../../modules/global/components/shared/Tooltip'

import { ChallengeDifficulty } from '@/@types/Challenge'

const DIFFICULTIES = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
}

const difficultyStyles = tv({
  base: 'font-medium text-sm border p-2 rounded-lg',
  variants: {
    difficulty: {
      easy: 'border-green-400 text-green-400',
      medium: 'border-yellow-400 text-yellow-400',
      hard: 'border-red-700 text-red-700',
    },
  },
})

type DifficultyBadgeProps = {
  difficulty: ChallengeDifficulty
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <Tooltip direction='bottom' content='Nível de dificuldade desse desafio'>
      <span className={difficultyStyles({ difficulty })}>{DIFFICULTIES[difficulty]}</span>
    </Tooltip>
  )
}
