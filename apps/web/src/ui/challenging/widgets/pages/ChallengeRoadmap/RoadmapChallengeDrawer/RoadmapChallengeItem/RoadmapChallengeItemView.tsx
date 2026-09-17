import Link from 'next/link'
import type { RoadmapChallengeDto } from '../../types'

type Props = {
  challenge: RoadmapChallengeDto
  nodeKey: string
  isRecommended: boolean
  onOpen: () => void
}

export function RoadmapChallengeItemView({
  challenge,
  nodeKey,
  isRecommended,
  onOpen,
}: Props) {
  const href = `/challenging/challenges/${encodeURIComponent(challenge.slug ?? '')}/challenge?from=roadmap&node=${encodeURIComponent(nodeKey)}`
  return (
    <li className='flex min-h-[66px] items-center gap-3 border-b border-gray-800 py-3'>
      <span
        aria-hidden='true'
        className={`h-3 w-3 shrink-0 rounded-full border-2 ${challenge.isCompleted ? 'border-green-400 bg-green-400' : isRecommended ? 'border-green-400' : 'border-gray-500'}`}
      />
      <div className='min-w-0 flex-1'>
        <Link
          href={href}
          onClick={onOpen}
          className='block truncate text-sm font-medium text-gray-100 hover:text-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400'
        >
          {challenge.title}
        </Link>
        <p className='mt-1 text-xs text-gray-400'>
          {challenge.difficultyLevel === 'easy'
            ? 'Fácil'
            : challenge.difficultyLevel === 'medium'
              ? 'Médio'
              : 'Difícil'}
          {challenge.isCompleted ? ' · Concluído' : isRecommended ? ' · Recomendado' : ''}
        </p>
      </div>
      <Link
        href={href}
        onClick={onOpen}
        aria-label={`Abrir ${challenge.title}`}
        className='flex min-h-11 min-w-11 items-center justify-center text-gray-400 hover:text-green-400'
      >
        →
      </Link>
    </li>
  )
}
