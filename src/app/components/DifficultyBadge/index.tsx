import { tv } from 'tailwind-variants'

import { Tooltip } from '../Tooltip'

import { Difficulty } from '@/@types/challenge'

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
  difficulty: Difficulty
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <Tooltip direction="bottom" content="Nível de dificuldade desse desafio">
      <span className={difficultyStyles({ difficulty })}>
        {DIFFICULTIES[difficulty]}
      </span>
    </Tooltip>
  )
}
