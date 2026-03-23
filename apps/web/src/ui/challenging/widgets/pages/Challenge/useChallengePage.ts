import { createElement, useEffect, useMemo, useRef } from 'react'

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
import type { User } from '@stardust/core/profile/entities'
import { useChallengeNavigationGuard } from '@/ui/challenging/hooks/useChallengeNavigationGuard'
import { ChallengeNavigation } from '../../components/ChallengeNavigation'
import { ChallengeNavigationAlertDialog } from '../../components/ChallengeNavigationAlertDialog'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'

type Params = {
  challengeDto: ChallengeDto
  userChallengeVote: string
  previousChallengeSlug: string | null
  nextChallengeSlug: string | null
  user: User | null
  isAccountAuthenticated: boolean
}

export function useChallengePage({
  challengeDto,
  userChallengeVote,
  previousChallengeSlug,
  nextChallengeSlug,
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
  const navigationProvider = useNavigationProvider()
  const [isNew] = useQueryStringParam('isNew')
  const secondCounterLocalstorage = useLocalStorage(STORAGE.keys.secondsCounter)
  const challengeNavigationAlertDialogRef = useRef<AlertDialogRef | null>(null)
  const { requestNavigation, confirmNavigation, cancelNavigation } =
    useChallengeNavigationGuard({
      challenge,
      navigationProvider,
      dialogRef: challengeNavigationAlertDialogRef,
    })

  function handleBackButtonClick() {
    if (!challenge) return

    secondCounterLocalstorage.remove()
    resetStore()
    goTo(challenge.isFromStar.isTrue ? ROUTES.space : ROUTES.challenging.challenges.list)
  }

  function handlePanelsLayoutButtonClick(panelsLayout: PanelsLayout) {
    setPanelsLayout(panelsLayout)
  }

  function handlePreviousChallengeClick() {
    if (!previousChallengeSlug) return

    requestNavigation(ROUTES.challenging.challenges.challenge(previousChallengeSlug))
  }

  function handleNextChallengeClick() {
    if (!nextChallengeSlug) return

    requestNavigation(ROUTES.challenging.challenges.challenge(nextChallengeSlug))
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

  const challengeNavigationSlot = useMemo(() => {
    return createElement(ChallengeNavigation, {
      previousChallengeSlug,
      nextChallengeSlug,
      onPreviousChallengeClick: handlePreviousChallengeClick,
      onNextChallengeClick: handleNextChallengeClick,
    })
  }, [nextChallengeSlug, previousChallengeSlug])

  const challengeNavigationAlertDialogSlot = useMemo(() => {
    return createElement(ChallengeNavigationAlertDialog, {
      dialogRef: challengeNavigationAlertDialogRef,
      onConfirm: confirmNavigation,
      onCancel: cancelNavigation,
    })
  }, [confirmNavigation, cancelNavigation])

  return {
    challengeTitle: challenge?.title.value ?? null,
    panelsLayout,
    shouldHaveConfettiAnimation:
      challenge && user && isNew ? challenge?.author.isEqualTo(user).isTrue : false,
    challengeNavigationSlot,
    challengeNavigationAlertDialogSlot,
    handleBackButtonClick,
    handlePanelsLayoutButtonClick,
  }
}
