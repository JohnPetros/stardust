import { Solution } from '@stardust/core/challenging/entities'
import type { SolutionDto } from '@stardust/core/challenging/entities/dtos'
import { ChallengeSolutionSlotView } from './ChallengeSolutionSlotView'

type Props = {
  challengeSlug: string
  solutionDto: SolutionDto
  isSolutionNew: boolean
}

export const ChallengeSolutionSlot = ({
  challengeSlug,
  solutionDto,
  isSolutionNew,
}: Props) => {
  const solution = Solution.create(solutionDto)
  const upvotesCount = solution.upvotesCount.value
  const viewsCount = solution.viewsCount.value
  const commentsCount = solution.commentsCount.value

  return (
    <ChallengeSolutionSlotView
      challengeSlug={challengeSlug}
      isSolutionNew={isSolutionNew}
      solution={solution}
      upvotesCount={upvotesCount}
      commentsCount={commentsCount}
      viewsCount={viewsCount}
    />
  )
}
