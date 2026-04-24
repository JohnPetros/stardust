import { useEffect, useRef, useState } from 'react'

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
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'

type Params = {
  challengeDto: ChallengeDto
  userChallengeVote: string
  previousChallengeSlug: string | null
  nextChallengeSlug: string | null
  user: User | null
  isAccountAuthenticated: boolean
}

type HydrationComparablePayload = {
  id: string | null
  title: string
  code: string
  difficultyLevel: string
  description: string
  starId: string | null
  isPublic: boolean
  downvotesCount: number
  upvotesCount: number
  completionCount: number
  categories: ChallengeDto['categories']
  testCases: ChallengeDto['testCases']
  userChallengeVote: string
}

function toHydrationComparablePayload(
  challengeDto: ChallengeDto,
  userChallengeVote: string,
): HydrationComparablePayload {
  return {
    id: challengeDto.id ?? null,
    title: challengeDto.title,
    code: challengeDto.code,
    difficultyLevel: challengeDto.difficultyLevel,
    description: challengeDto.description,
    starId: challengeDto.starId ? challengeDto.starId : null,
    isPublic: challengeDto.isPublic ?? false,
    downvotesCount: challengeDto.downvotesCount ?? 0,
    upvotesCount: challengeDto.upvotesCount ?? 0,
    completionCount: challengeDto.completionCount ?? 0,
    categories: challengeDto.categories,
    testCases: challengeDto.testCases,
    userChallengeVote,
  }
}

function shouldHydrateChallenge(
  challengeDto: ChallengeDto,
  userChallengeVote: string,
  currentChallenge: Challenge | null,
) {
  if (!currentChallenge) return true

  const incomingPayload = JSON.stringify(
    toHydrationComparablePayload(challengeDto, userChallengeVote),
  )
  const currentPayload = JSON.stringify(
    toHydrationComparablePayload(currentChallenge.dto, currentChallenge.userVote.value),
  )

  return incomingPayload !== currentPayload
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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

  function handleOpenSidebar() {
    setIsSidebarOpen(true)
  }

  function handleCloseSidebar() {
    setIsSidebarOpen(false)
  }

  function handleSidebarChallengeSelect(challengeSlug: string) {
    goTo(ROUTES.challenging.challenges.challenge(challengeSlug))
  }

  useEffect(() => {
    if (shouldHydrateChallenge(challengeDto, userChallengeVote, challenge)) {
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
    previousChallengeSlug,
    nextChallengeSlug,
    isSidebarOpen,
    challengeSlug: challengeDto.slug ?? '',
    challengeNavigationAlertDialogRef,
    confirmNavigation,
    cancelNavigation,
    handleBackButtonClick,
    handlePanelsLayoutButtonClick,
    handlePreviousChallengeClick,
    handleNextChallengeClick,
    handleOpenSidebar,
    handleCloseSidebar,
    handleSidebarChallengeSelect,
  }
}
