import { useUpvoteComment } from './useUpvoteComment'
import { UpvoteButtonView } from './UpvoteButtonView'
import { useRest } from '@/ui/global/hooks/useRest'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'

export type Props = {
  commentId: string
  isCommentUpvoted: boolean
  initialUpvotesCount: number
}

export const UpvoteButton = ({
  initialUpvotesCount,
  isCommentUpvoted,
  commentId,
}: Props) => {
  const { isAccountAuthenticated } = useAuthContext()
  const { profileService } = useRest()
  const { isUpvoted, upvotesCount, handleButtonClick } = useUpvoteComment({
    profileService,
    initialUpvotesCount,
    initialIsUpvoted: isCommentUpvoted,
  })

  return (
    <UpvoteButtonView
      isUpvoted={isUpvoted}
      upvotesCount={upvotesCount}
      isAccountAuthenticated={isAccountAuthenticated}
      onClick={() => handleButtonClick(commentId)}
    />
  )
}
