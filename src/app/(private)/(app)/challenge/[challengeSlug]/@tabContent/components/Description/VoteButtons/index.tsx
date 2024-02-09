'use client'

import { ThumbsDown, ThumbsUp } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { useVoteButtons } from './useVoteButtons'

export function VoteButtons() {
  const { upvotes, userVote, handleVoteButton } = useVoteButtons()

  const upvoteColor = 'text-green-500'
  const downVoteColor = 'text-red-500'
  const nullVoteColor = 'text-gray-400'

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => handleVoteButton('upvote')}
        className={
          'flex h-8 items-center justify-center gap-1 rounded-lg bg-green-900/90 px-2'
        }
      >
        <ThumbsUp
          weight="bold"
          className={userVote === 'upvote' ? upvoteColor : nullVoteColor}
        />
        <span
          className={twMerge(
            'text-sm',
            userVote === 'upvote' ? upvoteColor : nullVoteColor
          )}
        >
          {upvotes}
        </span>
      </button>
      <button
        onClick={() => handleVoteButton('downvote')}
        className={
          'flex h-8 items-center justify-center gap-1 rounded-lg bg-green-900/90 px-2'
        }
      >
        <ThumbsDown
          weight="bold"
          className={userVote === 'downvote' ? downVoteColor : nullVoteColor}
        />
      </button>
    </div>
  )
}
