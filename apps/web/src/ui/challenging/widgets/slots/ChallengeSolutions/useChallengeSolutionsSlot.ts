'use client'

import { useEffect, useState } from 'react'

import { Solution } from '@stardust/core/challenging/entities'
import type { SolutionsListSorter } from '@stardust/core/challenging/types'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { useApi } from '@/ui/global/hooks/useApi'
import type { PopoverMenuButton } from '@/ui/global/widgets/components/PopoverMenu/types'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

const SOLUTIONS_PER_PAGE = 15

export function useChallengeSolutionsSlot() {
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const [sorter, setSorter] = useState<SolutionsListSorter>('date')
  const [solutionTitle, setSolutionTitle] = useState('')
  const [isFromUser, setIsFromUser] = useState(false)
  const { user } = useAuthContext()
  const api = useApi()

  async function fetchSolutionsList(page: number) {
    const response = await api.fetchSolutionsList({
      page,
      title: solutionTitle,
      itemsPerPage: SOLUTIONS_PER_PAGE,
      sorter,
      userId: isFromUser ? String(user?.id) : null,
      challengeId: String(challenge?.id),
    })
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, isLoading, isRecheadedEnd, nextPage } = usePaginatedCache({
    key: CACHE.keys.challengesList,
    fetcher: fetchSolutionsList,
    itemsPerPage: SOLUTIONS_PER_PAGE,
    isInfinity: true,
    isEnabled: Boolean(user && challenge),
    shouldRefetchOnFocus: false,
    dependencies: [solutionTitle, sorter],
  })

  function handleSolutionTitleChange(title: string) {
    setSolutionTitle(title)
  }

  function handleSorterChange(sorter: SolutionsListSorter) {
    setSorter(sorter)
  }

  function handleIsFromUserChange(isFromUser: boolean) {
    setIsFromUser(isFromUser)
  }

  const popoverMenuButtons: PopoverMenuButton[] = [
    {
      title: 'Mais recentes',
      isToggle: true,
      value: sorter === 'date',
      action: () => handleSorterChange('date'),
    },
    {
      title: 'Mais votados',
      isToggle: true,
      value: sorter === 'upvotesCount',
      action: () => handleSorterChange('upvotesCount'),
    },
    {
      title: 'Mais comentados',
      isToggle: true,
      value: sorter === 'commentsCount',
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
    nextPage,
    handleIsFromUserChange,
    handleSolutionTitleChange,
  }
}
