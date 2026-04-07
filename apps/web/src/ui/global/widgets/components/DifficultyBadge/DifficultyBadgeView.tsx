import { tv } from 'tailwind-variants'

import { Tooltip } from '../Tooltip'

type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'all'

const DIFFICULTIES = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
  all: 'Todos',
}

const styles = tv({
  base: 'font-medium text-sm border p-2 rounded-lg',
  variants: {
    difficultyLevel: {
      easy: 'border-green-400 text-green-400',
      medium: 'border-yellow-400 text-yellow-400',
      hard: 'border-red-700 text-red-700',
      all: 'border-gray-400 text-gray-400',
    },
  },
})

type Props = {
  difficultyLevel: DifficultyLevel
}

export const DifficultyBadgeView = ({ difficultyLevel }: Props) => {
  return (
    <Tooltip direction='bottom' content='Nível de dificuldade desse desafio'>
      <span className={styles({ difficultyLevel })}>{DIFFICULTIES[difficultyLevel]}</span>
    </Tooltip>
  )
}
