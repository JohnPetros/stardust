'use client'

import { twMerge } from 'tailwind-merge'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { useChallengeVoteControl } from './useChallengeVoteControl'

export function ChallengeVoteControl() {
  const { challenge, upvotesCount, isUserChallengeAuthor, handleVoteButton } =
    useChallengeVoteControl()
  const upvoteColor = 'text-green-500'
  const downVoteColor = 'text-red-500'
  const nullVoteColor = 'text-gray-400'

  return (
    <div className='flex items-center justify-center gap-1'>
      <button
        type='button'
        onClick={() => handleVoteButton('upvote')}
        disabled={isUserChallengeAuthor}
        className={
          'flex h-8 items-center justify-center gap-1 rounded-lg bg-green-900/90 px-2'
        }
      >
        <Icon
          name='upvote'
          weight='bold'
          size={16}
          className={challenge?.userVote === 'upvote' ? upvoteColor : nullVoteColor}
        />
        <span
          className={twMerge(
            'text-sm',
            challenge?.userVote === 'upvote' ? upvoteColor : nullVoteColor,
          )}
        >
          {upvotesCount}
        </span>
      </button>
      {isUserChallengeAuthor && (
        <button
          type='button'
          onClick={() => handleVoteButton('downvote')}
          disabled={isUserChallengeAuthor}
          className={
            'flex h-8 items-center justify-center gap-1 rounded-lg bg-green-900/90 px-2'
          }
        >
          <Icon
            name='downvote'
            weight='bold'
            size={16}
            className={challenge?.userVote === 'downvote' ? downVoteColor : nullVoteColor}
          />
        </button>
      )}
    </div>
  )
}
