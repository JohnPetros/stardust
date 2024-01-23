'use client'

import { CaretUp } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { useUpvotesButton } from './useUpvotesButton'

export type UpvotesButtonProps = {
  commentId: string
  isCommentUpvoted: boolean
  initialUpvotes: number
}

export function UpvotesButton({
  initialUpvotes,
  commentId,
  isCommentUpvoted,
}: UpvotesButtonProps) {
  console.log({ isCommentUpvoted })

  const { handleToggleUpvoteComment, isUpvoted, upvotes } = useUpvotesButton({
    initialUpvotes,
    commentId,
    isCommentUpvoted,
  })

  return (
    <button
      onClick={handleToggleUpvoteComment}
      className={twMerge(
        'flex items-center gap-1 text-sm text-gray-300',
        isUpvoted ? 'text-green-700' : 'text-gray-300'
      )}
    >
      <CaretUp className={isUpvoted ? 'text-green-700' : 'text-gray-300'} />+
      {upvotes}
    </button>
  )
}
