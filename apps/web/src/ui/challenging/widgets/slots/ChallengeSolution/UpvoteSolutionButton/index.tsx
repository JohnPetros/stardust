'use client'

import { useUpvoteSolutionButton } from './useUpvoteSolutionButton'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Id } from '@stardust/core/global/structures'
import { useRest } from '@/ui/global/hooks/useRest'
import { UpvoteSolutionButtonView } from './UpvoteSolutionButtonView'

type Props = {
  solutionId: string
  initialUpvotesCount: number
  authorId: string
}

export const UpvoteSolutionButton = ({
  solutionId,
  initialUpvotesCount,
  authorId,
}: Props) => {
  const { challengingService } = useRest()
  const { user } = useAuthContext()
  const { isUpvoted, upvotesCount, handleButtonClick } = useUpvoteSolutionButton({
    initialIsUpvoted: user?.hasUpvotedSolution(Id.create(solutionId)).isTrue ?? false,
    initialUpvotesCount,
    challengingService,
  })
  const isUserSolutionAuthor = user?.id.value === authorId
  const textStyle = isUpvoted ? 'text-green-500' : 'text-gray-400'

  return (
    <UpvoteSolutionButtonView
      isUserSolutionAuthor={isUserSolutionAuthor}
      textStyle={textStyle}
      upvotesCount={upvotesCount}
      handleButtonClick={() => handleButtonClick(solutionId)}
    />
  )
}
