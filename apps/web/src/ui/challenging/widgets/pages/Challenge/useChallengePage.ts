import { useEffect, useRef, useState, type MutableRefObject } from 'react'

import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import { Challenge } from '@stardust/core/challenging/entities'
import {
  ChallengeCraftsVisibility,
  ChallengeVote,
} from '@stardust/core/challenging/structures'
import type { NavigationProvider } from '@stardust/core/global/interfaces'
import type { User } from '@stardust/core/profile/entities'
import type { ClientAnalyticsProvider } from '@stardust/core/analytics/interfaces'
import { roadmapNodeKeySchema } from '@stardust/validation/challenging/schemas'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import type {
  ChallengeContent,
  DockablePanelId,
} from '@/ui/challenging/stores/ChallengeStore/types'

type Storage = { remove: () => void }
type NavigationGuard = {
  requestNavigation: (route: string) => void
  confirmNavigation: () => void
  cancelNavigation: () => void
}

function isValidRoadmapContext(
  from: string | null,
  roadmapNode: string | null,
  challenge: Challenge,
) {
  return (
    from === 'roadmap' &&
    roadmapNodeKeySchema.safeParse(roadmapNode).success &&
    challenge.isFromStar.isFalse &&
    challenge.isPublic.isTrue
  )
}

export type ChallengePageParams = {
  challengeDto: ChallengeDto
  userChallengeVote: string
  previousChallengeSlug: string | null
  nextChallengeSlug: string | null
  user: User | null
  isAccountAuthenticated: boolean
  analytics: ClientAnalyticsProvider
  navigationProvider: NavigationProvider
  challenge: Challenge | null
  setChallenge: (challenge: Challenge) => void
  craftsVislibility: ChallengeCraftsVisibility | null
  setCraftsVislibility: (value: ChallengeCraftsVisibility) => void
  setActiveContent: (content: ChallengeContent) => void
  panelOrder: DockablePanelId[]
  resetPanelsLayout: () => void
  resetStore: () => void
  challengeNavigationAlertDialogRef: MutableRefObject<AlertDialogRef | null>
  navigationGuard: NavigationGuard
  isNew: string | null
  from: string | null
  roadmapNode: string | null
  roadmapRevisionKey: string | null
  roadmapContextLocalstorage: Storage
  secondCounterLocalstorage: Storage
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
  officialSolution: ChallengeDto['officialSolution']
  userChallengeVote: string
}

function toHydrationComparablePayload(
  dto: ChallengeDto,
  vote: string,
): HydrationComparablePayload {
  return {
    id: dto.id ?? null,
    title: dto.title,
    code: dto.initialCode,
    difficultyLevel: dto.difficultyLevel,
    description: dto.description,
    starId: dto.starId ? dto.starId : null,
    isPublic: dto.isPublic ?? false,
    downvotesCount: dto.downvotesCount ?? 0,
    upvotesCount: dto.upvotesCount ?? 0,
    completionCount: dto.completionCount ?? 0,
    categories: dto.categories,
    testCases: dto.testCases,
    officialSolution: dto.officialSolution ?? null,
    userChallengeVote: vote,
  }
}

function shouldHydrateChallenge(
  dto: ChallengeDto,
  vote: string,
  current: Challenge | null,
) {
  if (!current) return true
  return (
    JSON.stringify(toHydrationComparablePayload(dto, vote)) !==
    JSON.stringify(toHydrationComparablePayload(current.dto, current.userVote.value))
  )
}

export function useChallengePage({
  challengeDto,
  userChallengeVote,
  previousChallengeSlug,
  nextChallengeSlug,
  user,
  isAccountAuthenticated,
  analytics,
  navigationProvider,
  challenge,
  setChallenge,
  craftsVislibility,
  setCraftsVislibility,
  setActiveContent,
  panelOrder,
  resetPanelsLayout,
  resetStore,
  challengeNavigationAlertDialogRef,
  navigationGuard,
  isNew,
  from,
  roadmapNode,
  roadmapRevisionKey,
  roadmapContextLocalstorage,
  secondCounterLocalstorage,
}: ChallengePageParams) {
  const { currentRoute, goTo } = navigationProvider
  const resetStoreRef = useRef(resetStore)
  resetStoreRef.current = resetStore
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { requestNavigation, confirmNavigation, cancelNavigation } = navigationGuard

  function handleBackButtonClick() {
    if (!challenge) return
    secondCounterLocalstorage.remove()
    resetStore()
    if (roadmapNode && isValidRoadmapContext(from, roadmapNode, challenge)) {
      analytics.trackEvent('challenge_roadmap_returned', {
        revisionKey: roadmapRevisionKey,
        nodeKey: roadmapNode,
        challengeId: challenge.id.value,
      })
      roadmapContextLocalstorage.remove()
      goTo(`/challenging/roadmap?node=${encodeURIComponent(roadmapNode)}`)
      return
    }
    goTo(challenge.isFromStar.isTrue ? '/space' : '/challenging/challenges')
  }
  function handleResetLayoutButtonClick() {
    resetPanelsLayout()
  }
  function handlePreviousChallengeClick() {
    if (previousChallengeSlug)
      requestNavigation(`/challenging/challenges/${previousChallengeSlug}/challenge`)
  }
  function handleNextChallengeClick() {
    if (nextChallengeSlug)
      requestNavigation(`/challenging/challenges/${nextChallengeSlug}/challenge`)
  }
  function handleOpenSidebar() {
    setIsSidebarOpen(true)
  }
  function handleCloseSidebar() {
    setIsSidebarOpen(false)
  }
  function handleSidebarChallengeSelect(slug: string) {
    goTo(`/challenging/challenges/${slug}/challenge`)
  }

  useEffect(() => {
    if (shouldHydrateChallenge(challengeDto, userChallengeVote, challenge)) {
      const nextChallenge = Challenge.create(challengeDto)
      nextChallenge.userVote = ChallengeVote.create(userChallengeVote)
      setChallenge(nextChallenge)
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
    if (challenge && !craftsVislibility && !isAccountAuthenticated)
      setCraftsVislibility(
        ChallengeCraftsVisibility.create({
          canShowComments: true,
          canShowSolutions: false,
        }),
      )
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
    const segments = currentRoute.split('/').filter(Boolean)
    if (segments.lastIndexOf('solutions') !== -1) {
      setActiveContent('solutions')
      return
    }
    const activeContent = segments.at(-1)
    if (!activeContent) return
    if (activeContent === 'challenge') {
      setActiveContent('description')
      return
    }
    if (activeContent !== challenge.slug.value)
      setActiveContent(activeContent as ChallengeContent)
  }, [currentRoute, challenge, setActiveContent])

  useEffect(() => () => resetStoreRef.current(), [])

  return {
    challengeTitle: challenge?.title.value ?? null,
    panelOrder,
    shouldHaveConfettiAnimation:
      challenge && user && isNew ? challenge.author.isEqualTo(user).isTrue : false,
    previousChallengeSlug,
    nextChallengeSlug,
    isSidebarOpen,
    challengeSlug: challengeDto.slug ?? '',
    challengeNavigationAlertDialogRef,
    confirmNavigation,
    cancelNavigation,
    handleBackButtonClick,
    handleResetLayoutButtonClick,
    handlePreviousChallengeClick,
    handleNextChallengeClick,
    handleOpenSidebar,
    handleCloseSidebar,
    handleSidebarChallengeSelect,
    backButtonLabel:
      challenge && roadmapNode && isValidRoadmapContext(from, roadmapNode, challenge)
        ? 'Voltar ao roadmap'
        : 'Sair do desafio',
  }
}
