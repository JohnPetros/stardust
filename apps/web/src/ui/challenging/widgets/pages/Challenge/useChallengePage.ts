'use client'

import { useEffect } from 'react'

import type { ChallengeVote } from '@stardust/core/challenging/types'
import { Challenge } from '@stardust/core/challenging/entities'

import { ROUTES } from '@/constants'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import type {
  ChallengeContent,
  PanelsLayout,
} from '@/ui/challenging/stores/ChallengeStore/types'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function useChallengePage(challengeDto: ChallengeDto, userVote: ChallengeVote) {
  const {
    getChallengeSlice,
    getCraftsVisibilitySlice,
    getActiveContentSlice,
    getPanelsLayoutSlice,
  } = useChallengeStore()
  const { setActiveContent } = getActiveContentSlice()
  const { challenge, setChallenge } = getChallengeSlice()
  const { panelsLayout, setPanelsLayout } = getPanelsLayoutSlice()
  const { craftsVislibility, setCraftsVislibility } = getCraftsVisibilitySlice()
  const { user } = useAuthContext()
  const { currentRoute, goTo } = useRouter()

  function handleBackButton() {
    if (challenge)
      goTo(
        challenge.isFromStar.isTrue ? ROUTES.space : ROUTES.challenging.challenges.list,
      )
  }

  function handlePanelsLayoutButton(panelsLayout: PanelsLayout) {
    setPanelsLayout(panelsLayout)
  }

  useEffect(() => {
    if (!challenge) {
      const challenge = Challenge.create(challengeDto)
      challenge.userVote = userVote
      setChallenge(challenge)
    }
    if (!craftsVislibility && challenge && user) {
      const isUserChallengeAuthor = user.id === challenge.authorId
      const isChallengeCompleted = user.hasCompletedChallenge(challenge.id)
      setCraftsVislibility(
        ChallengeCraftsVisibility.create({
          canShowComments: isUserChallengeAuthor || isChallengeCompleted.isTrue,
          canShowSolutions: isUserChallengeAuthor || isChallengeCompleted.isTrue,
        }),
      )
    }
  }, [
    challenge,
    craftsVislibility,
    user,
    challengeDto,
    userVote,
    setChallenge,
    setCraftsVislibility,
  ])

  useEffect(() => {
    setActiveContent('description')
    if (!challenge) return

    const activeContent = currentRoute.split('/').pop()
    if (!activeContent) return

    if (activeContent !== challenge.slug.value)
      setActiveContent(activeContent as ChallengeContent)
  }, [currentRoute, challenge, setActiveContent])

  return {
    challenge,
    panelsLayout,
    handleBackButton,
    handlePanelsLayoutButton,
  }
}
