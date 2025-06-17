import { twMerge } from 'tailwind-merge'

import { Icon } from '../../../Icon'

export type Props = {
  isUpvoted: boolean
  upvotesCount: number
  onClick: () => void
}

export const UpvoteButtonView = ({ isUpvoted, upvotesCount, onClick }: Props) => {
  return (
    <button
      type='button'
      className={twMerge(
        'flex items-center gap-1 text-sm text-gray-300',
        isUpvoted ? 'text-green-700' : 'text-gray-300',
      )}
      onClick={onClick}
    >
      <Icon
        name='simple-arrow-up'
        size={16}
        className={isUpvoted ? 'text-green-700' : 'text-gray-300'}
      />
      +{upvotesCount}
    </button>
  )
}
