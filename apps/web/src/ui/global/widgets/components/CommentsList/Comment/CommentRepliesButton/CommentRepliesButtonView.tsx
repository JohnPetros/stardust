'use client'

import { twMerge } from 'tailwind-merge'

type Props = {
  repliesCount: number
  hasReplies: boolean
  isRepliesVisible: boolean
  isAccountAuthenticated: boolean
  onToggleRepliesVisible: VoidFunction
}

export const CommentRepliesButtonView = ({
  repliesCount,
  hasReplies,
  isRepliesVisible,
  onToggleRepliesVisible,
}: Props) => {
  return (
    <button
      type='button'
      onClick={onToggleRepliesVisible}
      disabled={!hasReplies}
      className={twMerge(
        'flex items-center gap-2 text-sm',
        hasReplies
          ? ' cursor-pointer text-gray-300'
          : 'pointer-events-none text-gray-500',
      )}
    >
      {hasReplies && <span>{isRepliesVisible ? 'Esconder' : 'Mostrar'}</span>}
      respostas ({repliesCount})
    </button>
  )
}
