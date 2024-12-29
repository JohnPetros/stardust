'use client'

import { twMerge } from 'tailwind-merge'

import { Icon } from '../../../Icon'
import { useUpvoteCommentAction } from './useUpvoteCommentAction'

export type UpvoteButtonProps = {
  commentId: string
  isCommentUpvoted: boolean
  initialUpvotesCount: number
}

export function UpvoteButton({
  initialUpvotesCount,
  commentId,
  isCommentUpvoted,
}: UpvoteButtonProps) {
  const { isUpvoted, upvotesCount, upvote } = useUpvoteCommentAction(
    initialUpvotesCount,
    isCommentUpvoted,
  )

  return (
    <button
      type='button'
      onClick={async () => await upvote(commentId)}
      className={twMerge(
        'flex items-center gap-1 text-sm text-gray-300',
        isUpvoted ? 'text-green-700' : 'text-gray-300',
      )}
    >
      <Icon
        name='simple-arrow-up'
        className={isUpvoted ? 'text-green-700' : 'text-gray-300'}
      />
      +{upvotesCount}
    </button>
  )
}
