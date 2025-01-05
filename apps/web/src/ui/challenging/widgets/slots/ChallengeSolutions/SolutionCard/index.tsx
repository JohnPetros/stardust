import Link from 'next/link'

import { ROUTES } from '@/constants'
import { UserAvatar } from '@/ui/global/widgets/components/UserAvatar'
import { SolutionInfo } from '../../../components/SolutionInfo'

type ChallengeProps = {
  slug: string
  challengeSlug: string
  title: string
  upvotesCount: number
  viewsCount: number
  commentsCount: number
  createdAt: Date
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
  createdAt,
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
              createdAt={createdAt}
            />
          </div>
        </div>
      </Link>
    </article>
  )
}
