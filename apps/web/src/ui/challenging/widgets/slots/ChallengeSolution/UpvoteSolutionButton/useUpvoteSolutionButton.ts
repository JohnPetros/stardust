import { useState } from 'react'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Id } from '@stardust/core/global/structures'

type Params = {
  initialUpvotesCount: number
  initialIsUpvoted: boolean
  challengingService: ChallengingService
}

export function useUpvoteSolutionButton({
  initialUpvotesCount,
  initialIsUpvoted,
  challengingService,
}: Params) {
  const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted)
  const [upvotesCount, setUpvotesCount] = useState(initialUpvotesCount)
  const { user, updateUserCache } = useAuthContext()

  async function handleButtonClick(solutionId: string) {
    if (!user) return

    if (isUpvoted && upvotesCount > 0) {
      setUpvotesCount((currentUpvotesCount) => currentUpvotesCount - 1)
    } else setUpvotesCount((upvotesCount) => upvotesCount + 1)
    setIsUpvoted(!isUpvoted)

    const response = await challengingService.upvoteSolution(Id.create(solutionId))

    if (response) {
      setUpvotesCount(response.body.upvotesCount)
      updateUserCache({
        ...user.dto,
        upvotedSolutionsIds: [...user.upvotedCommentsIds.dto, solutionId],
      })
    }
  }

  return {
    isUpvoted,
    upvotesCount,
    handleButtonClick,
  }
}
