import { ThumbsDown, ThumbsUp } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { useVoteButtons } from './useVoteButtons'

import { Vote } from '@/@types/vote'

type VoteButtonsProps = {
  upvotes: number
  downvotes: number
  userVote: Vote
}

export function VoteButtons({
  upvotes,
  downvotes,
  userVote,
}: VoteButtonsProps) {
  const { activeVote } = useVoteButtons(userVote)

  return (
    <div>
      <button className={twMerge('roumded-lg bg-green-800 p-1')}>
        <ThumbsUp
          className={
            activeVote === 'upvote' ? 'text-green-500' : 'text-gray-600'
          }
        />
        <span>{upvotes}</span>
      </button>
      <button className={twMerge('roumded-lg bg-green-800 p-1')}>
        <ThumbsDown
          className={activeVote === 'upvote' ? 'text-red-500' : 'text-gray-600'}
        />
        <span>{downvotes}</span>
      </button>
    </div>
  )
}
