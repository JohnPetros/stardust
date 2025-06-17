import { twMerge } from 'tailwind-merge'

import { Icon } from '@/ui/global/widgets/components/Icon'
import type { ChallengeVote } from '@stardust/core/challenging/structures'

type Props = {
  challengeVote: ChallengeVote
  upvotesCount: number
  isUserChallengeAuthor: boolean
  handleVoteButtonClick: (vote: string) => void
}

export const ChallengeVoteControlView = ({
  challengeVote,
  upvotesCount,
  isUserChallengeAuthor,
  handleVoteButtonClick,
}: Props) => {
  const upvoteColor = 'text-green-500'
  const downVoteColor = 'text-red-500'
  const nullVoteColor = 'text-gray-400'

  return (
    <div className='flex items-center justify-center gap-1'>
      <button
        type='button'
        onClick={() => handleVoteButtonClick('upvote')}
        disabled={isUserChallengeAuthor}
        className={
          'flex h-8 items-center justify-center gap-1 rounded-lg bg-green-900/90 px-2'
        }
      >
        <Icon
          name='upvote'
          weight='bold'
          size={16}
          className={challengeVote.isUpvote.isTrue ? upvoteColor : nullVoteColor}
        />
        <span
          className={twMerge(
            'text-sm',
            challengeVote.isUpvote.isTrue ? upvoteColor : nullVoteColor,
          )}
        >
          {upvotesCount}
        </span>
      </button>
      {!isUserChallengeAuthor && (
        <button
          type='button'
          onClick={() => handleVoteButtonClick('downvote')}
          disabled={isUserChallengeAuthor}
          className={
            'flex h-8 items-center justify-center gap-1 rounded-lg bg-green-900/90 px-2'
          }
        >
          <Icon
            name='downvote'
            weight='bold'
            size={16}
            className={challengeVote.isDownvote.isTrue ? downVoteColor : nullVoteColor}
          />
        </button>
      )}
    </div>
  )
}
