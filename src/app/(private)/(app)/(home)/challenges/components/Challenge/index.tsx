import Link from 'next/link'
import { Challenge } from '@/types/challenge'
import { Category } from './Category'
import { Info } from './Info'

import {
  CaretUp,
  ChartLine,
  CheckCircle,
  Circle,
  Target,
  User,
} from '@phosphor-icons/react'
import { tv } from 'tailwind-variants'

const difficulties = {
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

interface ChallengeProps {
  data: Challenge
  isCompleted: boolean
}

export function Challenge({
  data: {
    id,
    title,
    difficulty,
    author,
    upvotes,
    downvotes,
    totalCompletitions,
    categories,
  },
  isCompleted,
}: ChallengeProps) {
  const totalVotes = upvotes + downvotes
  const acceptanceRate = totalVotes ? upvotes / totalVotes : 0

  return (
    <div className="rounded-md bg-gray-800 p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className={difficultyStyles({ difficulty })}>
          {difficulties[difficulty]}
        </span>
        <Link
          href={`/challenges/${id}`}
          className="text-green-500 font-semibold hover:text-green-700 transition-colors duration-200"
        >
          {title}
        </Link>
      </div>
      <ul className="flex items-center gap-3">
        <Info
          icon={isCompleted ? CheckCircle : Circle}
          label={isCompleted ? 'Resolvido' : 'Não resolvido'}
          tooltipText={
            isCompleted
              ? 'O que você está esperando? resolva esse desafio.'
              : 'Você ainda pode resolver esse desafio quantas vezes quiser.'
          }
        />
        <Info
          icon={ChartLine}
          label={acceptanceRate + '%'}
          tooltipText={`Taxa de aceitação de usuários que que deram upvote para esse desafio de um total de ${totalVotes} votos. Desafios deve ser concluídos primeiro antes de serem votados.`}
        />
        <Info
          icon={Target}
          label={totalCompletitions}
          tooltipText={'Número de vezes que esse desafio foi concluído.'}
        />
        <Info
          icon={User}
          label={author}
          tooltipText={'Criador desse desafio.'}
        />
      </ul>
      {categories && (
        <ul className="flex items-start gap-3">
          {categories.map(({ name }) => (
            <Category key={name} name={name} />
          ))}
        </ul>
      )}
    </div>
  )
}
