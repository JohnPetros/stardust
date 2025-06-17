'use client'

import { CommentRepliesButtonView } from './CommentRepliesButtonView'

type Props = {
  repliesCount: number
  hasReplies: boolean
  isRepliesVisible: boolean
  onToggleRepliesVisible: VoidFunction
}

export const CommentRepliesButton = ({
  repliesCount,
  hasReplies,
  isRepliesVisible,
  onToggleRepliesVisible,
}: Props) => {
  return (
    <CommentRepliesButtonView
      repliesCount={repliesCount}
      hasReplies={hasReplies}
      isRepliesVisible={isRepliesVisible}
      onToggleRepliesVisible={onToggleRepliesVisible}
    />
  )
}
