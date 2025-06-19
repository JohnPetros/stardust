import { useState } from 'react'

import type { ProfileService } from '@stardust/core/profile/interfaces'
import { Id } from '@stardust/core/global/structures'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

type Params = {
  profileService: ProfileService
  initialUpvotesCount: number
  initialIsUpvoted: boolean
}

export function useUpvoteComment({
  profileService,
  initialUpvotesCount,
  initialIsUpvoted,
}: Params) {
  const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted)
  const [upvotesCount, setUpvotesCount] = useState(initialUpvotesCount)
  const { user, updateUserCache } = useAuthContext()

  async function handleButtonClick(commentId: string) {
    if (!user) return

    if (isUpvoted && upvotesCount > 0) {
      setUpvotesCount((currentUpvotesCount) => currentUpvotesCount - 1)
    } else setUpvotesCount((upvotesCount) => upvotesCount + 1)
    setIsUpvoted(!isUpvoted)

    const response = await profileService.upvoteComment(Id.create(commentId))

    if (response.isSuccessful) {
      updateUserCache({
        ...user.dto,
        upvotedCommentsIds: response.body.userUpvotedCommentsIds,
      })
    }
  }

  return {
    isUpvoted,
    upvotesCount,
    handleButtonClick,
  }
}
