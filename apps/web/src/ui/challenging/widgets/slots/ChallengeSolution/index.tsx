import { UserAvatar } from '@/ui/global/widgets/components/UserAvatar'
import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { Solution } from '@stardust/core/challenging/entities'
import { SolutionInfo } from '../../components/SolutionInfo'

type ChallengeSolutionSlotProps = {
  solutionDto: SolutionDto
}

export function ChallengeSolutionSlot({ solutionDto }: ChallengeSolutionSlotProps) {
  const solution = Solution.create(solutionDto)
  return (
    <div>
      <header>
        <UserAvatar
          avatarName={solution.author.avatar.name.value}
          avatarImage={solution.author.avatar.image.value}
          size={40}
        />
        <div>
          <span>{solution.author.name.value}</span>
          <SolutionInfo
            viewsCount={solution.viewsCount.value}
            commentsCount={solution.commentsCount.value}
            upvotesCount={solution.upvotesCount.value}
            createdAt={solution.createdAt}
          />
        </div>
      </header>
    </div>
  )
}
