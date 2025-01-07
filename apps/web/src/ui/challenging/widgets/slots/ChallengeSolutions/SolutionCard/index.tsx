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
    <article className='w-full'>
      <Link
        href={`${ROUTES.challenging.challenges.challengeSolutions.solution(challengeSlug, slug)}`}
        className='flex gap-3'
      >
        <UserAvatar
          size={36}
          avatarImage={author.avatar.image}
          avatarName={author.avatar.name}
        />
        <div className='w-full'>
          <p className='text-gray-500 text-sm'>{author.name}</p>
          <h2 className='font-semibold text-green-500 text-lg transition-colors duration-200 hover:text-green-700'>
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
