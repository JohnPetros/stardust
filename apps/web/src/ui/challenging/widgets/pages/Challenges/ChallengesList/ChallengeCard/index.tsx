import type { ChallengeCategory } from '@stardust/core/challenging/entities'
import type { ChallengeDifficultyLevel } from '@stardust/core/challenging/types'
import type { Id } from '@stardust/core/global/structures'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { ChallengeCardView } from './ChallengeCardView'

type Props = {
  id: Id
  slug: string
  title: string
  difficultyLevel: ChallengeDifficultyLevel
  categories: ChallengeCategory[]
  upvotesCount: number
  downvotesCount: number
  completionCount: number
  authorSlug: string
  authorName: string
  isNew: boolean
}

export const ChallengeCard = (props: Props) => {
  const { user } = useAuthContext()

  if (user)
    return (
      <ChallengeCardView
        {...props}
        isCompleted={user.hasCompletedChallenge(props.id).isTrue}
        isUserGod={user.isGod.isTrue}
      />
    )

  return <ChallengeCardView {...props} isCompleted={false} isUserGod={false} />
}
