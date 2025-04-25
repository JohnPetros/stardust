import Link from 'next/link'

import type { ChallengeDifficultyLevel } from '@stardust/core/challenging/types'
import type { ChallengeCategory } from '@stardust/core/challenging/entities'

import { ROUTES } from '@/constants'
import { DifficultyBadge } from '@/ui/global/widgets/components/DifficultyBadge'
import { ChallengeInfo } from '@/ui/challenging/widgets/components/ChallengeInfo'
import { AnimatedCard } from './AnimatedCard'

type ChallengeProps = {
  slug: string
  title: string
  difficultyLevel: ChallengeDifficultyLevel
  upvotesCount: number
  downvotesCount: number
  completionsCount: number
  authorSlug: string
  authorName: string
  categories: ChallengeCategory[]
  isCompleted: boolean
}

export function ChallengeCard({
  slug,
  title,
  authorSlug,
  authorName,
  difficultyLevel,
  upvotesCount,
  downvotesCount,
  completionsCount,
  categories,
  isCompleted,
}: ChallengeProps) {
  return (
    <AnimatedCard>
      <div className='flex items-center gap-3'>
        <DifficultyBadge difficultyLevel={difficultyLevel} />
        <Link
          href={`${ROUTES.challenging.challenges.challenge(slug)}`}
          className='font-medium text-green-500 transition-colors duration-200 hover:text-green-700'
        >
          {title}
        </Link>
      </div>
      <ChallengeInfo
        isCompleted={isCompleted ?? false}
        completionsCount={completionsCount}
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
