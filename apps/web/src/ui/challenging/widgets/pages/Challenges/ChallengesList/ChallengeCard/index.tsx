import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { ChallengeCardView } from './ChallengeCardView'
import type { ChallengeCategory } from '@stardust/core/challenging/entities'
import type { ChallengeDifficultyLevel } from '@stardust/core/challenging/types'
import type { Id } from '@stardust/core/global/structures'

type Props = {
  id: Id
  slug: string
  title: string
  difficultyLevel: ChallengeDifficultyLevel
  categories: ChallengeCategory[]
  upvotesCount: number
  downvotesCount: number
  completionsCount: number
  authorSlug: string
  authorName: string
}

export const ChallengeCard = (props: Props) => {
  const { user } = useAuthContext()

  if (user)
    return (
      <ChallengeCardView
        {...props}
        isCompleted={user.hasCompletedChallenge(props.id).isTrue}
      />
    )

  return <ChallengeCardView {...props} isCompleted={false} />
}
