'use client'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
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
  const { isAccountAuthenticated } = useAuthContext()

  return (
    <CommentRepliesButtonView
      isAccountAuthenticated={isAccountAuthenticated}
      repliesCount={repliesCount}
      hasReplies={hasReplies}
      isRepliesVisible={isRepliesVisible}
      onToggleRepliesVisible={onToggleRepliesVisible}
    />
  )
}
