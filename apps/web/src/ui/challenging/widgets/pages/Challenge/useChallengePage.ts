'use client'

import { useEffect } from 'react'

import type { ChallengeVote } from '@stardust/core/challenging/types'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import { Challenge } from '@stardust/core/challenging/entities'
import { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'

import { ROUTES, STORAGE } from '@/constants'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import type {
  ChallengeContent,
  PanelsLayout,
} from '@/ui/challenging/stores/ChallengeStore/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'

export function useChallengePage(challengeDto: ChallengeDto, userVote: ChallengeVote) {
  const {
    getChallengeSlice,
    getCraftsVisibilitySlice,
    getActiveContentSlice,
    getPanelsLayoutSlice,
    resetStore,
  } = useChallengeStore()
  const { setActiveContent } = getActiveContentSlice()
  const { challenge, setChallenge } = getChallengeSlice()
  const { panelsLayout, setPanelsLayout } = getPanelsLayoutSlice()
  const { craftsVislibility, setCraftsVislibility } = getCraftsVisibilitySlice()
  const { user } = useAuthContext()
  const { currentRoute, goTo } = useRouter()
  const [isNew] = useQueryStringParam('isNew')
  const secondCounterLocalstorage = useLocalStorage(STORAGE.keys.secondsCounter)

  function handleBackButton() {
    if (!challenge) return

    secondCounterLocalstorage.remove()
    resetStore()
    goTo(challenge.isFromStar.isTrue ? ROUTES.space : ROUTES.challenging.challenges.list)
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
    if (challenge && user && !craftsVislibility) {
      const isUserChallengeAuthor = user.id === challenge.authorId
      const isChallengeCompleted = user.hasCompletedChallenge(challenge.id)
      setCraftsVislibility(
        ChallengeCraftsVisibility.create({
          canShowComments:
            isUserChallengeAuthor ||
            isChallengeCompleted.isTrue ||
            challenge.isCompleted.isTrue,
          canShowSolutions:
            isUserChallengeAuthor ||
            isChallengeCompleted.isTrue ||
            challenge.isCompleted.isTrue,
        }),
      )
    }
  }, [
    challenge,
    user,
    craftsVislibility,
    challengeDto,
    userVote,
    setChallenge,
    setCraftsVislibility,
  ])

  useEffect(() => {
    if (!challenge) return

    const activeContent = currentRoute.split('/').pop()
    if (!activeContent) return

    if (activeContent === 'challenge') {
      setActiveContent('description')
      return
    }

    if (activeContent !== challenge.slug.value)
      setActiveContent(activeContent as ChallengeContent)
  }, [currentRoute, challenge, setActiveContent])

  useEffect(() => {
    return () => {
      resetStore()
    }
  }, [])

  return {
    challenge,
    panelsLayout,
    shouldHaveConfettiAnimation: isNew && Boolean(challenge?.authorId === user?.id),
    handleBackButton,
    handlePanelsLayoutButton,
  }
}
