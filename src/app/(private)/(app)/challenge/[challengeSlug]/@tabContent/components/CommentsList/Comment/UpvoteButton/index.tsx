'use client'

import { CaretUp } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { UpvoteButtonProps } from './types/UpvotesButtonProps'
import { useUpvoteButton } from './useUpvoteButton'

export function UpvoteButton({
  initialUpvotesCount,
  commentId,
  isCommentUpvoted,
}: UpvoteButtonProps) {
  const { handleToggleUpvoteComment, isUpvoted, upvotes } = useUpvoteButton({
    initialUpvotesCount,
    commentId,
    isCommentUpvoted,
  })

  return (
    <button
      type='button'
      onClick={handleToggleUpvoteComment}
      className={twMerge(
        'flex items-center gap-1 text-sm text-gray-300',
        isUpvoted ? 'text-green-700' : 'text-gray-300'
      )}
    >
      <CaretUp className={isUpvoted ? 'text-green-700' : 'text-gray-300'} />+{upvotes}
    </button>
  )
}
