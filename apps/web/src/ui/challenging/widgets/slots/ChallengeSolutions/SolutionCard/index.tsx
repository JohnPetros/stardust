import Link from 'next/link'

import type { ChallengeDifficultyLevel } from '@stardust/core/challenging/types'
import type { ChallengeCategory } from '@stardust/core/challenging/entities'

import { ROUTES } from '@/constants'
import { DifficultyBadge } from '@/ui/global/widgets/components/DifficultyBadge'
import { SolutionInfo } from '../../../components/SolutionInfo'
import { UserAvatar } from '@/ui/global/widgets/components/UserAvatar'

type ChallengeProps = {
  slug: string
  challengeSlug: string
  title: string
  upvotesCount: number
  viewsCount: number
  commentsCount: number
  author: {
    slug: string
    name: string
    avatar: {
      name: string
      image: string
    }
  }
}

export function SolutionCard({
  slug,
  challengeSlug,
  title,
  upvotesCount,
  commentsCount,
  viewsCount,
  author,
}: ChallengeProps) {
  return (
    <article>
      <Link
        href={`${ROUTES.challenging.challenges.challengeSolutions.solution(challengeSlug, slug)}`}
        className='flex items-center gap-3'
      >
        <UserAvatar
          size={32}
          avatarImage={author.avatar.image}
          avatarName={author.avatar.name}
        />
        <div>
          <h2 className='font-semibold text-green-500 transition-colors duration-200 hover:text-green-700'>
            {title}
          </h2>
          <div className='mt-3'>
            <SolutionInfo
              upvotesCount={upvotesCount}
              viewsCount={viewsCount}
              commentsCount={commentsCount}
            />
          </div>
        </div>
      </Link>
    </article>
  )
}
