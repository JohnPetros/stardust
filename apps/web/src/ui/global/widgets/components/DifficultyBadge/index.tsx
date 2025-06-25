import { tv } from 'tailwind-variants'

import { Tooltip } from '../Tooltip'

type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'any'

const DIFFICULTIES = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
  any: 'Qualquer',
}

const difficultyStyles = tv({
  base: 'font-medium text-sm border p-2 rounded-lg',
  variants: {
    difficultyLevel: {
      easy: 'border-green-400 text-green-400',
      medium: 'border-yellow-400 text-yellow-400',
      hard: 'border-red-700 text-red-700',
      any: 'border-gray-400 text-gray-400',
    },
  },
})

type DifficultyBadgeProps = {
  difficultyLevel: DifficultyLevel
}

export function DifficultyBadge({ difficultyLevel }: DifficultyBadgeProps) {
  return (
    <Tooltip direction='bottom' content='Nível de dificuldade desse desafio'>
      <span className={difficultyStyles({ difficultyLevel })}>
        {DIFFICULTIES[difficultyLevel]}
      </span>
    </Tooltip>
  )
}
