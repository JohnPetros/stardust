import { useState } from 'react'
import { useAction } from 'next-safe-action/hooks'

import { forumActions } from '@/server/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useUpvoteCommentAction(
  initialUpvotesCount: number,
  initialIsUpvoted: boolean,
) {
  const toast = useToastContext()
  const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted)
  const [upvotesCount, setUpvotesCount] = useState(initialUpvotesCount)
  const { executeAsync } = useAction(forumActions.upvoteComment, {
    onError: ({ error }) => {
      setUpvotesCount(initialUpvotesCount)
      setIsUpvoted(initialIsUpvoted)
      if (error.serverError) toast.show(error.serverError)
    },
    onExecute: () => {
      if (isUpvoted) setUpvotesCount((upvotesCount) => upvotesCount - 1)
      else setUpvotesCount((upvotesCount) => upvotesCount + 1)
      setIsUpvoted(!isUpvoted)
    },
  })

  async function upvote(commentId: string) {
    const reponse = await executeAsync({ commentId })
    if (reponse?.data) setUpvotesCount(reponse?.data.upvotesCount)
  }

  return {
    isUpvoted,
    upvotesCount,
    upvote,
  }
}
