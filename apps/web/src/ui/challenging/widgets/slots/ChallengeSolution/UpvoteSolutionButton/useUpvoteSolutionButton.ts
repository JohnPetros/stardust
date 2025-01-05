import { useState } from 'react'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useUpvoteSolutionAction } from './useUpvoteSolutionAction'

export function useUpvoteSolutionButton(
  initialUpvotesCount: number,
  initialIsUpvoted: boolean,
) {
  const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted)
  const [upvotesCount, setUpvotesCount] = useState(initialUpvotesCount)
  const { upvoteSolution, isExecuting } = useUpvoteSolutionAction({
    onError: () => {
      setUpvotesCount(initialUpvotesCount)
      setIsUpvoted(initialIsUpvoted)
    },
  })
  const { user, updateUserCache } = useAuthContext()

  async function handleButtonClick(solutionId: string) {
    if (isExecuting || !user) return

    if (isUpvoted && upvotesCount > 0) {
      setUpvotesCount((currentUpvotesCount) => currentUpvotesCount - 1)
    } else setUpvotesCount((upvotesCount) => upvotesCount + 1)
    setIsUpvoted(!isUpvoted)

    const response = await upvoteSolution(solutionId)
    if (response) {
      setUpvotesCount(response.upvotesCount)
      updateUserCache({
        ...user.dto,
        upvotedSolutionsIds: response.userUpvotedSolutionsIds,
      })
    }
  }

  return {
    isUpvoted,
    upvotesCount,
    handleButtonClick,
  }
}
