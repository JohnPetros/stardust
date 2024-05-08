import Link from 'next/link'

import { UserAvatar } from '@/global/components/UserAvatar'
import { ROUTES } from '@/global/constants'
import { useDate } from '@/services/date'
import { ArrowFatUp, ChatCircle } from '@phosphor-icons/react'

export type SolutionCardProps = {
  title: string
  slug: string
  content: string
  upvotesCount: number
  commentsCount: number
  createdAt: Date
  user: {
    slug: string
    avatarId: string
  }
}

export function SolutionCard({
  title,
  slug,
  content,
  upvotesCount,
  commentsCount,
  createdAt,
  user,
}: SolutionCardProps) {
  const { format } = useDate()

  const date = format(createdAt, 'DD/MM/YYYY')

  return (
    <Link href={`${ROUTES.private.solution}/${slug}`} className='flex flex-col gap-3'>
      <div className='flex justify-between w-full gap-2'>
        <UserAvatar avatarId={user.avatarId} size={32} />
        <time className='text-sm text-green-700'>{date}</time>
      </div>
      <strong className='text-gray-100 font-semibold'>{content}</strong>
      <div className='flex items-center gap-4'>
        <div className='text-green-500'>
          <ArrowFatUp className='text-green-500' weight='bold' />
          {upvotesCount}
        </div>
        <div className='text-green-500'>
          <ChatCircle className='text-green-500' weight='bold' />
          {commentsCount}
        </div>
      </div>
    </Link>
  )
}
