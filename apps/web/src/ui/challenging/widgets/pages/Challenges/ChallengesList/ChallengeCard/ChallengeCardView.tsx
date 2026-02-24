import Link from 'next/link'

import type { ChallengeDifficultyLevel } from '@stardust/core/challenging/types'
import type { ChallengeCategory } from '@stardust/core/challenging/entities'

import { ROUTES } from '@/constants'
import { DifficultyBadge } from '@/ui/global/widgets/components/DifficultyBadge'
import { ChallengeInfo } from '@/ui/challenging/widgets/components/ChallengeInfo'
import { AnimatedCard } from './AnimatedCard'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  slug: string
  title: string
  difficultyLevel: ChallengeDifficultyLevel
  upvotesCount: number
  downvotesCount: number
  completionCount: number
  authorSlug: string
  authorName: string
  categories: ChallengeCategory[]
  isCompleted: boolean
}

export const ChallengeCardView = ({
  slug,
  title,
  authorSlug,
  authorName,
  difficultyLevel,
  upvotesCount,
  downvotesCount,
  completionCount,
  categories,
  isCompleted,
}: Props) => {
  return (
    <AnimatedCard>
      <div className='flex items-center gap-3'>
        <DifficultyBadge difficultyLevel={difficultyLevel} />
        <Link
          href={`${ROUTES.challenging.challenges.challenge(slug)}`}
          prefetch={false}
          className='font-medium text-green-500 transition-colors duration-200 hover:text-green-700'
        >
          {title}
        </Link>
        <Link
          href={`${ROUTES.challenging.challenge(slug)}`}
          prefetch={false}
          className='flex items-center gap-1 w-64 text-sm text-gray-500 transition-colors duration-200 group hover:text-gray-700'
        >
          <Icon
            name='pencil'
            size={14}
            className='text-gray-500 group-hover:text-gray-700'
          />
          Editar desafio
        </Link>
      </div>
      <ChallengeInfo
        isCompleted={isCompleted ?? false}
        completionCount={completionCount}
        authorName={authorName}
        authorSlug={authorSlug}
        upvotes={upvotesCount}
        downvotes={downvotesCount}
      />
      {categories.length > 0 && (
        <ul className='flex items-start gap-3'>
          {categories.map((category) => {
            return (
              <li
                key={category.id.value}
                className='rounded-md bg-gray-400 p-1 text-xs font-semibold text-gray-900'
              >
                {category.name.value}
              </li>
            )
          })}
        </ul>
      )}
    </AnimatedCard>
  )
}
