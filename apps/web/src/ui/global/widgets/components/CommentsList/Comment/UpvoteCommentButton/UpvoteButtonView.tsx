import { twMerge } from 'tailwind-merge'

import { Icon } from '../../../Icon'

export type Props = {
  isAccountAuthenticated: boolean
  isUpvoted: boolean
  upvotesCount: number
  onClick: () => void
}

export const UpvoteButtonView = ({
  isAccountAuthenticated,
  isUpvoted,
  upvotesCount,
  onClick,
}: Props) => {
  return (
    <button
      type='button'
      disabled={!isAccountAuthenticated}
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
