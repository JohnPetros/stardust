import { useState } from 'react'

import { Solution } from '@stardust/core/challenging/entities'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import type { PopoverMenuButton } from '@/ui/global/widgets/components/PopoverMenu/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Id, OrdinalNumber, Text } from '@stardust/core/global/structures'
import { SolutionsListingSorter } from '@stardust/core/challenging/structures'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'

const SOLUTIONS_PER_PAGE = OrdinalNumber.create(15)

export function useChallengeSolutionsSlot(challengingService: ChallengingService) {
  const [sorter, setSorter] = useState<SolutionsListingSorter>(
    SolutionsListingSorter.create('date'),
  )
  const [solutionTitle, setSolutionTitle] = useState('')
  const [isFromUser, setIsFromUser] = useState(false)
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const { user } = useAuthContext()

  async function fetchSolutionsList(page: number) {
    const response = await challengingService.fetchSolutionsList({
      page: OrdinalNumber.create(page),
      title: Text.create(solutionTitle),
      itemsPerPage: SOLUTIONS_PER_PAGE,
      sorter,
      userId: isFromUser ? Id.create(user?.id.value) : null,
      challengeId: Id.create(challenge?.id.value),
    })
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, isLoading, isRecheadedEnd, nextPage } = usePaginatedCache({
    key: CACHE.keys.solutionsList,
    fetcher: fetchSolutionsList,
    itemsPerPage: SOLUTIONS_PER_PAGE.value,
    isInfinity: true,
    isEnabled: Boolean(user && challenge),
    shouldRefetchOnFocus: false,
    dependencies: [solutionTitle, sorter],
  })

  function handleSolutionTitleChange(title: string) {
    setSolutionTitle(title)
  }

  function handleSorterChange(sorter: string) {
    setSorter(SolutionsListingSorter.create(sorter))
  }

  function handleIsFromUserChange(isFromUser: boolean) {
    setIsFromUser(isFromUser)
  }

  const popoverMenuButtons: PopoverMenuButton[] = [
    {
      title: 'Mais recentes',
      isToggle: true,
      value: sorter.isDate.isTrue,
      action: () => handleSorterChange('date'),
    },
    {
      title: 'Mais votados',
      isToggle: true,
      value: sorter.isUpvotesCount.isTrue,
      action: () => handleSorterChange('upvotesCount'),
    },
    {
      title: 'Mais comentados',
      isToggle: true,
      value: sorter.isCommentsCount.isTrue,
      action: () => handleSorterChange('commentsCount'),
    },
  ]

  return {
    sorter,
    solutions: data.map(Solution.create),
    solutionTitle,
    isFromUser,
    isLoading,
    isRecheadedEnd,
    popoverMenuButtons,
    challengeSlug: challenge?.slug.value ?? '',
    isChallengeCompleted:
      challenge && user && user.hasCompletedChallenge(challenge.id).isTrue,
    nextPage,
    handleIsFromUserChange,
    handleSolutionTitleChange,
  }
}
