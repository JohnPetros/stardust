import { useEffect } from 'react'

import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import { Challenge } from '@stardust/core/challenging/entities'
import {
  ChallengeCraftsVisibility,
  ChallengeVote,
} from '@stardust/core/challenging/structures'

import { ROUTES, STORAGE } from '@/constants'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import type {
  ChallengeContent,
  PanelsLayout,
} from '@/ui/challenging/stores/ChallengeStore/types'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { Logical } from '@stardust/core/global/structures'
import type { User } from '@stardust/core/profile/entities'

type Params = {
  challengeDto: ChallengeDto
  userChallengeVote: string
  user: User | null
  isAccountAuthenticated: boolean
}

export function useChallengePage({
  challengeDto,
  userChallengeVote,
  user,
  isAccountAuthenticated,
}: Params) {
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
  const { currentRoute, goTo } = useNavigationProvider()
  const [isNew] = useQueryStringParam('isNew')
  const secondCounterLocalstorage = useLocalStorage(STORAGE.keys.secondsCounter)

  function handleBackButtonClick() {
    if (!challenge) return

    secondCounterLocalstorage.remove()
    resetStore()
    goTo(challenge.isFromStar.isTrue ? ROUTES.space : ROUTES.challenging.challenges.list)
  }

  function handlePanelsLayoutButtonClick(panelsLayout: PanelsLayout) {
    setPanelsLayout(panelsLayout)
  }

  useEffect(() => {
    if (!challenge) {
      const challenge = Challenge.create(challengeDto)
      challenge.userVote = ChallengeVote.create(userChallengeVote)
      setChallenge(challenge)
    }

    if (challenge && !craftsVislibility && isAccountAuthenticated && user) {
      const isUserChallengeAuthor = challenge.author.isEqualTo(user)
      const isChallengeCompleted = user.hasCompletedChallenge(challenge.id)

      setCraftsVislibility(
        ChallengeCraftsVisibility.create({
          canShowComments: challenge.isFromStar.isTrue
            ? isChallengeCompleted.isTrue
            : true,
          canShowSolutions: isUserChallengeAuthor
            .or(isChallengeCompleted)
            .or(challenge.isCompleted).isTrue,
        }),
      )
    }

    if (challenge && !craftsVislibility && !isAccountAuthenticated) {
      setCraftsVislibility(
        ChallengeCraftsVisibility.create({
          canShowComments: true,
          canShowSolutions: false,
        }),
      )
    }
  }, [
    challenge,
    craftsVislibility,
    user,
    challengeDto,
    userChallengeVote,
    isAccountAuthenticated,
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
    challengeTitle: challenge?.title.value ?? null,
    panelsLayout,
    shouldHaveConfettiAnimation:
      challenge && user && isNew ? challenge?.author.isEqualTo(user).isTrue : false,
    handleBackButtonClick,
    handlePanelsLayoutButtonClick,
  }
}
