import { Id } from '@stardust/core/global/structures'
import type { User } from '@stardust/core/profile/entities'

import { SidebarChallengeItemView } from './SidebarChallengeItemView'

type Props = {
  challengeId: string | undefined
  challengeSlug: string | undefined
  title: string
  difficultyLevel: string
  isActive: boolean
  user: User | null
  isAccountAuthenticated: boolean
  onClick: (challengeSlug: string) => void
}

export const SidebarChallengeItem = ({
  challengeId,
  challengeSlug,
  title,
  difficultyLevel,
  isActive,
  user,
  isAccountAuthenticated,
  onClick,
}: Props) => {
  const isCompleted =
    isAccountAuthenticated && user && challengeId
      ? user.hasCompletedChallenge(Id.create(challengeId)).isTrue
      : false

  return (
    <SidebarChallengeItemView
      title={title}
      difficultyLevel={difficultyLevel}
      isActive={isActive}
      isCompleted={isCompleted}
      shouldShowCompletion={isAccountAuthenticated}
      onClick={() => {
        if (!challengeSlug) return
        onClick(challengeSlug)
      }}
    />
  )
}
