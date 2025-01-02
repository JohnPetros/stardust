import { useState } from 'react'

import { useUpvoteCommentAction } from './useUpvoteCommentAction'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { User } from '@stardust/core/global/entities'

export function useUpvoteComment(initialUpvotesCount: number, initialIsUpvoted: boolean) {
  const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted)
  const [upvotesCount, setUpvotesCount] = useState(initialUpvotesCount)
  const { upvoteComment, isExecuting } = useUpvoteCommentAction({
    onError: () => {
      setUpvotesCount(initialUpvotesCount)
      setIsUpvoted(initialIsUpvoted)
    },
  })
  const { user, updateUserCache } = useAuthContext()

  async function handleButtonClick(commentId: string) {
    if (isExecuting || !user) return

    if (isUpvoted && upvotesCount > 0) {
      setUpvotesCount((currentUpvotesCount) => currentUpvotesCount - 1)
    } else setUpvotesCount((upvotesCount) => upvotesCount + 1)
    setIsUpvoted(!isUpvoted)

    const response = await upvoteComment(commentId)
    if (response) {
      setUpvotesCount(response.upvotesCount)
      updateUserCache({
        ...user.dto,
        upvotedCommentsIds: response.userUpvotedCommentsIds,
      })
    }
  }

  return {
    isUpvoted,
    upvotesCount,
    handleButtonClick,
  }
}
