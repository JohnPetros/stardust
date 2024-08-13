'use client'

import Link from 'next/link'

import { AnimatedCard } from './AnimatedCard'
import { ROUTES } from '@/ui/global/constants'
import { DifficultyBadge } from '@/ui/global/components/shared/DifficultyBadge'
import type { ChallengeDifficultyLevel } from '@/@core/domain/types'
import type { ChallengeCategory } from '@/@core/domain/entities/ChallengeCategory'
import { ChallengeInfo } from '@/ui/global/components/shared/ChallengeInfo'

type ChallengeProps = {
  slug: string
  title: string
  authorSlug: string
  difficulty: ChallengeDifficultyLevel
  upvotesCount: number
  downvotesCount: number
  totalCompletitions: number
  categories: ChallengeCategory[]
  isCompleted: boolean
}

export function ChallengeCard({
  slug,
  title,
  authorSlug,
  difficulty,
  upvotesCount,
  downvotesCount,
  totalCompletitions,
  categories,
  isCompleted,
}: ChallengeProps) {
  return (
    <AnimatedCard>
      <div className='flex items-center gap-3'>
        <DifficultyBadge difficulty={difficulty} />
        <Link
          href={`${ROUTES.private.app.challenge}/${slug}`}
          className='font-semibold text-green-500 transition-colors duration-200 hover:text-green-700'
        >
          {title}
        </Link>
      </div>
      <ChallengeInfo
        isCompleted={isCompleted ?? false}
        totalCompletitions={totalCompletitions}
        authorSlug={authorSlug}
        upvotes={upvotesCount}
        downvotes={downvotesCount}
      />
      {categories.length && (
        <ul className='flex items-start gap-3'>
          {categories.map((category) => {
            return (
              <li
                key={category.id}
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
