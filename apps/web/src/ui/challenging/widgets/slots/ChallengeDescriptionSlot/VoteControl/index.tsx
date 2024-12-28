'use client'

import { twMerge } from 'tailwind-merge'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { useVoteControl } from './useVoteControl'

export function VoteControl() {
  const { vote, upvotesCount, handleVoteButton } = useVoteControl()

  const upvoteColor = 'text-green-500'
  const downVoteColor = 'text-red-500'
  const nullVoteColor = 'text-gray-400'

  return (
    <div className='flex items-center justify-center gap-1'>
      <button
        type='button'
        onClick={() => handleVoteButton('upvote')}
        className={
          'flex h-8 items-center justify-center gap-1 rounded-lg bg-green-900/90 px-2'
        }
      >
        <Icon
          name='upvote'
          weight='bold'
          className={vote === 'upvote' ? upvoteColor : nullVoteColor}
        />
        <span
          className={twMerge('text-sm', vote === 'upvote' ? upvoteColor : nullVoteColor)}
        >
          {upvotesCount}
        </span>
      </button>
      <button
        type='button'
        onClick={() => handleVoteButton('downvote')}
        className={
          'flex h-8 items-center justify-center gap-1 rounded-lg bg-green-900/90 px-2'
        }
      >
        <Icon
          name='downvote'
          weight='bold'
          className={vote === 'downvote' ? downVoteColor : nullVoteColor}
        />
      </button>
    </div>
  )
}
