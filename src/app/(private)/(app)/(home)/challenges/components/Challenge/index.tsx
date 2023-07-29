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
const iconStyle = 'text-green-400'

const difficulties = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
}

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
    <div className="rounded-md bg-gray-800 p-3 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span>{difficulties[difficulty]}</span>
        <Link
          href={`/challenges/${id}`}
          className="text-green-500 font-semibold"
        >
          {title}
        </Link>
      </div>
      <ul className="flex items-center gap-3">
        <Info
          icon={isCompleted ? CheckCircle : Circle}
          label={isCompleted ? 'Resolvido' : 'Não resolvido'}
        />
        <Info icon={ChartLine} label={acceptanceRate + '%'} />
        <Info icon={Target} label={totalCompletitions} />
        <Info icon={User} label={author} />
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
