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
  const { executeAsync, isPending } = useAction(forumActions.upvoteComment, {
    onError: ({ error }) => {
      setUpvotesCount(initialUpvotesCount)
      setIsUpvoted(initialIsUpvoted)
      if (error.serverError) toast.show(error.serverError)
    },
  })

  async function upvote(commentId: string) {
    if (isPending) return

    if (isUpvoted && upvotesCount > 0) setUpvotesCount((upvotesCount) => upvotesCount - 1)
    else setUpvotesCount((upvotesCount) => upvotesCount + 1)
    setIsUpvoted(!isUpvoted)

    const reponse = await executeAsync({ commentId })
    if (reponse?.data) setUpvotesCount(reponse?.data.upvotesCount)
  }

  return {
    isUpvoted,
    upvotesCount,
    upvote,
  }
}
