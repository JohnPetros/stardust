'use client'

import { Solution } from '@stardust/core/challenging/entities'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { useApi } from '@/ui/global/hooks/useApi'
import type { TabListSorter } from '../../TabListSorter'

const SOLUTIONS_PER_PAGE = 30

export function useSolutionsListTab(tabListSorter: TabListSorter, userId: string) {
  const api = useApi()

  async function fetchSolutionsList(page: number) {
    const response = await api.fetchSolutionsList({
      page,
      title: '',
      itemsPerPage: SOLUTIONS_PER_PAGE,
      sorter: tabListSorter,
      userId: userId,
      challengeId: null,
    })
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, isLoading, isRecheadedEnd, nextPage } = usePaginatedCache({
    key: CACHE.keys.solutionsList,
    fetcher: fetchSolutionsList,
    itemsPerPage: SOLUTIONS_PER_PAGE,
    isInfinity: true,
    shouldRefetchOnFocus: false,
    dependencies: [tabListSorter],
  })

  return {
    solutions: data.map(Solution.create),
    isRecheadedEnd,
    isLoading,
    nextPage,
  }
}
