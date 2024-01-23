'use client'

import { twMerge } from 'tailwind-merge'

type RepliesButtonProps = {
  repliesAmount: number
  hasReplies: boolean
  isRepliesVisible: boolean
  onToggleRepliesVisible: VoidFunction
}

export function RepliesButton({
  repliesAmount,
  hasReplies,
  isRepliesVisible,
  onToggleRepliesVisible,
}: RepliesButtonProps) {
  return (
    <button
      onClick={onToggleRepliesVisible}
      disabled={!hasReplies}
      className={twMerge(
        'flex items-center gap-2 text-sm',
        hasReplies
          ? ' cursor-pointer text-gray-300'
          : 'pointer-events-none text-gray-500'
      )}
    >
      {hasReplies && <span>{isRepliesVisible ? 'Esconder' : 'Mostrar'}</span>}
      respostas ({repliesAmount})
    </button>
  )
}
